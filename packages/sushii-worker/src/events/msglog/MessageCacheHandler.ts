import {
  GatewayDispatchEvents,
  GatewayMessageCreateDispatchData,
  GatewayMessageUpdateDispatchData,
} from "discord.js";
import { MsgLogBlockType } from "../../generated/graphql";
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

  // Only prevent saving if *all* types are blocked. e.g.
  // If edits are not logged, we still want to keep track of edit events for deletes
  if (channelBlock && channelBlock.blockType === MsgLogBlockType.All) {
    return;
  }

  const authorId = event.author?.id || event.member?.user?.id;
  if (!authorId) {
    return;
  }

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
}
