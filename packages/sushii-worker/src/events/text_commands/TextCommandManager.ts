import { Events, Message } from "discord.js";
import { EventHandlerFn } from "../EventHandler";
import Context from "../../model/context";
import { getGuildConfig } from "../../db/GuildConfig/GuildConfig.repository";
import db from "../../model/db";
import config from "../../model/config";
import { parseCommand } from "./TextCommand";

type TextCommandHandlerFn = (msg: Message, args: string[]) => Promise<void>;

type BaseTextCommand = {
  name: string;
  handler: TextCommandHandlerFn;
};

type TextSubCommand = BaseTextCommand;

type TextCommand = BaseTextCommand & {
  subCommands: Map<string, TextSubCommand>;
};

// TextCommandRegistration is a registration object for text commands, contains
// both the name and the handler
type TextCommandRegistration = {
  name: string;
  handler: TextCommandHandlerFn;
  subCommands: TextCommandRegistration[];
};

// TextCommandHandlerOptions are optional options for TextCommandHandler
type TextCommandHandlerOptions = {
  mentionPrefix?: boolean;
};

// TextCommandManager manages text commands
export class TextCommandManager {
  textCommands = new Map<string, TextCommand>();
  mentionPrefix: boolean;

  constructor(
    commands: TextCommandRegistration[],
    options?: TextCommandHandlerOptions,
  ) {
    commands.forEach((command) => {
      this.registerCommand(command);
    });

    this.mentionPrefix = options?.mentionPrefix ?? false;
  }

  registerCommand(command: TextCommandRegistration): void {
    if (this.textCommands.has(command.name)) {
      throw new Error(`Command ${command.name} already exists`);
    }

    const rootCommand: TextCommand = {
      name: command.name,
      handler: command.handler,
      subCommands: new Map(),
    };

    // Add subcommands
    command.subCommands.forEach((subCommand) => {
      rootCommand.subCommands.set(subCommand.name, subCommand);
    });

    this.textCommands.set(command.name, rootCommand);
  }

  unregisterCommand(commandName: string): void {
    this.textCommands.delete(commandName);
  }

  textCommandHandler: EventHandlerFn<Events.MessageCreate> = async (
    ctx: Context,
    msg: Message,
  ): Promise<void> => {
    // Global toggle flag
    if (!config.ENABLE_TEXT_COMMANDS) {
      return;
    }

    // Skip bots
    if (msg.author.bot) {
      return;
    }

    // Skip DM
    if (!msg.guildId) {
      return;
    }

    // Skip empty messages, e.g. attachment/sticker only messages
    if (!msg.content) {
      return;
    }

    const { prefix } = await getGuildConfig(db, msg.author.id);
    if (!prefix) {
      return;
    }

    // Parse command, null if mismatched prefix or no command
    const textCommand = parseCommand(prefix, msg.content);
    if (!textCommand) {
      return;
    }

    // Get command handler
    const handler = this.textCommands.get(textCommand.command);
    if (!handler) {
      return;
    }

    await handler.handler(msg, textCommand.args);
  };
}
