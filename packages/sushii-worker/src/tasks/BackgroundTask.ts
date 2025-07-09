import { Client } from "discord.js";

export default interface BackgroundTask {
  name: string;
  cronTime: string;
  onTick(client: Client): Promise<void>;
}
