import { Events, Message } from "discord.js";
import opentelemetry from "@opentelemetry/api";
import { EventHandlerFn } from "../EventHandler";
import { upsertCachedUser } from "../../db/CachedUser/CachedUser.repository";
import db from "../../infrastructure/database/db";

const tracer = opentelemetry.trace.getTracer("cache-user-handler");

export const cacheUserHandler: EventHandlerFn<Events.MessageCreate> = async (
  msg: Message,
): Promise<void> => {
  if (msg.author.bot) {
    return;
  }

  const span = tracer.startSpan("upsert cached user");

  try {
    await upsertCachedUser(db, {
      id: msg.author.id,
      name: msg.author.username,
      discriminator: parseInt(msg.author.discriminator, 10),
      avatar_url: msg.author.displayAvatarURL(),
      last_checked: new Date(),
    });
  } finally {
    span.end();
  }
};
