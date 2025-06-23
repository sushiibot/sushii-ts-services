import config from "./config";

export default class SushiiImageServerClient {
  public readonly endpoint: string;

  constructor() {
    // Remove trailing slash
    this.endpoint = config.SUSHII_IMAGE_SERVER_URL.replace(/\/$/, "");
  }

  public async getUserRank(
    context: Record<string, string | boolean | number>,
  ): Promise<ArrayBuffer> {
    const url = `${this.endpoint}/template`;

    const res = await fetch(url, {
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
