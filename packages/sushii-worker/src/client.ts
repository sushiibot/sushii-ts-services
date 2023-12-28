import {
  Collection,
  AnySelectMenuInteraction,
  AutocompleteFocusedOption,
  AutocompleteInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  ContextMenuCommandInteraction,
  Interaction,
  MessageFlags,
  ModalSubmitInteraction,
  Routes,
  RESTPutAPIApplicationCommandsResult,
  RESTPostAPIApplicationCommandsJSONBody,
} from "discord.js";
import * as Sentry from "@sentry/node";
import { t } from "i18next";
import opentelemetry, { SpanStatusCode } from "@opentelemetry/api";
import Context from "./model/context";
import log from "./logger";
import {
  SlashCommandHandler,
  ModalHandler,
  ButtonHandler,
  SelectMenuHandler,
  AutocompleteHandler,
} from "./interactions/handlers";
import ContextMenuHandler from "./interactions/handlers/ContextMenuHandler";
import Metrics from "./model/metrics";
import getFullCommandName from "./utils/getFullCommandName";
import validationErrorToString from "./utils/validationErrorToString";
import config from "./model/config";
import { isCurrentDeploymentActive } from "./db/Deployment/Deployment.repository";

const tracer = opentelemetry.trace.getTracer("interaction-client");

// For JSON.stringify()
// eslint-disable-next-line no-extend-native, func-names
(BigInt.prototype as any).toJSON = function (): string {
  return this.toString();
};

interface FocusedOption {
  path: string;
  option: AutocompleteFocusedOption;
}

function findFocusedOptionRecur(
  options: AutocompleteInteraction["options"],
  parents: string[],
): FocusedOption | undefined {
  const subGroup = options.getSubcommandGroup();

  if (subGroup) {
    parents.push(subGroup);
  }

  const subCommand = options.getSubcommand(false);
  if (subCommand) {
    parents.push(subCommand);
  }

  const focusedOption = options.getFocused(true);

  return {
    path: parents.join("."),
    option: focusedOption,
  };
}

function findFocusedOption(
  interaction: AutocompleteInteraction,
): FocusedOption | undefined {
  // eslint-disable-next-line no-restricted-syntax
  return findFocusedOptionRecur(interaction.options, [interaction.commandName]);
}

export default class Client {
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
  private modalHandlers: ModalHandler[];

  /**
   * Button handlers
   */
  private buttonHandlers: ButtonHandler[];

  /**
   * select menu handlers
   */
  private selectMenuHandlers: SelectMenuHandler[];

  constructor(ctx: Context, metrics: Metrics) {
    this.metrics = metrics;
    this.context = ctx;
    this.commands = new Collection();
    this.autocompleteHandlers = new Collection();
    this.modalHandlers = [];
    this.buttonHandlers = [];
    this.selectMenuHandlers = [];
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
          this.autocompleteHandlers.set(path, handler),
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
  public addModalHandlers(...modalHandlers: ModalHandler[]): void {
    this.modalHandlers.push(...modalHandlers);
  }

  /**
   * Add a pure component handler
   *
   * @param buttonHandlers ButtonHandler to add
   */
  public addButtons(...buttonHandlers: ButtonHandler[]): void {
    this.buttonHandlers.push(...buttonHandlers);
  }

  /**
   * Add a pure component handler
   *
   * @param componentHandlers SelectMenuHandlers to add
   */
  public addSelectMenus(...componentHandlers: SelectMenuHandler[]): void {
    this.selectMenuHandlers.push(...componentHandlers);
  }

  /**
   *
   * @returns array of commands to register
   */
  private getCommandsArray(): RESTPostAPIApplicationCommandsJSONBody[] {
    const slashCmds = Array.from(this.commands.values()).map((c) => c.command);
    const contextMenus = Array.from(this.contextMenuHandlers.values()).map(
      (c) => c.command,
    );

    return [...slashCmds, ...contextMenus];
  }

  /**
   * Register all slash commands via REST api
   *
   * @returns
   */
  public async register(): Promise<void> {
    log.info("registering %s global commands...", this.commands.size);

    try {
      const res = await this.context.client.rest.put(
        Routes.applicationCommands(config.APPLICATION_ID),
        { body: this.getCommandsArray() },
      );

      this.context.setCommands(res as RESTPutAPIApplicationCommandsResult);

      log.info("commands registered!");
    } catch (err) {
      log.error(err, "error registering commands");
    }
  }

  /**
   * Handle an slash command
   *
   * @param interaction slash command interaction
   * @returns
   */
  private async handleSlashCommandInteraction(
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    const command = this.commands.get(interaction.commandName);

    if (!command) {
      log.error(`received unknown command: ${interaction.commandName}`);
      return;
    }

    log.info(
      {
        command: getFullCommandName(interaction),
        guildId: interaction.guildId,
        userId: interaction.user.id,
      },
      "received command",
    );

    try {
      // Pre-check
      if (command.check) {
        const checkRes = await command.check(this.context, interaction);

        if (!checkRes.pass) {
          await interaction.reply(checkRes.message);

          log.info(
            "command %s failed check: %s",
            interaction.commandName,
            checkRes.message,
          );
          return;
        }
      }

      log.info(
        {
          command: getFullCommandName(interaction),
          guildId: interaction.guildId,
          userId: interaction.user.id,
        },
        "running command",
      );

      await command.handler(this.context, interaction);
    } catch (e) {
      const invoker = interaction.user;
      log.error(e, "error running command %s", interaction.commandName);

      Sentry.withScope((scope) => {
        scope.addAttachment({
          filename: "interaction.json",
          data: JSON.stringify(interaction, null, 2),
          contentType: "application/json",
        });

        Sentry.captureException(e, {
          user: {
            id: invoker.id,
            username: invoker.username,
          },
          tags: {
            type: "command",
            command_name: getFullCommandName(interaction),
          },
          contexts: {
            validationError: {
              value: validationErrorToString(e),
            },
          },
        });
      });
      try {
        await interaction.reply(t("generic.error.internal"));
      } catch (e2) {
        Sentry.captureException(e2);
        log.warn(e2, "error replying error %s", interaction.commandName);
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
    interaction: AutocompleteInteraction,
  ): Promise<void> {
    // Find focused option path, e.g. notification.delete
    const focusedOption = findFocusedOption(interaction);

    if (!focusedOption) {
      throw new Error(
        `no focused option found for autocomplete ${interaction.commandName}`,
      );
    }

    const autocomplete = this.autocompleteHandlers.get(focusedOption.path);

    if (!autocomplete) {
      log.error(`received unknown autocomplete: ${focusedOption.path}`);
      return;
    }

    log.info(
      {
        path: focusedOption.path,
        option: focusedOption.option,
        guildId: interaction.guildId,
        userId: interaction.user.id,
      },
      "received autocomplete",
    );

    try {
      // Server only check is not done since that's on the command side

      // Pre-check
      const checkRes = await autocomplete.check(this.context, interaction);

      if (!checkRes.pass) {
        // No reply since autocomplete

        log.info(
          "autocomplete %s failed check: %s",
          focusedOption.path,
          checkRes.message,
        );
        return;
      }

      await autocomplete.handler(
        this.context,
        interaction,
        focusedOption.option,
      );
    } catch (e) {
      Sentry.captureException(e, {
        tags: {
          type: "autocomplete",
          custom_id: interaction.commandName,
        },
      });

      log.error(e, "error running autocomplete %s", interaction.commandName);
    }
  }

  /**
   * Handle an application command, this can be a slash command or a context menu interaction
   *
   * @param interaction application interaction
   * @returns
   */
  private async handleContextMenuInteraction(
    interaction: ContextMenuCommandInteraction,
  ): Promise<void> {
    const command = this.contextMenuHandlers.get(interaction.commandName);

    if (!command) {
      log.error(`received unknown command: ${interaction.commandName}`);
      return;
    }

    log.info("received %s command", interaction.commandName);

    try {
      // Pre-check
      if (command.check) {
        const checkRes = await command.check(this.context, interaction);

        if (!checkRes.pass) {
          await interaction.reply({
            content: checkRes.message,
            flags: MessageFlags.Ephemeral,
          });

          log.info(
            "command %s failed check: %s",
            interaction.commandName,
            checkRes.message,
          );
          return;
        }
      }

      await command.handler(this.context, interaction);
    } catch (e) {
      Sentry.captureException(e, {
        tags: {
          type: "context_menu",
          name: interaction.commandName,
        },
      });
      log.error(e, "error running command %s", interaction.commandName);

      try {
        await interaction.reply({
          content: t("generic.error.internal"),
          flags: MessageFlags.Ephemeral,
        });
      } catch (e2) {
        Sentry.captureException(e2);
        log.warn(e2, "error replying error %s", interaction.commandName);
      }
    }
  }

  /**
   * Handle a pure modal submit interaction
   *
   * @param interaction modal submit interaction
   */
  private async handleModalSubmit(
    interaction: ModalSubmitInteraction,
  ): Promise<void> {
    const modalHandler = this.modalHandlers.find(
      (handler) => handler.customIDMatch(interaction.customId) !== false,
    );

    if (!modalHandler) {
      log.error(
        "received unknown modal submit interaction: %s",
        interaction.customId,
      );

      return;
    }

    log.info("received %s modal submit", interaction.customId);

    try {
      await modalHandler.handleModalSubmit(this.context, interaction);
    } catch (e) {
      Sentry.captureException(e, {
        tags: {
          type: "modal",
          custom_id: interaction.customId,
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
    interaction: ButtonInteraction,
  ): Promise<void> {
    // TODO: button / select menu handlers don't really need to be a collection
    // as we are always iterating through all handlers
    const buttonHandler = this.buttonHandlers.find(
      (handler) => handler.customIDMatch(interaction.customId) !== false,
    );

    if (!buttonHandler) {
      // This can happen if there's just an interaction collector
      log.warn("received unknown button interaction: %s", interaction.customId);

      return;
    }

    log.info("received %s button", interaction.customId);

    try {
      await buttonHandler.handleInteraction(this.context, interaction);
    } catch (e) {
      Sentry.captureException(e, {
        tags: {
          type: "button",
          custom_id: interaction.customId,
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
    interaction: AnySelectMenuInteraction,
  ): Promise<void> {
    const selectMenuHandler = this.selectMenuHandlers.find(
      (handler) => handler.customIDMatch(interaction.customId) !== false,
    );

    if (!selectMenuHandler) {
      log.error(
        "received unknown select menu interaction: %s",
        interaction.customId,
      );

      return;
    }

    log.info("received %s select menu", interaction.customId);

    try {
      await selectMenuHandler.handleInteraction(this.context, interaction);
    } catch (e) {
      Sentry.captureException(e);
      log.error(e, "error handling select menu %s: %o", interaction.id);
    }
  }

  public async handleAPIInteraction(interaction: Interaction): Promise<void> {
    // Ignore all interactions that are not from the current deployment
    const active = await isCurrentDeploymentActive();
    if (!active) {
      log.info(
        {
          processDeploymentName: config.DEPLOYMENT_NAME,
          interactionId: interaction.id,
        },
        "Not active deployment, ignoring interaction",
      );

      return;
    }

    await tracer.startActiveSpan("handleAPIInteraction", async (span) => {
      span.setAttribute("interactionType", interaction.type);

      try {
        this.metrics.handleInteraction(interaction);

        if (interaction.isChatInputCommand()) {
          span.setAttribute("commandName", interaction.commandName);
          return await this.handleSlashCommandInteraction(interaction);
        }

        if (interaction.isContextMenuCommand()) {
          span.setAttribute("commandName", interaction.commandName);
          return await this.handleContextMenuInteraction(interaction);
        }

        if (interaction.isAutocomplete()) {
          span.setAttribute("commandName", interaction.commandName);
          return await this.handleAutocompleteInteraction(interaction);
        }

        if (interaction.isButton()) {
          span.setAttribute("customId", interaction.customId);
          return await this.handleButtonSubmit(interaction);
        }

        if (interaction.isAnySelectMenu()) {
          span.setAttribute("customId", interaction.customId);
          return await this.handleSelectMenuSubmit(interaction);
        }

        if (interaction.isModalSubmit()) {
          span.setAttribute("customId", interaction.customId);
          return await this.handleModalSubmit(interaction);
        }

        return undefined;
      } catch (err) {
        log.error(
          err,
          "error handling interaction, should be caught %s",
          interaction.id,
        );
      } finally {
        span.end();
      }
    });
  }
}
