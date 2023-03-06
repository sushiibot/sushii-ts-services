import {
  GatewayDispatchEvents,
  GatewayMessageCreateDispatchData,
  GatewayMessageReactionAddDispatchData,
} from "discord-api-types/v10";
import Context from "../model/context";
import EventHandler from "./EventHandler";

type EventData =
  | GatewayMessageCreateDispatchData
  | GatewayMessageReactionAddDispatchData;

const EMOJI_RE = /<(?<animated>a)?:(?<name>\w+):(?<id>\d{16,21})>/g;

export default class MsgLogHandler extends EventHandler {
  eventTypes = [
    GatewayDispatchEvents.MessageCreate,
    GatewayDispatchEvents.MessageReactionAdd,
  ];

  async handler(
    ctx: Context,
    eventType: GatewayDispatchEvents,
    event: EventData
  ): Promise<void> {
    if (eventType === GatewayDispatchEvents.MessageCreate) {
      const newMsg = event as GatewayMessageCreateDispatchData;

      const matches = newMsg.content.matchAll(EMOJI_RE);

      // Set to ensure unique emoji ids and no duplicates.
      // We don't care about multiple uses per message, just 1 per message per
      // emoji.
      const uniqueEmojiIds = new Set<string>();

      for (const match of matches) {
        uniqueEmojiIds.add(match.groups?.id ?? "");
      }
    }
  }
}
