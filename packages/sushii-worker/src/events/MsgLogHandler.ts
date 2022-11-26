import { EmbedBuilder } from "@discordjs/builders";
import {
  APIMessage,
  GatewayDispatchEvents,
  GatewayMessageDeleteBulkDispatchData,
  GatewayMessageDeleteDispatchData,
  GatewayMessageUpdateDispatchData,
} from "discord-api-types/v10";
import { None, Option, Some } from "ts-results";
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

function isChannelIgnored(
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

function buildEmbed(
  ctx: Context,
  eventType: GatewayDispatchEvents,
  event: EventData,
  messages: Message[]
): Option<EmbedBuilder> {
  let title;
  let color;
  let description = "";

  if (eventType === GatewayDispatchEvents.MessageDelete) {
    title = "Message Deleted";
    color = Color.Error;

    const msg = messages[0].msg as Partial<APIMessage>;

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
  } else if (eventType === GatewayDispatchEvents.MessageDeleteBulk) {
    title = "Multiple Messages Deleted";
    color = Color.Error;
    description = messages
      .map((m) => `<@${m.authorId}>: ${m.content}`)
      .join("\n");
  } else if (eventType === GatewayDispatchEvents.MessageUpdate) {
    const updateEvent = event as GatewayMessageUpdateDispatchData;

    // Ignore edits for messages without content
    if (!updateEvent.content) {
      return None;
    }

    // No changes, e.g. could be proxy url updated
    if (updateEvent.content === messages[0].content) {
      return None;
    }

    title = "Message Edited";
    color = Color.Info;

    description = "**Before:**";
    description += "\n";
    description += quoteMarkdownString(messages[0].content);
    description += "\n";
    description += "**After:**";
    description += "\n";
    description += quoteMarkdownString(updateEvent.content);
  } else {
    throw new Error(`Invalid event type ${eventType}`);
  }

  return Some(
    new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor(color)
      .setTimestamp(new Date())
  );
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

    const embed = buildEmbed(ctx, eventType, event, messages);

    if (embed.none) {
      // No embed to send, could be just proxy url getting updated
      return;
    }

    await ctx.REST.sendChannelMessage(guildConfigById.logMsg, {
      embeds: [embed.safeUnwrap().toJSON()],
    });
  }
}
