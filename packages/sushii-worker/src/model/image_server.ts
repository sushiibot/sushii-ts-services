import { Agent } from "http";
import fetch, { Response, RequestInit } from "node-fetch";
import config from "./config";

export default class SushiiImageServerClient {
  public readonly endpoint: string;

  private readonly agent: Agent;

  constructor() {
    // Remove trailing slash
    this.endpoint = config.SUSHII_IMAGE_SERVER_URL.replace(/\/$/, "");
    this.agent = new Agent({
      keepAlive: true,
    });
  }

  /**
   * Custom fetch method that overrides node-fetch with the custom client agent
   *
   * @param url
   * @param init
   * @returns {Promise<Response>}
   */
  private async fetch(path: string, init?: RequestInit): Promise<Response> {
    const url = this.endpoint + path;

    return fetch(url, {
      agent: this.agent,
      ...init,
    });
  }

  public async getUserRank(
    context: Record<string, string | boolean | number>,
  ): Promise<ArrayBuffer> {
    const res = await this.fetch("/template", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        templateName: "rank",
        width: 500,
        height: 400,
        context,
      }),
    });

    if (!res.ok) {
      throw new Error(`${res.status} ${res.statusText}`);
    }

    return res.arrayBuffer();
  }
}
