import {
  GatewayDispatchEvents,
  GatewayMessageCreateDispatchData,
  GatewayMessageUpdateDispatchData,
} from "discord-api-types/v10";
import logger from "../logger";
import Context from "../model/context";
import EventHandler from "./EventHandler";
import { isChannelIgnored } from "./MsgLogHandler";

type EventData =
  | GatewayMessageCreateDispatchData
  | GatewayMessageUpdateDispatchData;

export default class MessageCacheHandler extends EventHandler {
  eventTypes = [
    GatewayDispatchEvents.MessageCreate,
    GatewayDispatchEvents.MessageUpdate,
  ];

  async handler(
    ctx: Context,
    eventType: GatewayDispatchEvents,
    event: EventData
  ): Promise<void> {
    // Ignore DMS
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

    // Don't log ignored channels
    if (channelBlock && isChannelIgnored(eventType, channelBlock.blockType)) {
      return;
    }

    const authorId = event.author?.id || event.member?.user?.id;
    if (!authorId) {
      logger.error(event, "Message author not found");
      return;
    }

    logger.debug("Caching message id %s", event.id);
    // Save message to db
    await ctx.sushiiAPI.sdk.upsertMessage({
      message: {
        messageId: event.id,
        channelId: event.channel_id,
        guildId: event.guild_id,
        authorId,
        content: event.content || "",
        msg: event,
        created: event.timestamp!,
      },
    });
  }
}
