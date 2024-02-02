import { InteractionType } from "discord-api-types/v10";
import { GatewayDispatchEvents, Interaction } from "discord.js";
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
  labelNames: ["command_name"],
});

const autocompleteCounter = new Counter({
  name: prefixedName("autocomplete_interaction"),
  help: "Autocomplete interactions",
  labelNames: ["command_name"],
});

const messageComponentCounter = new Counter({
  name: prefixedName("message_component_interaction"),
  help: "Message component interactions, e.g. buttons",
});

const modalCounter = new Counter({
  name: prefixedName("modal_interaction"),
  help: "Modal submit interactions",
});

export function updateInteractionMetrics(interaction: Interaction): void {
  const { type } = interaction;

  switch (type) {
    case InteractionType.ApplicationCommand: {
      slashCommandsCounter.inc({
        command_name: interaction.commandName,
      });
      break;
    }
    case InteractionType.ApplicationCommandAutocomplete: {
      autocompleteCounter.inc({ command_name: interaction.commandName });
      break;
    }
    case InteractionType.MessageComponent: {
      // Does not have custom_id since it is high cardinality
      messageComponentCounter.inc();
      break;
    }
    case InteractionType.ModalSubmit: {
      modalCounter.inc();
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
