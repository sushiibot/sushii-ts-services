import { APIInteraction, InteractionType } from "discord-api-types/v10";
import client, { collectDefaultMetrics, Registry } from "prom-client";
import logger from "../logger";

export default class Metrics {
  readonly registry: client.Registry;

  private slashCommandsCounter: client.Counter<string>;

  private autocompleteCounter: client.Counter<string>;

  private messageComponentCounter: client.Counter<string>;

  private modalCounter: client.Counter<string>;

  // sushii api
  private sushiiApiHistogram: client.Histogram<string>;

  constructor() {
    const register = new Registry();
    const prefix = "sushii_ts_worker_";

    collectDefaultMetrics({
      register,
      prefix,
    });

    this.registry = register;

    this.slashCommandsCounter = new client.Counter({
      name: `${prefix}slash_command`,
      help: "Slash commands",
      labelNames: ["command_name"],
      registers: [register],
    });

    this.autocompleteCounter = new client.Counter({
      name: `${prefix}autocomplete_interaction`,
      help: "Autocomplete interactions",
      labelNames: ["command_name"],
      registers: [register],
    });

    this.messageComponentCounter = new client.Counter({
      name: `${prefix}message_component_interaction`,
      help: "Message component interactions, e.g. buttons",
      registers: [register],
    });

    this.modalCounter = new client.Counter({
      name: `${prefix}modal_interaction`,
      help: "Modal submit interactions",
      registers: [register],
    });

    this.sushiiApiHistogram = new client.Histogram({
      name: `${prefix}sushii_api_call_duration`,
      help: "Sushii API call duration",
      labelNames: ["method", "endpoint"],
      registers: [register],
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

  public sushiiAPIStartTimer(): ReturnType<
    typeof this.sushiiApiHistogram.startTimer
  > {
    return this.sushiiApiHistogram.startTimer();
  }
}
