import {
  GatewayDispatchEvents,
  GatewayMessageCreateDispatchData,
  GatewayMessageUpdateDispatchData,
} from "discord.js";
import { MsgLogBlockType } from "../../generated/graphql";
import logger from "../../logger";
import Context from "../../model/context";

type EventData =
  | GatewayMessageCreateDispatchData
  | GatewayMessageUpdateDispatchData;

export default async function msgLogCacheHandler(
  ctx: Context,
  eventType:
    | GatewayDispatchEvents.MessageCreate
    | GatewayDispatchEvents.MessageUpdate,
  event: EventData
): Promise<void> {
  // Ignore DMS
  if (!event.guild_id) {
    return;
  }

  // Ignore bots
  if (event.author?.bot || event.member?.user?.bot) {
    return;
  }

  logger.debug(
    {
      msgId: event.id,
      guildId: event.guild_id,
    },
    "getting guild config"
  );
  const { guildConfigById } = await ctx.sushiiAPI.sdk.guildConfigByID({
    guildId: event.guild_id,
  });

  logger.debug(
    {
      msgId: event.id,
      guildId: event.guild_id,
    },
    "got guild config"
  );

  // No guild config found, ignore
  if (
    !guildConfigById || // Config not found
    !guildConfigById.logMsg || // No msg log set
    !guildConfigById.logMsgEnabled // Msg log disabled
  ) {
    logger.debug(
      {
        msgId: event.id,
        guildId: event.guild_id,
      },
      "msg log not enabled"
    );
    return;
  }

  logger.debug(
    {
      msgId: event.id,
      guildId: event.guild_id,
    },
    "getting msg log blocks"
  );

  // Get ignored msg logs
  const { msgLogBlockByGuildIdAndChannelId: channelBlock } =
    await ctx.sushiiAPI.sdk.getMsgLogBlock({
      guildId: event.guild_id,
      channelId: event.channel_id,
    });

  // Only prevent saving if *all* types are blocked. e.g.
  // If edits are not logged, we still want to keep track of edit events for deletes
  if (channelBlock && channelBlock.blockType === MsgLogBlockType.All) {
    logger.debug(
      {
        msgId: event.id,
        guildId: event.guild_id,
      },
      "msg log is blocked in this channel"
    );

    return;
  }

  const authorId = event.author?.id || event.member?.user?.id;
  if (!authorId) {
    logger.debug(
      {
        msgId: event.id,
        guildId: event.guild_id,
      },
      "msg log author not found"
    );
    return;
  }

  logger.debug(
    {
      msgId: event.id,
      guildId: event.guild_id,
    },
    "saving message to db"
  );

  // Save message to db
  await ctx.sushiiAPI.sdk.upsertMessage({
    message: {
      messageId: event.id,
      channelId: event.channel_id,
      guildId: event.guild_id,
      authorId,
      content: event.content || "",
      created: event.timestamp!,
      msg: event,
    },
  });

  logger.debug(
    {
      msgId: event.id,
      guildId: event.guild_id,
    },
    "saved msg"
  );
}
