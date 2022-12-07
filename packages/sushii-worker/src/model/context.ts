import { GraphQLClient } from "graphql-request";
import { APIUser } from "discord-api-types/v10";
import fetch, { RequestInfo, RequestInit, Response } from "node-fetch";
import http from "http";
import CDNClient from "./cdn";
import { ConfigI } from "./config";
import SushiiImageServerClient from "./image_server";
import RESTClient from "./rest";
import { getSdk, SdkFunctionWrapper } from "../generated/graphql";
import SushiiSDK from "./api";
import Metrics from "./metrics";
import AmqpGateway from "./AmqpGateway";

function clientMetricsWrapper(metrics: Metrics): SdkFunctionWrapper {
  return async <T>(action: () => Promise<T>): Promise<T> => {
    const end = metrics.sushiiAPIStartTimer();
    const result = await action();
    end();

    return result;
  };
}

type FetchMethod = (url: RequestInfo, init?: RequestInit) => Promise<Response>;

/**
 *
 * @returns A fetch method that uses a keep-alive agent
 */
function getFetch(): FetchMethod {
  const agent = new http.Agent({
    keepAlive: true,
    maxSockets: Infinity,
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

  public readonly gateway: AmqpGateway;

  private currentUser?: APIUser;

  constructor(config: ConfigI, metrics: Metrics, gateway: AmqpGateway) {
    this.graphQLClient = new GraphQLClient(config.graphqlApiURL, {
      headers: {
        Authorization: `Bearer ${config.graphqlApiToken}`,
      },
      keepalive: true,
      fetch: getFetch(),
    });
    this.sushiiAPI = new SushiiSDK(
      getSdk(this.graphQLClient, clientMetricsWrapper(metrics))
    );

    this.sushiiImageServer = new SushiiImageServerClient(config);
    this.REST = new RESTClient(config);
    this.CDN = new CDNClient();
    this.gateway = gateway;
  }

  async getCurrentUser(): Promise<APIUser> {
    // Fetch once on the first time if not already fetched
    if (!this.currentUser) {
      const currentUserRes = await this.REST.getCurrentUser();
      this.currentUser = currentUserRes.unwrap();
    }

    return this.currentUser;
  }
}
