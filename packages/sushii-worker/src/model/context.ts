import { GraphQLClient } from "graphql-request";
import { APIApplicationCommand } from "discord-api-types/v10";
import fetch, { RequestInfo, RequestInit, Response } from "node-fetch";
import http from "http";
import { Client, CDN } from "discord.js";
import config from "./config";
import SushiiImageServerClient from "./image_server";
import SushiiSDK from "./api";
import { getSdkWebsocket } from "./graphqlClient";
import MemoryStore from "./MemoryStore";

/*
function clientMetricsWrapper(metrics: Metrics): SdkFunctionWrapper {
  return async <T>(action: () => Promise<T>): Promise<T> => {
    const end = metrics.sushiiAPIStartTimer();
    const result = await action();
    end();

    return result;
  };
}
*/

type FetchMethod = (url: RequestInfo, init?: RequestInit) => Promise<Response>;

/**
 *
 * @returns A fetch method that uses a keep-alive agent
 */
function getFetch(): FetchMethod {
  const agent = new http.Agent({
    keepAlive: true,
    maxSockets: 32,
  });

  return (url, options) =>
    fetch(url, {
      ...options,
      agent,
    });
}

export default class Context {
  public readonly graphQLClient: GraphQLClient;

  public readonly sushiiAPI: SushiiSDK;

  public readonly sushiiImageServer: SushiiImageServerClient;

  public readonly client: Client;

  public readonly CDN = new CDN();

  public memoryStore: MemoryStore;

  private commands: APIApplicationCommand[];

  constructor(client: Client, wsSdkClient: ReturnType<typeof getSdkWebsocket>) {
    this.graphQLClient = new GraphQLClient(config.SUSHII_GRAPHQL_URL, {
      headers: {
        Authorization: `Bearer ${config.SUSHII_GRAPHQL_TOKEN}`,
      },
      keepalive: true,
      fetch: getFetch(),
    });

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
