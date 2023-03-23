import { Client, Events } from "discord.js";
import logger from "./logger";
import InteractionClient from "./client";

export default function registerEventHandlers(
  client: Client,
  interactionHandler: InteractionClient
): void {
  client.once(Events.ClientReady, (c) => {
    logger.info(`Ready! Logged in as ${c.user.tag}`);
  });

  client.on(Events.InteractionCreate, async (interaction) => {
    interactionHandler.handleAPIInteraction(interaction);
  });
}
