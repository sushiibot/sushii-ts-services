import Client from "../client";
import LevelHandler from "./LevelHandler";
import MessageCacheHandler from "./MessageCacheHandler";
import MsgLogHandler from "./MsgLogHandler";

export default function addEventHandlers(client: Client): void {
  client.addEventHandlers(
    new LevelHandler(),
    new MsgLogHandler(),
    new MessageCacheHandler()
  );
}
