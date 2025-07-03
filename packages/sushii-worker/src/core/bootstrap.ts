import { UpdateUserXpService } from "@/features/leveling/application/UpdateUserXpService";
import { LevelRoleRepositoryImpl } from "@/features/leveling/infrastructure/LevelRoleRepositoryImpl";
import { UserLevelRepositoryImpl } from "@/features/leveling/infrastructure/UserLevelRepositoryImpl";
import { XpBlockRepositoryImpl } from "@/features/leveling/infrastructure/XpBlockRepositoryImpl";
import { MessageLevelHandler } from "@/features/leveling/presentation/MessageLevelHandler";
import { drizzleDb } from "@/infrastructure/database/db";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Client } from "discord.js";
import { EventHandler } from "./presentation/EventHandler";
import logger from "@/core/logger";

export function initCore() {
  // This just returns the global existing database for now, until we fully
  // integrate the database into the core
  const db = drizzleDb;

  return {
    db,
  };
}

export function registerFeatures(db: NodePgDatabase, client: Client): void {
  // ---------------------------------------------------------------------------
  // Feature bootstrapping
  const levelService = new UpdateUserXpService(
    new UserLevelRepositoryImpl(db),
    new LevelRoleRepositoryImpl(db),
    new XpBlockRepositoryImpl(db),
  );

  const levelHandler = new MessageLevelHandler(levelService);

  const handlers = [levelHandler];

  // ---------------------------------------------------------------------------
  // Register event handlers

  // Union type is too much for typescript, so we just use any here - it's
  // already type enforced in implementation, and the usage is fine
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlerGroups = new Map<string, EventHandler<any>[]>();

  // Group handlers by event type
  for (const handler of handlers) {
    const eventType = handler.eventType;

    if (!handlerGroups.has(eventType)) {
      handlerGroups.set(eventType, []);
    }

    const group = handlerGroups.get(eventType);
    if (group) {
      group.push(handler);
    }
  }

  // Build event listeners
  for (const [eventType, group] of handlerGroups.entries()) {
    logger.info(
      {
        eventType,
        handlerNames: group.map((h) => h.constructor.name),
        count: group.length,
      },
      `Registering event handler for ${eventType}`,
    );

    client.on(eventType, async (...args) => {
      try {
        const promises = [];

        for (const handler of group) {
          const p = handler.handle(...args);
          promises.push(p);
        }
        // Run all handlers concurrently and wait for all to settle
        const results = await Promise.allSettled(promises);

        // Log any errors that occurred in the handlers
        for (let i = 0; i < results.length; i++) {
          const result = results[i];
          if (result.status === "rejected") {
            logger.error(
              {
                error: result.reason,
                eventType,
                handler: group[i].constructor.name,
              },
              `Error in handler for event ${eventType}`,
            );
          }
        }
      } catch (error) {
        logger.error(
          {
            error,
            eventType,
            handlers: group.map((h) => h.constructor.name),
          },
          `Error handling event ${eventType}`,
        );
      }
    });
  }
}
