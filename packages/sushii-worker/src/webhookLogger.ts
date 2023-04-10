import { EmbedBuilder, WebhookClient } from "discord.js";
import logger from "./logger";
import config from "./model/config";

const webhookClient = config.NOTIFY_WEBHOOK_URL
  ? new WebhookClient({
      url: config.NOTIFY_WEBHOOK_URL,
    })
  : null;

export default async function webhookLog(
  title: string,
  message: string,
  color?: number
): Promise<void> {
  if (!webhookClient) {
    logger.warn("No webhook client, skipping webhook log");
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(message || "No message")
    .setColor(color || null)
    .setTimestamp(new Date());

  try {
    await webhookClient.send({
      username: config.NOTIFY_WEBHOOK_USERNAME || "sushii",
      embeds: [embed],
    });

    logger.debug({ title, message }, "Sent webhook log");
  } catch (err) {
    logger.error({ err }, "Failed to send webhook log");
  }
}
