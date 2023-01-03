import Client from "../client";
import LevelHandler from "./LevelHandler";
import MessageCacheHandler from "./MessageCacheHandler";
import ModLogHandler from "./ModLogHandler";
import MsgLogHandler from "./MsgLogHandler";

export default function addEventHandlers(client: Client): void {
  client.addEventHandlers(
    new LevelHandler(),
    new MsgLogHandler(),
    new ModLogHandler(),
    new MessageCacheHandler()
  );
}
