import { Client } from "discord.js";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Logger } from "pino";

import * as schema from "@/infrastructure/database/schema";

import {
  DMPolicyService,
  LookupUserService,
  ModerationService,
  TargetResolutionService,
} from "./application";
import {
  DrizzleGuildConfigRepository,
  DrizzleModerationCaseRepository,
} from "./infrastructure";
import {
  BanCommand,
  LookupCommand,
  WarnCommand,
} from "./presentation";

interface ModerationDependencies {
  db: NodePgDatabase<typeof schema>;
  client: Client;
  logger: Logger;
}

export function createModerationServices({ db, client, logger }: ModerationDependencies) {
  const moderationCaseRepository = new DrizzleModerationCaseRepository(
    db,
    logger.child({ module: "moderationCaseRepository" }),
  );

  const guildConfigRepository = new DrizzleGuildConfigRepository(
    db,
    logger.child({ module: "guildConfigRepository" }),
  );

  const dmPolicyService = new DMPolicyService(guildConfigRepository);

  const moderationService = new ModerationService(
    client,
    moderationCaseRepository,
    dmPolicyService,
    logger.child({ module: "moderationService" }),
  );

  const lookupUserService = new LookupUserService(
    client,
    moderationCaseRepository,
    logger.child({ module: "lookupUserService" }),
  );

  const targetResolutionService = new TargetResolutionService();

  return {
    moderationCaseRepository,
    guildConfigRepository,
    dmPolicyService,
    moderationService,
    lookupUserService,
    targetResolutionService,
  };
}

export function createModerationCommands(
  services: ReturnType<typeof createModerationServices>,
  logger: Logger,
) {
  const { moderationService, lookupUserService, targetResolutionService } = services;

  const commands = [
    new BanCommand(
      moderationService,
      targetResolutionService,
      logger.child({ module: "banCommand" }),
    ),
    new WarnCommand(
      moderationService,
      targetResolutionService,
      logger.child({ module: "warnCommand" }),
    ),
    new LookupCommand(
      lookupUserService,
      logger.child({ module: "lookupCommand" }),
    ),
  ];

  return {
    commands,
    autocompletes: [],
  };
}

export function createModerationEventHandlers(
  services: ReturnType<typeof createModerationServices>,
  logger: Logger,
) {
  // Moderation feature doesn't have event handlers currently
  return {
    eventHandlers: [],
  };
}

export function setupModerationFeature({ db, client, logger }: ModerationDependencies) {
  const services = createModerationServices({ db, client, logger });
  const commands = createModerationCommands(services, logger);
  const events = createModerationEventHandlers(services, logger);

  return {
    services,
    ...commands,
    ...events,
  };
}