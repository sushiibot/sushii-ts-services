import Collection from "@discordjs/collection";
import {
  Routes,
  RESTPostAPIApplicationCommandsJSONBody,
  APIInteraction,
  APIChatInputApplicationCommandInteraction,
  APIModalSubmitInteraction,
  InteractionType,
  APIContextMenuInteraction,
  MessageFlags,
  APIMessageComponentButtonInteraction,
  APIMessageComponentSelectMenuInteraction,
  APIApplicationCommandAutocompleteInteraction,
  ApplicationCommandOptionType,
  APIApplicationCommandInteractionDataOption,
} from "discord-api-types/v10";
import { AMQPMessage } from "@cloudamqp/amqp-client";
import {
  isChatInputApplicationCommandInteraction,
  isContextMenuApplicationCommandInteraction,
  isGuildInteraction,
  isMessageComponentButtonInteraction,
  isMessageComponentSelectMenuInteraction,
} from "discord-api-types/utils/v10";
import * as Sentry from "@sentry/node";
import { t } from "i18next";
import { ConfigI } from "../model/config";
import Context from "../model/context";
import log from "../logger";
import {
  SlashCommandHandler,
  ModalHandler,
  ButtonHandler,
  SelectMenuHandler,
  AutocompleteHandler,
} from "./handlers";
import { isGatewayInteractionCreateDispatch } from "../utils/interactionTypeGuards";
import ContextMenuHandler from "./handlers/ContextMenuHandler";
import { AutocompleteOption } from "./handlers/AutocompleteHandler";
import getInvokerUser from "../utils/interactions";
import Metrics from "../model/metrics";

interface FocusedOption {
  path: string;
  option: AutocompleteOption;
}

function findFocusedOptionRecur(
  options: APIApplicationCommandInteractionDataOption[],
  parents: string[]
): FocusedOption | undefined {
  // eslint-disable-next-line no-restricted-syntax
  for (const option of options) {
    if (
      (option.type === ApplicationCommandOptionType.String ||
        option.type === ApplicationCommandOptionType.Integer ||
        option.type === ApplicationCommandOptionType.Number) &&
      option.focused
    ) {
      return {
        // Don't include option name, only command and group names
        path: parents.join("."),
        option,
      };
    }

    if (
      (option.type === ApplicationCommandOptionType.Subcommand ||
        option.type === ApplicationCommandOptionType.SubcommandGroup) &&
      option.options
    ) {
      return findFocusedOptionRecur(option.options, [...parents, option.name]);
    }
  }

  return undefined;
}

function findFocusedOption(
  interaction: APIApplicationCommandAutocompleteInteraction
): FocusedOption | undefined {
  // eslint-disable-next-line no-restricted-syntax
  return findFocusedOptionRecur(interaction.data.options, [
    interaction.data.name,
  ]);
}

export default class InteractionClient {
  /**
   * Bot configuration
   */
  private config: ConfigI;

  /**
   * Prometheus metrics
   */
  private metrics: Metrics;

  /**
   * Command context for shared stuff like database connections, API clients, etc.
   */
  private context: Context;

  /**
   * Command handlers
   */
  private commands: Collection<string, SlashCommandHandler>;

  /**
   * Autocomplete handlers
   */
  private autocompleteHandlers: Collection<string, AutocompleteHandler>;

  /**
   * Context menu handlers
   */
  private contextMenuHandlers: Collection<string, ContextMenuHandler>;

  /**
   * Modal handlers. This is only for *pure* handlers, if modals require some
   * side effects or logic, they should be handled in the command handler with
   * await modals.
   */
  private modalHandlers: Collection<string, ModalHandler>;

  /**
   * Button handlers, key is the custom id prefix
   */
  private buttonHandlers: Collection<string, ButtonHandler>;

  /**
   * select menu handlers, key is the custom id prefix
   */
  private selectMenuHandlers: Collection<string, SelectMenuHandler>;

  constructor(config: ConfigI, metrics: Metrics) {
    this.config = config;
    this.metrics = metrics;
    this.context = new Context(config, metrics);
    this.commands = new Collection();
    this.autocompleteHandlers = new Collection();
    this.modalHandlers = new Collection();
    this.buttonHandlers = new Collection();
    this.selectMenuHandlers = new Collection();
    this.contextMenuHandlers = new Collection();
  }

  /**
   * Add multiple commands to register and handle
   *
   * @param commands SlashCommands to add
   */
  public addCommands(...commands: SlashCommandHandler[]): void {
    commands.forEach((c) => this.addCommand(c));
  }

  /**
   * Add a new command to register and handle
   *
   * @param command SlashCommand to add
   */
  public addCommand(command: SlashCommandHandler): void {
    this.commands.set(command.command.name, command);
  }

  /**
   * Add a new autocomplete to register and handle
   *
   * @param handler autocomplete to add
   */
  public addAutocompleteHandlers(...handlers: AutocompleteHandler[]): void {
    handlers.forEach((handler) => {
      if (Array.isArray(handler.fullCommandNamePath)) {
        handler.fullCommandNamePath.forEach((path) =>
          this.autocompleteHandlers.set(path, handler)
        );
      } else {
        this.autocompleteHandlers.set(handler.fullCommandNamePath, handler);
      }
    });
  }

  /**
   * Add a new context menu handler to register and handle
   *
   * @param command ContextMenuHandler to add
   */
  public addContextMenu(ctxMenuHandler: ContextMenuHandler): void {
    this.contextMenuHandlers.set(ctxMenuHandler.command.name, ctxMenuHandler);
  }

  /**
   * Add a pure modal handler
   *
   * @param modalHandler ModalHandler to add
   */
  public addModal(modalHandler: ModalHandler): void {
    this.modalHandlers.set(modalHandler.modalId, modalHandler);
  }

  /**
   * Add a pure component handler
   *
   * @param componentHandler ButtonHandler to add
   */
  public addButton(componentHandler: ButtonHandler): void {
    this.buttonHandlers.set(componentHandler.customIDPrefix, componentHandler);
  }

  /**
   * Add a pure component handler
   *
   * @param componentHandler SelectMenuHandler to add
   */
  public addSelectMenu(componentHandler: SelectMenuHandler): void {
    this.selectMenuHandlers.set(
      componentHandler.customIDPrefix,
      componentHandler
    );
  }

  /**
   *
   * @returns array of commands to register
   */
  private getCommandsArray(): RESTPostAPIApplicationCommandsJSONBody[] {
    const slashCmds = Array.from(this.commands.values()).map((c) => c.command);
    const contextMenus = Array.from(this.contextMenuHandlers.values()).map(
      (c) => c.command
    );

    return [...slashCmds, ...contextMenus];
  }

  /**
   * Register all slash commands via REST api
   *
   * @returns
   */
  public async register(): Promise<void> {
    log.info("registering %s slash commands", this.commands.size);

    // Actual global commands
    if (this.config.guildIds.length === 0) {
      await this.context.REST.rest.put(
        Routes.applicationCommands(this.config.applicationId),
        { body: this.getCommandsArray() }
      );

      log.info("registered %s global commands", this.commands.size);
      return;
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const guildId of this.config.guildIds) {
      // Guild only commands for testing
      // eslint-disable-next-line no-await-in-loop
      const res = await this.context.REST.rest.put(
        Routes.applicationGuildCommands(this.config.applicationId, guildId),
        { body: this.getCommandsArray() }
      );

      log.info(
        "registered %s guild commands in %s",
        this.commands.size,
        res,
        guildId
      );
    }
  }

  /**
   * Handle an slash command
   *
   * @param interaction slash command interaction
   * @returns
   */
  private async handleSlashCommandInteraction(
    interaction: APIChatInputApplicationCommandInteraction
  ): Promise<void> {
    const command = this.commands.get(interaction.data.name);

    if (!command) {
      log.error(`received unknown command: ${interaction.data.name}`);
      return;
    }

    log.info("received %s command", interaction.data.name);

    try {
      if (command.serverOnly) {
        if (!isGuildInteraction(interaction)) {
          await this.context.REST.interactionReply(interaction, {
            content: "This command can only be used in servers.",
            flags: MessageFlags.Ephemeral,
          });

          return;
        }
      }

      // Pre-check
      if (command.check) {
        const checkRes = await command.check(this.context, interaction);

        if (!checkRes.pass) {
          await this.context.REST.interactionReply(interaction, {
            content: checkRes.message,
          });

          log.info(
            "command %s failed check: %s",
            interaction.data.name,
            checkRes.message
          );
          return;
        }
      }

      await command.handler(this.context, interaction);
    } catch (e) {
      const invoker = getInvokerUser(interaction);

      Sentry.captureException(e, {
        user: {
          id: invoker.id,
          username: invoker.username,
        },
        tags: {
          type: "command",
          custom_id: interaction.data.name,
        },
      });

      log.error(e, "error running command %s", interaction.data.name);

      try {
        await this.context.REST.interactionReply(interaction, {
          content: t("generic.error.internal"),
        });
      } catch (e2) {
        Sentry.captureException(e2);
        log.warn(e2, "error replying error %s", interaction.data.name);
      }
    }
  }

  /**
   * Handle an autocomplete interaction
   *
   * @param interaction autocomplete interaction
   * @returns
   */
  private async handleAutocompleteInteraction(
    interaction: APIApplicationCommandAutocompleteInteraction
  ): Promise<void> {
    // Find focused option path, e.g. notification.delete
    const focusedOption = findFocusedOption(interaction);

    if (!focusedOption) {
      throw new Error(
        `no focused option found for autocomplete ${interaction.data.name}`
      );
    }

    const autocomplete = this.autocompleteHandlers.get(focusedOption.path);

    if (!autocomplete) {
      log.error(`received unknown autocomplete: ${focusedOption.path}`);
      return;
    }

    log.info("received %s autocomplete", focusedOption.path);

    try {
      // Server only check is not done since that's on the command side

      // Pre-check
      const checkRes = await autocomplete.check(this.context, interaction);

      if (!checkRes.pass) {
        await this.context.REST.interactionReply(interaction, {
          content: checkRes.message,
        });

        log.info(
          "autocomplete %s failed check: %s",
          focusedOption.path,
          checkRes.message
        );
        return;
      }

      await autocomplete.handler(
        this.context,
        interaction,
        focusedOption.option
      );
    } catch (e) {
      Sentry.captureException(e, {
        tags: {
          type: "autocomplete",
          custom_id: interaction.data.name,
        },
      });

      log.error(e, "error running autocomplete %s", interaction.data.name);
    }
  }

  /**
   * Handle an application command, this can be a slash command or a context menu interaction
   *
   * @param interaction application interaction
   * @returns
   */
  private async handleContextMenuInteraction(
    interaction: APIContextMenuInteraction
  ): Promise<void> {
    const command = this.contextMenuHandlers.get(interaction.data.name);

    if (!command) {
      log.error(`received unknown command: ${interaction.data.name}`);
      return;
    }

    log.info("received %s command", interaction.data.name);

    try {
      if (command.serverOnly) {
        if (interaction.guild_id === undefined) {
          await this.context.REST.interactionReply(interaction, {
            content: "This command can only be used in servers.",
            flags: MessageFlags.Ephemeral,
          });

          return;
        }
      }

      // Pre-check
      if (command.check) {
        const checkRes = await command.check(this.context, interaction);

        if (!checkRes.pass) {
          await this.context.REST.interactionReply(interaction, {
            content: checkRes.message,
            flags: MessageFlags.Ephemeral,
          });

          log.info(
            "command %s failed check: %s",
            interaction.data.name,
            checkRes.message
          );
          return;
        }
      }

      await command.handler(this.context, interaction);
    } catch (e) {
      Sentry.captureException(e, {
        tags: {
          type: "context_menu",
          name: interaction.data.name,
        },
      });
      log.error(e, "error running command %s", interaction.data.name);

      try {
        await this.context.REST.interactionReply(interaction, {
          content: t("generic.error.internal"),
          flags: MessageFlags.Ephemeral,
        });
      } catch (e2) {
        Sentry.captureException(e2);
        log.warn(e2, "error replying error %s", interaction.data.name);
      }
    }
  }

  /**
   * Handle a pure modal submit interaction
   *
   * @param interaction modal submit interaction
   */
  private async handleModalSubmit(
    interaction: APIModalSubmitInteraction
  ): Promise<void> {
    const modalHandler = this.modalHandlers.get(interaction.data.custom_id);

    if (!modalHandler) {
      log.error(
        "received unknown modal submit interaction: %s",
        interaction.data.custom_id
      );

      return;
    }

    log.info("received %s modal submit", interaction.data.custom_id);

    try {
      await modalHandler.handleModalSubmit(this.context, interaction);
    } catch (e) {
      Sentry.captureException(e, {
        tags: {
          type: "modal",
          custom_id: interaction.data.custom_id,
        },
      });

      log.error(e, "error handling modal %s: %s", interaction.id);
    }
  }

  /**
   * Handle a pure button interaction
   *
   * @param interaction button interaction
   */
  private async handleButtonSubmit(
    interaction: APIMessageComponentButtonInteraction
  ): Promise<void> {
    // TODO: button / select menu handlers don't really need to be a collection
    // as we are always iterating through all handlers
    const buttonHandler = this.buttonHandlers.find((handler) =>
      interaction.data.custom_id.startsWith(handler.customIDPrefix)
    );

    if (!buttonHandler) {
      log.error(
        "received unknown button interaction: %s",
        interaction.data.custom_id
      );

      return;
    }

    log.info("received %s button", interaction.data.custom_id);

    try {
      await buttonHandler.handleInteraction(this.context, interaction);
    } catch (e) {
      Sentry.captureException(e, {
        tags: {
          type: "button",
          custom_id: interaction.data.custom_id,
        },
      });

      log.error(e, "error handling button %s", interaction.id);
    }
  }

  /**
   * Handle a pure select menu interaction
   *
   * @param interaction select menu interaction
   */
  private async handleSelectMenuSubmit(
    interaction: APIMessageComponentSelectMenuInteraction
  ): Promise<void> {
    const selectMenuHandler = this.selectMenuHandlers.find((handler) =>
      interaction.data.custom_id.startsWith(handler.customIDPrefix)
    );

    if (!selectMenuHandler) {
      log.error(
        "received unknown select menu interaction: %s",
        interaction.data.custom_id
      );

      return;
    }

    log.info("received %s select menu", interaction.data.custom_id);

    try {
      await selectMenuHandler.handleInteraction(this.context, interaction);
    } catch (e) {
      Sentry.captureException(e);
      log.error(e, "error handling select menu %s: %o", interaction.id);
    }
  }

  private async handleAPIInteraction(
    interaction: APIInteraction
  ): Promise<void> {
    if (interaction.type === InteractionType.ApplicationCommand) {
      if (isChatInputApplicationCommandInteraction(interaction)) {
        return this.handleSlashCommandInteraction(interaction);
      }

      if (isContextMenuApplicationCommandInteraction(interaction)) {
        return this.handleContextMenuInteraction(interaction);
      }
    }

    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
      return this.handleAutocompleteInteraction(interaction);
    }

    if (interaction.type === InteractionType.MessageComponent) {
      if (isMessageComponentButtonInteraction(interaction)) {
        return this.handleButtonSubmit(interaction);
      }

      if (isMessageComponentSelectMenuInteraction(interaction)) {
        return this.handleSelectMenuSubmit(interaction);
      }
    }

    if (interaction.type === InteractionType.ModalSubmit) {
      return this.handleModalSubmit(interaction);
    }

    return undefined;
  }

  /**
   * Handles a raw gateway interaction from AMQP
   *
   * @param msg AMQP message
   * @returns
   */
  public async handleAMQPMessage(msg: AMQPMessage): Promise<void> {
    const msgString = msg.bodyToString();
    if (!msgString) {
      log.error("received empty AMQP message");
      return;
    }

    const interaction = JSON.parse(msgString);
    if (!isGatewayInteractionCreateDispatch(interaction)) {
      // log.debug("received non-interaction AMQP message %s", interaction.t);
      return;
    }

    try {
      // Not awaited as we don't need to block
      this.handleAPIInteraction(interaction.d);
      this.metrics.handleInteraction(interaction.d);
    } catch (e) {
      Sentry.captureException(e);

      log.error(e, "error handling AMQP message %s", interaction.t);
    }
  }
}
