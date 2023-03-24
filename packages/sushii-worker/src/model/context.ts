import { GraphQLClient } from "graphql-request";
import { APIApplicationCommand, APIUser } from "discord-api-types/v10";
import fetch, { RequestInfo, RequestInit, Response } from "node-fetch";
import http from "http";
import CDNClient from "./cdn";
import config from "./config";
import SushiiImageServerClient from "./image_server";
import RESTClient from "./rest";
// import { SdkFunctionWrapper } from "../generated/graphql";
import SushiiSDK from "./api";
import Metrics from "./metrics";
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

  public readonly REST: RESTClient;

  public readonly CDN: CDNClient;

  public memoryStore: MemoryStore;

  private currentUser?: APIUser;

  private commands: APIApplicationCommand[];

  constructor(
    metrics: Metrics,
    wsSdkClient: ReturnType<typeof getSdkWebsocket>
  ) {
    this.graphQLClient = new GraphQLClient(config.GRAPHQL_API_URL, {
      headers: {
        Authorization: `Bearer ${config.GRAPHQL_API_TOKEN}`,
      },
      keepalive: true,
      fetch: getFetch(),
    });

    this.sushiiAPI = new SushiiSDK(wsSdkClient);

    this.sushiiImageServer = new SushiiImageServerClient(config);
    this.REST = new RESTClient();
    this.CDN = new CDNClient();
    this.memoryStore = new MemoryStore();

    this.commands = [];
  }

  async getCurrentUser(): Promise<APIUser> {
    // Fetch once on the first time if not already fetched
    if (!this.currentUser) {
      const currentUserRes = await this.REST.getCurrentUser();
      this.currentUser = currentUserRes.unwrap();
    }

    return this.currentUser;
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
