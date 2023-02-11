import { EmbedBuilder } from "@discordjs/builders";
import {
  APIMessage,
  GatewayDispatchEvents,
  GatewayMessageDeleteBulkDispatchData,
  GatewayMessageDeleteDispatchData,
  GatewayMessageUpdateDispatchData,
} from "discord-api-types/v10";
import { None, Option, Some } from "ts-results";
import SushiiEmoji from "../constants/SushiiEmoji";
import { Message, MsgLogBlockType } from "../generated/graphql";
import Context from "../model/context";
import buildChunks from "../utils/buildChunks";
import Color from "../utils/colors";
import EventHandler from "./EventHandler";

type EventData =
  | GatewayMessageDeleteDispatchData
  | GatewayMessageDeleteBulkDispatchData
  | GatewayMessageUpdateDispatchData;

function quoteMarkdownString(str: string): string {
  return str.split("\n").join("\n> ");
}

export function isChannelIgnored(
  eventType: GatewayDispatchEvents,
  blockType: MsgLogBlockType
): boolean {
  if (
    eventType === GatewayDispatchEvents.MessageDelete ||
    eventType === GatewayDispatchEvents.MessageDeleteBulk
  ) {
    // True / blocked if block type is delete or all
    return (
      blockType === MsgLogBlockType.Deletes || blockType === MsgLogBlockType.All
    );
  }

  if (eventType === GatewayDispatchEvents.MessageUpdate) {
    // True / blocked if block type is edit or all
    return (
      blockType === MsgLogBlockType.Edits || blockType === MsgLogBlockType.All
    );
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
  message: Message
): EmbedBuilder {
  let description = `${SushiiEmoji.MessageDelete} **Message deleted in <#${event.channel_id}>**\n`;

  const msg = message.msg as APIMessage;

  if (message.content) {
    description += msg.content;
    description += "\n";
  }

  if (msg.sticker_items && msg.sticker_items.length > 0) {
    const sticker = msg.sticker_items[0];
    const stickerURL = ctx.CDN.cdn.sticker(sticker.id);

    description += "**Stickers**";
    description += "\n";
    description += `> [${sticker.name}](${stickerURL})`;
    description += "\n";
  }

  if (msg.attachments && msg.attachments.length > 0) {
    const attachments = msg.attachments
      .map((a) => `> [${a.filename}](${a.url})`)
      .join("\n");

    description += "**Attachments**";
    description += "\n";
    description += attachments;
  }

  const authorIcon = ctx.CDN.userFaceURL(msg.author);

  return new EmbedBuilder()
    .setAuthor({
      name: `${msg.author.username}#${msg.author.discriminator} (ID: ${msg.author.id})`,
      iconURL: authorIcon || undefined,
    })
    .setDescription(description)
    .setColor(Color.Error)
    .setTimestamp(new Date());
}

function buildEditEmbed(
  ctx: Context,
  event: EventData,
  message: Message
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
  const msg = message.msg as APIMessage;

  let description = `${SushiiEmoji.MessageEdit} **Message edited in <#${event.channel_id}>**\n`;
  description += "**Before:**";
  description += "\n";
  description += quoteMarkdownString(message.content);
  description += "\n";
  description += "**After:**";
  description += "\n";
  description += quoteMarkdownString(updateEvent.content);

  const authorIcon = ctx.CDN.userFaceURL(msg.author);

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
  messages: Message[]
): EmbedBuilder[] {
  const deleteCount = messages.length.toLocaleString();
  // No new-line at the end of this since it's joined in buildChunks
  const description = `${SushiiEmoji.MessageDelete} **${deleteCount} messages deleted in <#${event.channel_id}>**`;

  const messagesStrs = messages.map((m) => {
    if (m.content) {
      return `<@${m.authorId}>: ${m.content}`;
    }

    const msg = m.msg as APIMessage;

    if (msg.sticker_items && msg.sticker_items.length > 0) {
      const sticker = msg.sticker_items[0];
      const stickerURL = ctx.CDN.cdn.sticker(sticker.id);

      // Can have both message and sticker
      if (msg.content) {
        return `<@${m.authorId}>: ${msg.content}\n> **Sticker:** [${sticker.name}](${stickerURL})`;
      }

      return `<@${m.authorId}>: [${sticker.name}](${stickerURL})`;
    }

    if (msg.attachments && msg.attachments.length > 0) {
      const attachments = msg.attachments
        .map((a) => `> [${a.filename}](${a.url})`)
        .join("\n");

      if (msg.content) {
        return `<@${m.authorId}>: ${msg.content}\n> **Attachments:**\n${attachments}`;
      }

      // Multiple attachments
      return `<@${m.authorId}>: **Attachments:**\n${attachments}`;
    }

    return `<@${m.authorId}>: ${m.content}`;
  });

  // Split into chunks of 4096 characters
  const embedChunks = buildChunks([description, ...messagesStrs], "\n", 4096);

  // Build an embed for each chunk
  const embeds = embedChunks.map((chunk) =>
    new EmbedBuilder().setDescription(chunk).setColor(Color.Error)
  );

  // Add timestamp to last embed
  embeds[embeds.length - 1] = embeds[embeds.length - 1].setTimestamp(
    new Date()
  );

  return embeds;
}

function buildEmbeds(
  ctx: Context,
  eventType: GatewayDispatchEvents,
  event: EventData,
  messages: Message[]
): Option<EmbedBuilder[]> {
  if (eventType === GatewayDispatchEvents.MessageDelete && event) {
    const embed = buildDeleteEmbed(ctx, event, messages[0]);

    return Some([embed]);
  }

  if (eventType === GatewayDispatchEvents.MessageDeleteBulk) {
    const embeds = buildBulkDeleteEmbed(
      ctx,
      event as GatewayMessageDeleteBulkDispatchData,
      // Reverse so the oldest message is first, newest is at the bottom most embed
      messages.reverse()
    );

    return Some(embeds);
  }

  if (eventType === GatewayDispatchEvents.MessageUpdate) {
    return buildEditEmbed(ctx, event, messages[0]).map((e) => [e]);
  }

  throw new Error(`Invalid event type ${eventType}`);
}

export default class MsgLogHandler extends EventHandler {
  eventTypes = [
    GatewayDispatchEvents.MessageDelete,
    GatewayDispatchEvents.MessageDeleteBulk,
    GatewayDispatchEvents.MessageUpdate,
  ];

  async handler(
    ctx: Context,
    eventType: GatewayDispatchEvents,
    event: EventData
  ): Promise<void> {
    // Ignore dms
    if (!event.guild_id) {
      return;
    }

    const { guildConfigById } = await ctx.sushiiAPI.sdk.guildConfigByID({
      guildId: event.guild_id,
    });

    // No guild config found, ignore
    if (
      !guildConfigById || // Config not found
      !guildConfigById.logMsg || // No msg log set
      !guildConfigById.logMsgEnabled // Msg log disabled
    ) {
      return;
    }

    // Get ignored msg logs
    const { msgLogBlockByGuildIdAndChannelId: channelBlock } =
      await ctx.sushiiAPI.sdk.getMsgLogBlock({
        guildId: event.guild_id,
        channelId: event.channel_id,
      });

    if (channelBlock && isChannelIgnored(eventType, channelBlock.blockType)) {
      return;
    }

    const messageIDs = getMessageIDs(event);

    const { allMessages } = await ctx.sushiiAPI.sdk.getMessages({
      channelId: event.channel_id,
      guildId: event.guild_id,
      in: messageIDs,
    });

    const messages = allMessages?.nodes || [];

    // No cached message found for deleted or edited message in DB, ignore
    if (messages.length === 0) {
      return;
    }

    const embeds = buildEmbeds(ctx, eventType, event, messages);

    if (embeds.none) {
      // No embed to send, could be just proxy url getting updated
      return;
    }

    if (embeds.val.length === 0) {
      return;
    }

    // Split embeds into chunks of 10
    const chunkSize = 10;
    for (let i = 0; i < embeds.val.length; i += chunkSize) {
      const chunk = embeds.val.slice(i, i + chunkSize).map((e) => e.toJSON());

      // eslint-disable-next-line no-await-in-loop
      await ctx.REST.sendChannelMessage(guildConfigById.logMsg, {
        embeds: chunk,
      });
    }
  }
}
