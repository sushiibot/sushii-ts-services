import { APIInteraction, InteractionType } from "discord-api-types/v10";
import client, { collectDefaultMetrics, Registry } from "prom-client";
import logger from "../logger";

export default class Metrics {
  readonly registry: client.Registry;

  private slashCommandsCounter: client.Counter<string>;

  private autocompleteCounter: client.Counter<string>;

  private messageComponentCounter: client.Counter<string>;

  private modalCounter: client.Counter<string>;

  constructor() {
    const register = new Registry();
    const prefix = "sushii_ts_worker";

    collectDefaultMetrics({
      register,
      prefix,
    });

    this.registry = register;

    this.slashCommandsCounter = new client.Counter({
      name: "slash_command",
      help: "slash commands",
      labelNames: ["command_name"],
    });

    this.autocompleteCounter = new client.Counter({
      name: "autocomplete_interaction",
      help: "autocomplete interactions",
      labelNames: ["command_name"],
    });

    this.messageComponentCounter = new client.Counter({
      name: "message_component_interaction",
      help: "message component interactions",
    });

    this.modalCounter = new client.Counter({
      name: "modal_interaction",
      help: "modal submit interactions",
    });
  }

  public getRegistry(): Registry {
    return this.registry;
  }

  public handleInteraction(interaction: APIInteraction): void {
    const { type } = interaction;

    switch (type) {
      case InteractionType.ApplicationCommand: {
        this.slashCommandsCounter.inc({ command_name: interaction.data.name });
        break;
      }
      case InteractionType.ApplicationCommandAutocomplete: {
        this.autocompleteCounter.inc({ command_name: interaction.data.name });
        break;
      }
      case InteractionType.MessageComponent: {
        // Does not have custom_id since it is high cardinality
        this.messageComponentCounter.inc();
        break;
      }
      case InteractionType.ModalSubmit: {
        this.modalCounter.inc();
        break;
      }
      default: {
        logger.warn("Unhandled interaction type:", type);
      }
    }
  }
}
