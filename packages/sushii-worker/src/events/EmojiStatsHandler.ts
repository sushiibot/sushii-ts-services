import {
  Events,
  Message,
  MessageReaction,
  PartialMessageReaction,
} from "discord.js";
import { InsertObjectOrList } from "kysely/dist/cjs/parser/insert-values-parser";
import { InsertResult } from "kysely";
import Context from "../model/context";
import { EventHandlerFn } from "./EventHandler";
import db from "../model/db";
import { DB } from "../model/dbTypes";
import logger from "../logger";

const EMOJI_RE = /<(?<animated>a)?:(?<name>\w+):(?<id>\d{16,21})>/g;

async function incrementEmojiCounts(
  values: InsertObjectOrList<DB, "app_public.emoji_sticker_stats">
): Promise<InsertResult[]> {
  return db
    .insertInto("app_public.emoji_sticker_stats")
    .values(values)
    .onConflict((oc) =>
      oc.columns(["time", "guild_id", "asset_id", "action_type"]).doUpdateSet({
        count: (eb) => eb.bxp("app_public.emoji_sticker_stats.count", "+", "1"),
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

  const values: InsertObjectOrList<DB, "app_public.emoji_sticker_stats"> =
    Array.from(uniqueEmojiIds).map((emojiId) => ({
      guild_id: msg.guild.id,
      asset_id: emojiId,
      action_type: "message",
      asset_type: "emoji",
      count: 1,
    }));

  await incrementEmojiCounts(values);
};

export const emojiStatsReactHandler: EventHandlerFn<
  Events.MessageReactionAdd
> = async (
  ctx: Context,
  reaction: MessageReaction | PartialMessageReaction
  // user: User | PartialUser
): Promise<void> => {
  logger.debug({ reaction }, "emojiStatsReactHandler");

  // DM message
  if (!reaction.message.inGuild()) {
    return;
  }

  // No emoji id, skip, maybe a unicode emoji
  if (!reaction.emoji.id) {
    return;
  }

  await incrementEmojiCounts({
    guild_id: reaction.message.guild.id,
    asset_id: reaction.emoji.id,
    action_type: "reaction",
    asset_type: "emoji",
    count: 1,
  });
};
