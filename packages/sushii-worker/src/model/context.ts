import { APIApplicationCommand } from "discord-api-types/v10";
import { Client, CDN } from "discord.js";
import SushiiImageServerClient from "./image_server";
import MemoryStore from "./MemoryStore";
import logger from "@/shared/infrastructure/logger";

/**
 * @deprecated The Context class is deprecated and will be removed in a future version.
 * Use direct dependency injection instead. This class serves as a service locator which
 * makes dependencies implicit and reduces testability.
 *
 * Migrate to injecting services directly:
 * - Instead of `ctx.client` → inject `Client` directly
 * - Instead of `ctx.sushiiImageServer` → inject `SushiiImageServerClient` directly
 * - Instead of `ctx.memoryStore` → inject `MemoryStore` directly
 * - Instead of `ctx.CDN` → inject `CDN` directly
 *
 * See the new DDD architecture in /features for examples of proper dependency injection.
 */
export default class Context {
  public readonly sushiiImageServer: SushiiImageServerClient;

  public readonly client: Client;

  public readonly CDN = new CDN();

  public memoryStore: MemoryStore;

  private commands: APIApplicationCommand[];

  constructor(client: Client) {
    this.sushiiImageServer = new SushiiImageServerClient();
    this.client = client;
    this.memoryStore = new MemoryStore();

    this.commands = [];
  }

  /**
   * @deprecated Context is deprecated. Pass commands directly to components that need them.
   */
  setCommands(commands: APIApplicationCommand[]): void {
    this.commands = commands;
  }

  private getPlainCommandString(commandName: string): string {
    return `\`/${commandName}\``;
  }

  /**
   * @deprecated Context is deprecated. Create a dedicated CommandMentionService instead.
   */
  getCommandMention(commandName: string): string {
    if (!this.commands) {
      return this.getPlainCommandString(commandName);
    }

    // Subcommands aren't used for searching
    const primaryName = commandName.split(" ").at(0);

    // Empty string or something
    if (!primaryName) {
      return this.getPlainCommandString(commandName);
    }

    const command = this.commands.find((c) => c.name === primaryName);

    if (!command) {
      logger.error({ commandName }, "Command not found for mention");
      return this.getPlainCommandString(commandName);
    }

    // No validation on subcommand name
    return `</${commandName}:${command.id}>`;
  }
}
