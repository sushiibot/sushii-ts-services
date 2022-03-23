import { ApiClient } from "@sushiibot/sushii-data-client";
import CDNClient from "./cdn";
import { ConfigI } from "./config";
import SushiiImageServerClient from "./image_server";
import RESTClient from "./rest";

export default class Context {
  public readonly sushiiAPI: ApiClient;

  public readonly sushiiImageServer: SushiiImageServerClient;

  public readonly REST: RESTClient;

  public readonly CDN: CDNClient;

  constructor(config: ConfigI) {
    this.sushiiAPI = new ApiClient(config.dataApiURL);
    this.sushiiImageServer = new SushiiImageServerClient(config);
    this.REST = new RESTClient(config);
    this.CDN = new CDNClient();
  }
}
