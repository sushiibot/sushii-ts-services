import { APIApplicationCommand } from "discord-api-types/v10";
import { Client, CDN } from "discord.js";
import SushiiImageServerClient from "./image_server";
import SushiiSDK from "./api";
import { getSdkWebsocket } from "./graphqlClient";
import MemoryStore from "./MemoryStore";

export default class Context {
  public readonly sushiiAPI: SushiiSDK;

  public readonly sushiiImageServer: SushiiImageServerClient;

  public readonly client: Client;

  public readonly CDN = new CDN();

  public memoryStore: MemoryStore;

  private commands: APIApplicationCommand[];

  constructor(client: Client, wsSdkClient: ReturnType<typeof getSdkWebsocket>) {
    this.sushiiAPI = new SushiiSDK(wsSdkClient);

    this.sushiiImageServer = new SushiiImageServerClient();
    this.client = client;
    this.memoryStore = new MemoryStore();

    this.commands = [];
  }

  setCommands(commands: APIApplicationCommand[]): void {
    this.commands = commands;
  }

  private getPlainCommandString(commandName: string): string {
    return `\`/${commandName}\``;
  }

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
      return this.getPlainCommandString(commandName);
    }

    // No validation on subcommand name
    return `</${commandName}:${command.id}`;
  }
}
