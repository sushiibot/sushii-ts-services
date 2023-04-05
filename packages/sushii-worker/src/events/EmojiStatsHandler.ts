import { Events, Message } from "discord.js";
import Context from "../model/context";
import { EventHandlerFn } from "./EventHandler";

const EMOJI_RE = /<(?<animated>a)?:(?<name>\w+):(?<id>\d{16,21})>/g;

// TODO: Need reaction add event handler too
const emojiStatsMsgHandler: EventHandlerFn<Events.MessageCreate> = async (
  ctx: Context,
  msg: Message
): Promise<void> => {
  const matches = msg.content.matchAll(EMOJI_RE);

  // Set to ensure unique emoji ids and no duplicates.
  // We don't care about multiple uses per message, just 1 per message per
  // emoji.
  const uniqueEmojiIds = new Set<string>();

  for (const match of matches) {
    uniqueEmojiIds.add(match.groups?.id ?? "");
  }
};

export default emojiStatsMsgHandler;
