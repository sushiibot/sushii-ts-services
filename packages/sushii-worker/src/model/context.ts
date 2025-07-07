import { APIApplicationCommand } from "discord-api-types/v10";
import { Client, CDN } from "discord.js";
import SushiiImageServerClient from "./image_server";
import MemoryStore from "./MemoryStore";
import { DeploymentService } from "@/features/deployment/application/DeploymentService";
import logger from "@/core/shared/logger";

export default class Context {
  public readonly sushiiImageServer: SushiiImageServerClient;

  public readonly client: Client;

  public readonly CDN = new CDN();

  public memoryStore: MemoryStore;

  public deploymentService: DeploymentService | null = null;

  private commands: APIApplicationCommand[];

  constructor(client: Client) {
    this.sushiiImageServer = new SushiiImageServerClient();
    this.client = client;
    this.memoryStore = new MemoryStore();

    this.commands = [];
  }

  setDeploymentService(deploymentService: DeploymentService): void {
    this.deploymentService = deploymentService;
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
      logger.error({ commandName }, "Command not found for mention");
      return this.getPlainCommandString(commandName);
    }

    // No validation on subcommand name
    return `</${commandName}:${command.id}>`;
  }

  getShardId(): number | null {
    const shard = this.client.ws.shards.first();
    return shard?.id ?? null;
  }

  isMainShard(): boolean {
    return this.getShardId() === 0;
  }
}
