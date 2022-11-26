import { EmbedBuilder } from "@discordjs/builders";
import {
  APIMessage,
  GatewayDispatchEvents,
  GatewayMessageDeleteBulkDispatchData,
  GatewayMessageDeleteDispatchData,
  GatewayMessageUpdateDispatchData,
} from "discord-api-types/v10";
import { Message, MsgLogBlockType } from "../generated/graphql";
import logger from "../logger";
import Context from "../model/context";
import Color from "../utils/colors";
import EventHandler from "./EventHandler";

type EventData =
  | GatewayMessageDeleteDispatchData
  | GatewayMessageDeleteBulkDispatchData
  | GatewayMessageUpdateDispatchData;

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
  eventType: GatewayDispatchEvents,
  event: EventData,
  messages: Message[]
): EmbedBuilder {
  let title;
  let color;
  let description;

  if (eventType === GatewayDispatchEvents.MessageDelete) {
    title = "Message Deleted";
    color = Color.Error;
    description = messages[0].msg as Partial<APIMessage>;
  } else if (eventType === GatewayDispatchEvents.MessageDeleteBulk) {
    title = "Multiple Messages Deleted";
    color = Color.Error;
    description = messages
      .map((m) => `<@${m.authorId}>: ${m.content}`)
      .join("\n");
  } else if (eventType === GatewayDispatchEvents.MessageUpdate) {
    title = "Message Edited";
    color = Color.Info;

    const updateEvent = event as GatewayMessageUpdateDispatchData;

    description = `**Before:** ${messages[0].content}\n**After:** ${updateEvent.content}`;
  } else {
    throw new Error(`Invalid event type ${eventType}`);
  }

  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setTimestamp(new Date());
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

    const embed = buildEmbed(eventType, event, messages);

    await ctx.REST.sendChannelMessage(guildConfigById.logMsg, {
      embeds: [embed.toJSON()],
    });
  }
}
