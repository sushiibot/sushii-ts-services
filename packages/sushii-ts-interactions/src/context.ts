import { GraphQLClient } from "graphql-request";
import CDNClient from "./cdn";
import { ConfigI } from "./config";
import SushiiImageServerClient from "./image_server";
import RESTClient from "./rest";
import { getSdk, Sdk } from "./generated/graphql";

export default class Context {
  public readonly graphQLClient: GraphQLClient;

  public readonly sushiiAPI: Sdk;

  public readonly sushiiImageServer: SushiiImageServerClient;

  public readonly REST: RESTClient;

  public readonly CDN: CDNClient;

  constructor(config: ConfigI) {
    this.graphQLClient = new GraphQLClient(config.graphqlApiURL);
    this.sushiiAPI = getSdk(this.graphQLClient);

    this.sushiiImageServer = new SushiiImageServerClient(config);
    this.REST = new RESTClient(config);
    this.CDN = new CDNClient();
  }
}
