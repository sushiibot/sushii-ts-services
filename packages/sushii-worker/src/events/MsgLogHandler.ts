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
import logger from "../logger";
import Context from "../model/context";
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

  const msg = message.msg as Partial<APIMessage>;

  if (msg.content) {
    description += "**Content**";
    description += "\n";
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
    const attachments = msg.attachments.map((a) => `> ${a.url}`).join("\n");

    description += "**Attachments**";
    description += "\n";
    description += attachments;
  }

  return new EmbedBuilder()
    .setDescription(description)
    .setColor(Color.DiscordEmbedGrey)
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

  let description = `${SushiiEmoji.MessageEdit} **Message edited in <#${event.channel_id}>**\n`;
  description = "**Before:**";
  description += "\n";
  description += quoteMarkdownString(message.content);
  description += "\n";
  description += "**After:**";
  description += "\n";
  description += quoteMarkdownString(updateEvent.content);

  const embed = new EmbedBuilder()
    .setDescription(description)
    .setColor(Color.Info)
    .setTimestamp(new Date());

  return Some(embed);
}

function buildBulkDeleteEmbed(
  ctx: Context,
  event: GatewayMessageDeleteBulkDispatchData,
  messages: Message[]
): EmbedBuilder {
  const description = `${SushiiEmoji.MessageDelete} **${messages.length} messages deleted in <#${event.channel_id}>**\n`;

  const messagesStr = messages
    .map((m) => `<@${m.authorId}>: ${m.content}`)
    .join("\n");

  return new EmbedBuilder()
    .setDescription(description + messagesStr)
    .setColor(Color.Error)
    .setTimestamp(new Date());
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
    const embed = buildBulkDeleteEmbed(
      ctx,
      event as GatewayMessageDeleteBulkDispatchData,
      messages
    );

    return Some([embed]);
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
      logger.debug(`No cached message found for message ID ${messageIDs}`);
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

    if (embeds.val.length > 10) {
      logger.error(
        `Too many embeds to send for message ID ${messageIDs}, ignoring last ${
          embeds.val.length - 10
        }`
      );
      return;
    }

    const embedsJson = embeds.val.slice(0, 10).map((e) => e.toJSON());

    await ctx.REST.sendChannelMessage(guildConfigById.logMsg, {
      embeds: embedsJson,
    });
  }
}
