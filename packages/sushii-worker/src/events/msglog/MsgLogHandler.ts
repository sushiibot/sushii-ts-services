import {
  AnyThreadChannel,
  EmbedBuilder,
  Events,
  GatewayDispatchEvents,
  messageLink,
  APIMessage,
  GatewayMessageDeleteBulkDispatchData,
  GatewayMessageDeleteDispatchData,
  GatewayMessageUpdateDispatchData,
} from "discord.js";
import { None, Option, Some } from "ts-results";
import { Selectable } from "kysely";
import { AppPublicMessages, AppPublicMsgLogBlocks } from "../../model/dbTypes";
import SushiiEmoji from "../../constants/SushiiEmoji";
import Context from "../../model/context";
import buildChunks from "../../utils/buildChunks";
import Color from "../../utils/colors";
import { newModuleLogger } from "../../logger";
import db from "../../model/db";
import { EventHandlerFn } from "../EventHandler";
import { getAPIUserTag } from "../../utils/APIUser";
import { getGuildConfig } from "../../db/GuildConfig/GuildConfig.repository";

const log = newModuleLogger("MsgLogHandler");

type EventData =
  | GatewayMessageDeleteDispatchData
  | GatewayMessageDeleteBulkDispatchData
  | GatewayMessageUpdateDispatchData;

function quoteMarkdownString(str: string): string {
  return str.split("\n").join("\n> ");
}

export function isChannelIgnored(
  eventType: GatewayDispatchEvents,
  blockType: Selectable<AppPublicMsgLogBlocks>["block_type"],
): boolean {
  if (
    eventType === GatewayDispatchEvents.MessageDelete ||
    eventType === GatewayDispatchEvents.MessageDeleteBulk
  ) {
    // True / blocked if block type is delete or all
    return blockType === "deletes" || blockType === "all";
  }

  if (eventType === GatewayDispatchEvents.MessageUpdate) {
    // True / blocked if block type is edit or all
    return blockType === "edits" || blockType === "all";
  }

  return false;
}

function getMessageIDs(event: EventData): string[] {
  if ("id" in event) {
    return [event.id];
  }

  if ("ids" in event) {
    return event.ids;
  }

  throw new Error("Invalid event data");
}

function buildDeleteEmbed(
  ctx: Context,
  event: EventData,
  message: Selectable<AppPublicMessages>,
): EmbedBuilder {
  let description = `${SushiiEmoji.MessageDelete} **Message deleted in <#${event.channel_id}>**\n`;

  // lol
  const msg = message.msg as any as APIMessage;

  if (message.content) {
    description += msg.content;
    description += "\n";
  }

  const fields = [];

  if (msg.sticker_items && msg.sticker_items.length > 0) {
    const sticker = msg.sticker_items[0];
    const stickerURL = ctx.CDN.sticker(sticker.id);

    fields.push({
      name: "Stickers",
      value: `[${sticker.name}](${stickerURL})`,
    });
  }

  if (msg.attachments && msg.attachments.length > 0) {
    let attachments = msg.attachments
      .map((a) => `[${a.filename}](${a.proxy_url})`)
      .join("\n")
      .substring(0, 1024);

    // Trim off the last new line
    // TODO: Use multiple embeds instead of removing trimming
    const lastNewline = attachments.lastIndexOf("\n");
    if (lastNewline !== -1) {
      attachments = attachments.substring(0, lastNewline);
    }

    fields.push({
      name: "Attachments",
      value: attachments,
    });
  }

  if (msg.referenced_message) {
    const replied = msg.referenced_message.id;
    // Guild ID will always exist, checked in parent handler
    const repliedURL = messageLink(
      message.channel_id,
      replied,
      event.guild_id!,
    );

    fields.push({
      name: "Replied to",
      value: `<@${msg.referenced_message.author.id}> ${repliedURL}`,
    });
  }

  const authorIcon = msg.author.avatar
    ? ctx.CDN.avatar(msg.author.id, msg.author.avatar)
    : ctx.CDN.defaultAvatar(parseInt(msg.author.discriminator, 10));

  const authorTag = getAPIUserTag(msg.author);

  return new EmbedBuilder()
    .setAuthor({
      name: `${authorTag} (ID: ${msg.author.id})`,
      iconURL: authorIcon || undefined,
    })
    .setDescription(description)
    .setColor(Color.Error)
    .setFields(fields)
    .setFooter({
      text: `Message ID: ${message.message_id}`,
    })
    .setTimestamp(new Date());
}

function buildEditEmbed(
  ctx: Context,
  event: EventData,
  message: Selectable<AppPublicMessages>,
): Option<EmbedBuilder> {
  const updateEvent = event as GatewayMessageUpdateDispatchData;

  // Ignore edits for messages without content
  if (!updateEvent.content) {
    return None;
  }

  // No changes, e.g. could be proxy url updated
  if (updateEvent.content === message.content) {
    return None;
  }

  // Is this Partial<API.Message>?
  const msg = message.msg as any as APIMessage;

  let description = `${SushiiEmoji.MessageEdit} **Message edited in <#${event.channel_id}>**\n`;
  description += "**Before:**";
  description += "\n";
  description += quoteMarkdownString(message.content);
  description += "\n";
  description += "**After:**";
  description += "\n";
  description += quoteMarkdownString(updateEvent.content);

  const authorIcon = msg.author.avatar
    ? ctx.CDN.avatar(msg.author.id, msg.author.avatar)
    : ctx.CDN.defaultAvatar(parseInt(msg.author.discriminator, 10));

  const embed = new EmbedBuilder()
    .setAuthor({
      name: `${msg.author.username}#${msg.author.discriminator} (ID: ${msg.author.id})`,
      iconURL: authorIcon || undefined,
    })
    .setDescription(description.substring(0, 4096))
    .setColor(Color.Info)
    .setTimestamp(new Date());

  return Some(embed);
}

function buildBulkDeleteEmbed(
  ctx: Context,
  event: GatewayMessageDeleteBulkDispatchData,
  messages: Selectable<AppPublicMessages>[],
): EmbedBuilder[] {
  const deleteCount = messages.length.toLocaleString();
  // No new-line at the end of this since it's joined in buildChunks
  const description = `${SushiiEmoji.MessageDelete} **${deleteCount} messages deleted in <#${event.channel_id}>**`;

  const messagesStrs = messages.map((m) => {
    let msgStr = `<@${m.author_id}>: `;

    if (m.content) {
      msgStr += `${m.content}`;
    }

    const msg = m.msg as any as APIMessage;

    if (msg.sticker_items && msg.sticker_items.length > 0) {
      const sticker = msg.sticker_items[0];
      const stickerURL = ctx.CDN.sticker(sticker.id);

      // Can have both message and sticker
      // Technically can have multiple stickers but users can only send 1
      msgStr += `\n> **Sticker:** [${sticker.name}](${stickerURL})`;
    }

    if (msg.attachments && msg.attachments.length > 0) {
      const attachments = msg.attachments
        .map((a) => `> [${a.filename}](${a.proxy_url})`)
        .join("\n");

      // TODO: Escape emojis
      // We don't know which emojis sushii knows, don't want to rely on cache
      // So we can just add additional details at the bottom embed.
      // msg.content = msg.content.replace(EMOJI_RE, "`$&`");

      // Multiple attachments
      msgStr += `\n> **Attachments:**\n${attachments}`;
    }

    return msgStr;
  });

  // Split into chunks of 4096 characters
  const embedChunks = buildChunks([description, ...messagesStrs], "\n", 4096);

  // Build an embed for each chunk
  const embeds = embedChunks.map((chunk) =>
    new EmbedBuilder().setDescription(chunk).setColor(Color.Error),
  );

  // Add timestamp to last embed
  embeds[embeds.length - 1] = embeds[embeds.length - 1].setTimestamp(
    new Date(),
  );

  return embeds;
}

function buildEmbeds(
  ctx: Context,
  eventType: GatewayDispatchEvents,
  event: EventData,
  messages: Selectable<AppPublicMessages>[],
): Option<EmbedBuilder[]> {
  if (eventType === GatewayDispatchEvents.MessageDelete && event) {
    const embed = buildDeleteEmbed(ctx, event, messages[0]);

    return Some([embed]);
  }

  if (eventType === GatewayDispatchEvents.MessageDeleteBulk) {
    const embeds = buildBulkDeleteEmbed(
      ctx,
      event as GatewayMessageDeleteBulkDispatchData,
      messages,
    );

    return Some(embeds);
  }

  if (eventType === GatewayDispatchEvents.MessageUpdate) {
    return buildEditEmbed(ctx, event, messages[0]).map((e) => [e]);
  }

  throw new Error(`Invalid event type ${eventType}`);
}

export async function msgLogHandler(
  ctx: Context,
  eventType:
    | GatewayDispatchEvents.MessageDelete
    | GatewayDispatchEvents.MessageDeleteBulk
    | GatewayDispatchEvents.MessageUpdate,
  payload: EventData,
): Promise<void> {
  // Ignore dms
  if (!payload.guild_id) {
    return;
  }

  const guildConfig = await getGuildConfig(db, payload.guild_id);

  // No guild config found, ignore
  if (
    !guildConfig.log_msg || // No msg log set
    !guildConfig.log_msg_enabled // Msg log disabled
  ) {
    return;
  }

  // Get ignored msg logs
  const channelBlock = await db
    .selectFrom("app_public.msg_log_blocks")
    .selectAll()
    .where("guild_id", "=", payload.guild_id)
    .where("channel_id", "=", payload.channel_id)
    .executeTakeFirst();

  if (channelBlock && isChannelIgnored(eventType, channelBlock.block_type)) {
    return;
  }

  const messageIDs = getMessageIDs(payload);

  const messages = await db
    .selectFrom("app_public.messages")
    .selectAll()
    // Don't need to filter by guild_id or channel_id since the message ids will
    // only come from the same guild and channel, and would make index not work
    .where("message_id", "in", messageIDs)
    // Oldest message is first, newest is at the bottom most embed
    .orderBy("created", "asc")
    .execute();

  // No cached message found for deleted or edited message in DB, ignore
  if (messages.length === 0) {
    return;
  }

  const embeds = buildEmbeds(ctx, eventType, payload, messages);

  if (embeds.none) {
    // No embed to send, could be just proxy url getting updated
    return;
  }

  if (embeds.val.length === 0) {
    return;
  }

  const channel = ctx.client.channels.cache.get(guildConfig.log_msg);
  if (!channel || !channel.isTextBased()) {
    log.warn(
      {
        guildId: payload.guild_id,
        channelId: guildConfig.log_msg,
      },
      "Log msg channel not found or not text based",
    );
    return;
  }

  // Only attempt if first chunk fails, likely due to permission error so don't try
  // all chunks
  try {
    // Split embeds into chunks of 10
    const chunkSize = 10;
    for (let i = 0; i < embeds.val.length; i += chunkSize) {
      const chunk = embeds.val.slice(i, i + chunkSize).map((e) => e.toJSON());

      // eslint-disable-next-line no-await-in-loop
      await channel.send({
        embeds: chunk,
      });
    }
  } catch (err) {
    log.warn(
      {
        guildId: payload.guild_id,
        channelId: guildConfig.log_msg,
        error: err,
      },
      "Failed to send message log",
    );
  }
}

export const threadDeleteHandler: EventHandlerFn<Events.ThreadDelete> = async (
  ctx: Context,
  thread: AnyThreadChannel,
): Promise<void> => {
  const guildConfig = await getGuildConfig(db, thread.guildId);

  if (
    !guildConfig.log_msg || // No msg log set
    !guildConfig.log_msg_enabled // Msg log disabled
  ) {
    return;
  }

  // const threadOwner = await thread.fetchOwner();
  const parentChannel = thread.parent;

  if (!parentChannel) {
    throw new Error("Thread has no parent channel");
  }

  // const embed = buildThreadDeleteEmbed(thread, threadOwner);

  // const threadMessages = await db
  //   .selectFrom("app_public.messages")
  //   .selectAll()
  //   .where("channel_id", "in", thread.id)
  //   // Oldest message is first, newest is at the bottom most embed
  //   .orderBy("created", "asc")
  //   .execute();
};
