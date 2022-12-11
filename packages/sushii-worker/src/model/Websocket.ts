import { WebSocket } from "ws";
import { ConfigI } from "./config";

export default function getHeadersWebSocket(config: ConfigI): any {
  class HeadersWebSocket extends WebSocket {
    constructor(url: string | URL, protocols?: string | string[] | undefined) {
      super(url, protocols, {
        headers: {
          authorization: `Bearer ${config.graphqlApiToken}`,
        },
      });
    }
  }

  return HeadersWebSocket;
}
