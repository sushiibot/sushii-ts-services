import { Events, Guild } from "discord.js";
import opentelemetry from "@opentelemetry/api";
import { EventHandlerFn } from "../EventHandler";
import db from "../../infrastructure/database/db";
import { upsertCachedGuild } from "../../db/CachedGuild/CachedGuild.repository";

const tracer = opentelemetry.trace.getTracer("cache-guild-handler");

export const cacheGuildCreateHandler: EventHandlerFn<
  Events.GuildCreate
> = async (guild: Guild): Promise<void> => {
  const span = tracer.startSpan("guild create upsert");

  try {
    await upsertCachedGuild(db, {
      id: guild.id,
      name: guild.name,
      icon: guild.iconURL(),
      banner: guild.bannerURL(),
      splash: guild.splashURL(),
      features: guild.features,
    });
  } finally {
    span.end();
  }
};

export const cacheGuildUpdateHandler: EventHandlerFn<
  Events.GuildUpdate
> = async (oldGuild: Guild, newGuild: Guild): Promise<void> => {
  const span = tracer.startSpan("guild update upsert");

  try {
    await upsertCachedGuild(db, {
      id: newGuild.id,
      name: newGuild.name,
      icon: newGuild.iconURL(),
      banner: newGuild.bannerURL(),
      splash: newGuild.splashURL(),
      features: newGuild.features,
    });
  } finally {
    span.end();
  }
};
