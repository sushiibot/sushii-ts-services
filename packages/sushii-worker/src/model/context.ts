import { GraphQLClient } from "graphql-request";
import CDNClient from "./cdn";
import { ConfigI } from "./config";
import SushiiImageServerClient from "./image_server";
import RESTClient from "./rest";
import { getSdk, SdkFunctionWrapper } from "../generated/graphql";
import SushiiSDK from "./api";
import Metrics from "./metrics";

function clientMetricsWrapper(metrics: Metrics): SdkFunctionWrapper {
  return async <T>(action: () => Promise<T>): Promise<T> => {
    const end = metrics.sushiiAPIStartTimer();
    const result = await action();
    end();

    return result;
  };
}

export default class Context {
  public readonly graphQLClient: GraphQLClient;

  public readonly sushiiAPI: SushiiSDK;

  public readonly sushiiImageServer: SushiiImageServerClient;

  public readonly REST: RESTClient;

  public readonly CDN: CDNClient;

  constructor(config: ConfigI, metrics: Metrics) {
    this.graphQLClient = new GraphQLClient(config.graphqlApiURL, {
      headers: {
        Authorization: `Bearer ${config.graphqlApiToken}`,
      },
    });
    this.sushiiAPI = new SushiiSDK(
      getSdk(this.graphQLClient, clientMetricsWrapper(metrics))
    );

    this.sushiiImageServer = new SushiiImageServerClient(config);
    this.REST = new RESTClient(config);
    this.CDN = new CDNClient();
  }
}
