import { Events, Message } from "discord.js";
import { EventHandlerFn } from "./EventHandler";
import Context from "../model/context";
import { getTag } from "../infrastructure/database/repositories/Tab.repository";
import db from "../infrastructure/database/config/db";

export const mentionTagHandler: EventHandlerFn<Events.MessageCreate> = async (
  ctx: Context,
  msg: Message,
): Promise<void> => {
  const botId = ctx.client.user?.id;
  if (!botId) {
    return;
  }

  if (!msg.inGuild()) {
    return;
  }

  let content;
  const mentions = [`<@${botId}>`, `<@!${botId}>`];

  // Message needs to start with mention, trim mention
  if (msg.content.startsWith(mentions[0])) {
    content = msg.content.replace(mentions[0], "").trim();
  } else if (msg.content.startsWith(mentions[1])) {
    content = msg.content.replace(mentions[1], "").trim();
  } else {
    return;
  }

  // Trim mention, both versions
  if (content.length === 0) {
    // TODO: Hey you mentioned me, but didn't say anything!
    return;
  }

  // Find if any tags match
  const tag = await getTag(db, msg.guildId, content);

  if (!tag) {
    return;
  }

  await msg.channel.send({
    content: tag.content,
    allowedMentions: {
      parse: [],
    },
  });
};
