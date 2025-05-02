import {
  Client,
  Events,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from "discord.js";
import { EventHandlerFn } from "../EventHandler";
import Context from "../../model/context";
import { getGuildConfig } from "../../db/GuildConfig/GuildConfig.repository";
import db from "../../model/db";

interface ReactionLog {
  action: "add" | "remove";
  reactionString: string;
  userId: string;
}

// Guild ID -> Reactions
const reactionBuffer = new Map<string, ReactionLog[]>();

// Logs flush to log channels max every 10 seconds
let timeout: NodeJS.Timeout | null = null;

async function flushLogs(client: Client<true>): Promise<void> {}

function startFlushTimeout(client: Client<true>): void {
  // Already has a timeout, don't need to start a new one
  if (timeout) {
    return;
  }

  // Create a new flush timeout
  timeout = setTimeout(() => {
    flushLogs(client);
  }, 5000);
}

function addReactionLog(
  guildId: string,
  userId: string,
  action: "add" | "remove",
  reactionString: string,
): void {
  const reactions = reactionBuffer.get(guildId) || [];
  reactions.push({
    action,
    reactionString,
    userId,
  });
}

export const reactLogAddHandler: EventHandlerFn<
  Events.MessageReactionAdd
> = async (
  ctx: Context,
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser,
): Promise<void> => {
  if (!reaction.message.inGuild()) {
    return;
  }

  const guildConfig = await getGuildConfig(db, reaction.message.guild.id);
  if (guildConfig.reaction_logs_channel === null) {
    return;
  }

  const channel = reaction.message.guild.channels.cache.get(
    guildConfig.reaction_logs_channel,
  );

  if (!channel || !channel.isTextBased()) {
    return;
  }

  const reactionString = reaction.emoji.toString();
};

export const reactLogRemoveHandler: EventHandlerFn<
  Events.MessageReactionRemove
> = async (
  ctx: Context,
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser,
): Promise<void> => {
  if (!reaction.message.inGuild()) {
    return;
  }

  const guildConfig = await getGuildConfig(db, reaction.message.guild.id);
  if (guildConfig.reaction_logs_channel === null) {
    return;
  }

  const channel = reaction.message.guild.channels.cache.get(
    guildConfig.reaction_logs_channel,
  );

  if (!channel || !channel.isTextBased()) {
  }
};
