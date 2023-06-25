import {
  Client,
  Events,
  GuildEmoji,
  Message,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  Sticker,
  User,
} from "discord.js";
import dayjs from "dayjs";
import { InsertObject } from "kysely/dist/cjs/parser/insert-values-parser";
import Context from "../model/context";
import { EventHandlerFn } from "./EventHandler";
import db from "../model/db";
import {
  AppPublicEmojiStickerActionType,
  AppPublicGuildAssetType,
  DB,
} from "../model/dbTypes";
import logger from "../logger";

const EMOJI_RE = /<(?<animated>a)?:(?<name>\w+):(?<id>\d{16,21})>/g;

export const UserEmojiRateLimitDuration = dayjs.duration({ hours: 1 });

type NewExpressionStat = {
  guild_id: string;
  asset_id: string;
  asset_type: AppPublicGuildAssetType;
  count: number;
};

type NewExpressionStatWithGuild = NewExpressionStat & {
  is_external: boolean;
};

async function incrementEmojiCounts(
  userId: string,
  actionType: AppPublicEmojiStickerActionType,
  values: NewExpressionStat[]
): Promise<void> {
  // Check the guilds the emoji is from
  const knownEmojis = await db
    .selectFrom("app_public.guild_emojis_and_stickers")
    .selectAll()
    .where(
      "id",
      "in",
      values.map((v) => v.asset_id)
    )
    .execute();

  // Exclude the ones that aren't found in db, from a server sushii isn't in
  const foundEmojiIds = new Map(knownEmojis.map((r) => [r.id, r]));

  const valuesKnown: NewExpressionStatWithGuild[] = values
    .filter((v) => foundEmojiIds.has(v.asset_id))
    .map((v) => {
      const guildEmoji = foundEmojiIds.get(v.asset_id);

      return {
        ...v,
        // If message guild_id is different from emoji guild_id, it's an external emoji
        is_external: guildEmoji?.guild_id !== v.guild_id,
      };
    });

  // No emojis found that are in the database, shared w sushii
  if (valuesKnown.length === 0) {
    return;
  }

  // TODO: Modify emoji counts for is_external

  // Check if user already contributed to metrics in the past hour
  // Does not need to know if this is a sticker or not
  const rateLimitedAssets = await db
    .selectFrom("app_public.emoji_sticker_stats_rate_limits")
    .select(["asset_id"])
    // All values are the same user
    .where("user_id", "=", userId)
    .where("action_type", "=", actionType)
    .where(
      "asset_id",
      "in",
      valuesKnown.map((v) => v.asset_id)
    )
    // Within the past hour, ignore any older entries which are deleted later
    .where(
      "last_used",
      ">=",
      dayjs.utc().subtract(UserEmojiRateLimitDuration).toDate()
    )
    .execute();

  const assetIdSet = new Set<string>(
    rateLimitedAssets.map((ra) => ra.asset_id)
  );

  // Remove the ratelimited users from the values
  const eligibleVals = values.filter((v) => !assetIdSet.has(v.asset_id));

  logger.debug(
    {
      userId,
      ratelimitedAssets: rateLimitedAssets,
      eligibleCount: eligibleVals.length,
    },
    "Emoji rate limited emoji+users"
  );

  if (eligibleVals.length === 0) {
    // No values to insert
    return;
  }

  await db
    .insertInto("app_public.emoji_sticker_stats")
    // Add actionType to all values
    .values(eligibleVals.map((v) => ({ ...v, action_type: actionType })))
    .onConflict((oc) =>
      oc.columns(["time", "guild_id", "asset_id", "action_type"]).doUpdateSet({
        count: (eb) => eb.bxp("app_public.emoji_sticker_stats.count", "+", "1"),
      })
    )
    .execute();

  // Insert the assets_id into the rate limit table
  await db
    .insertInto("app_public.emoji_sticker_stats_rate_limits")
    .values(
      eligibleVals.map((v) => ({
        user_id: userId,
        asset_id: v.asset_id,
        action_type: actionType,
        last_used: dayjs.utc().toDate(),
      }))
    )
    .onConflict((oc) =>
      // Conflict if there is an older entry, as it's not queried to check if user is rate limited.
      // Update the last_used time in the existing entry
      oc.columns(["user_id", "asset_id", "action_type"]).doUpdateSet({
        last_used: dayjs.utc().toDate(),
      })
    )
    .execute();
}

export const emojiStatsMsgHandler: EventHandlerFn<
  Events.MessageCreate
> = async (ctx: Context, msg: Message): Promise<void> => {
  if (!msg.inGuild()) {
    return;
  }

  const matches = msg.content.matchAll(EMOJI_RE);

  // Set to ensure unique emoji ids and no duplicates.
  // We don't care about multiple uses per message, just 1 per message per
  // emoji.
  const uniqueEmojiIds = new Set<string>();

  for (const match of matches) {
    uniqueEmojiIds.add(match.groups?.id ?? "");
  }

  // No emojis in message
  if (uniqueEmojiIds.size === 0) {
    return;
  }

  const values: NewExpressionStat[] = Array.from(uniqueEmojiIds).map(
    (emojiId) => ({
      guild_id: msg.guild.id,
      asset_id: emojiId,
      asset_type: "emoji",
      count: 1,
    })
  );

  // Add stickers if any
  if (msg.stickers.size > 0) {
    const stickers: NewExpressionStat[] = msg.stickers.map((s) => ({
      guild_id: msg.guild.id,
      asset_id: s.id,
      asset_type: "sticker",
      count: 1,
    }));

    values.push(...stickers);
  }

  if (values.length === 0) {
    return;
  }

  await incrementEmojiCounts(msg.author.id, "message", values);
};

export const emojiStatsReactHandler: EventHandlerFn<
  Events.MessageReactionAdd
> = async (
  ctx: Context,
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser
): Promise<void> => {
  // DM message
  if (!reaction.message.inGuild()) {
    return;
  }

  // No emoji id, skip, maybe a unicode emoji
  if (!reaction.emoji.id) {
    return;
  }

  await incrementEmojiCounts(user.id, "reaction", [
    {
      guild_id: reaction.message.guild.id,
      asset_id: reaction.emoji.id,
      asset_type: "emoji",
      count: 1,
    },
  ]);
};

export const emojiAndStickerStatsReadyHandler: EventHandlerFn<
  Events.ClientReady
> = async (ctx: Context, client: Client<true>): Promise<void> => {
  for (const [, guild] of client.guilds.cache) {
    // Update database with all the emojis and stickers
    const emojis = Array.from(guild.emojis.cache.values());
    const stickers = Array.from(guild.stickers.cache.values());

    const values: InsertObject<DB, "app_public.guild_emojis_and_stickers">[] =
      emojis.map((e) => ({
        id: e.id,
        guild_id: guild.id,
        name: e.name || "", // Shouldn't be null, but just in case
        type: "emoji",
      }));

    const stickerValues: InsertObject<
      DB,
      "app_public.guild_emojis_and_stickers"
    >[] = stickers.map((s) => ({
      id: s.id,
      guild_id: guild.id,
      name: s.name,
      type: "sticker",
    }));

    // Add stickers
    values.push(...stickerValues);

    // eslint-disable-next-line no-await-in-loop
    await db
      .insertInto("app_public.guild_emojis_and_stickers")
      .values(values)
      // Ignore any existing emojis
      .onConflict((oc) => oc.doNothing())
      .execute();
  }
};

async function addGuildEmojiOrSticker(
  guildId: string,
  assetId: string,
  name: string,
  type: AppPublicGuildAssetType
): Promise<void> {
  await db
    .insertInto("app_public.guild_emojis_and_stickers")
    .values({
      guild_id: guildId,
      id: assetId,
      name,
      type,
    })
    // When updating asset
    .onConflict((oc) =>
      oc.doUpdateSet({
        name,
      })
    )
    .execute();
}

export const emojiAddHandler: EventHandlerFn<Events.GuildEmojiCreate> = async (
  ctx: Context,
  emoji: GuildEmoji
) => {
  await addGuildEmojiOrSticker(
    emoji.guild.id,
    emoji.id,
    emoji.name || "",
    "emoji"
  );
};

export const emojiUpdateHandler: EventHandlerFn<
  Events.GuildEmojiUpdate
> = async (ctx: Context, emoji: GuildEmoji) => {
  await addGuildEmojiOrSticker(
    emoji.guild.id,
    emoji.id,
    emoji.name || "",
    "emoji"
  );
};

export const stickerAddHandler: EventHandlerFn<
  Events.GuildStickerCreate
> = async (ctx: Context, sticker: Sticker) => {
  if (sticker.guildId === null) {
    return;
  }

  await addGuildEmojiOrSticker(
    sticker.guildId,
    sticker.id,
    sticker.name,
    "sticker"
  );
};

export const stickerUpdateHandler: EventHandlerFn<
  Events.GuildStickerUpdate
> = async (ctx: Context, sticker: Sticker) => {
  if (sticker.guildId === null) {
    return;
  }

  await addGuildEmojiOrSticker(
    sticker.guildId,
    sticker.id,
    sticker.name,
    "sticker"
  );
};

// Ignore emoji/sticker deletes since we want to keep those
