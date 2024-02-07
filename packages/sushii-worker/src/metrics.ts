import { InteractionType } from "discord-api-types/v10";
import {
  ApplicationCommandType,
  GatewayDispatchEvents,
  Interaction,
} from "discord.js";
import { collectDefaultMetrics, Counter, Gauge } from "prom-client";
import logger from "./logger";

const prefix = "sushii_ts_worker_";

const prefixedName = (name: string): string => `${prefix}${name}`;

// PerformanceObserver is implemented in Bun v1.0.22
// monitorEventLoopDelay is missing.

// Enable only if bun is not defined
if (typeof Bun === "undefined") {
  collectDefaultMetrics({
    prefix,
  });
}

// -----------------------------------------------------------------------------
// General
export const guildGauge = new Gauge({
  name: prefixedName("guilds"),
  help: "Number of guilds sushii is in",
});

export const membersGauge = new Gauge({
  name: prefixedName("members"),
  help: "Number of members sushii can see",
});

// -----------------------------------------------------------------------------
// Events
const gatewayEventsCounter = new Counter({
  name: prefixedName("discord_events"),
  help: "Discord gateway events",
  labelNames: ["event_name"],
});

// -----------------------------------------------------------------------------
// Interactions
const slashCommandsCounter = new Counter({
  name: `${prefix}slash_command`,
  help: "Slash commands",
  labelNames: ["command_name", "status"],
});

const autocompleteCounter = new Counter({
  name: prefixedName("autocomplete_interaction"),
  help: "Autocomplete interactions",
  labelNames: ["command_name", "status"],
});

const messageComponentCounter = new Counter({
  name: prefixedName("message_component_interaction"),
  help: "Message component interactions, e.g. buttons",
  labelNames: ["status"],
});

const modalCounter = new Counter({
  name: prefixedName("modal_interaction"),
  help: "Modal submit interactions",
  labelNames: ["status"],
});

// -----------------------------------------------------------------------------
// Reminders

export const pendingRemindersGauge = new Gauge({
  name: prefixedName("reminders_pending"),
  help: "Pending reminders",
});

export const sentRemindersCounter = new Counter({
  name: prefixedName("reminders_sent"),
  help: "Sent reminders",
  labelNames: ["status"],
});

// -----------------------------------------------------------------------------
// Tempbans

export const pendingTempBansGauge = new Gauge({
  name: prefixedName("tempban_pending"),
  help: "Pending temporary bans",
});

export const unbannedTempBansCounter = new Counter({
  name: prefixedName("tempban_unbanned"),
  help: "Unbanned users from temporary bans",
  labelNames: ["status"],
});

// -----------------------------------------------------------------------------
// Giveaways

export const activeGiveawaysGauge = new Gauge({
  name: prefixedName("giveaways_active"),
  help: "Active giveaways",
});

export const endedGiveawaysCounter = new Counter({
  name: prefixedName("giveaways_ended"),
  help: "Ended giveaways",
});

export function updateInteractionMetrics(
  interaction: Interaction,
  status: "success" | "error",
): void {
  const { type } = interaction;

  switch (type) {
    case InteractionType.ApplicationCommand: {
      switch (interaction.commandType) {
        case ApplicationCommandType.ChatInput: {
        }
      }
      slashCommandsCounter.inc({
        command_name: interaction.commandName,
        status,
      });
      break;
    }
    case InteractionType.ApplicationCommandAutocomplete: {
      autocompleteCounter.inc({
        command_name: interaction.commandName,
        status,
      });
      break;
    }
    case InteractionType.MessageComponent: {
      // Does not have custom_id since it is high cardinality
      messageComponentCounter.inc({
        status,
      });
      break;
    }
    case InteractionType.ModalSubmit: {
      modalCounter.inc({
        status,
      });
      break;
    }
    default: {
      logger.warn("Unhandled interaction type:", type);
    }
  }
}

export function updateGatewayDispatchEventMetrics(
  event: GatewayDispatchEvents,
): void {
  gatewayEventsCounter.inc({ event_name: event });
}
