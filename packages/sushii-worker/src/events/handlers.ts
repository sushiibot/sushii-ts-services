import Client from "../client";
import LevelHandler from "./LevelHandler";

export default function addEventHandlers(client: Client): void {
  client.addEventHandlers(new LevelHandler());
}
