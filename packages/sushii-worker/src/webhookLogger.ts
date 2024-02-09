import { EmbedBuilder, WebhookClient } from "discord.js";
import logger from "./logger";
import config from "./model/config";
import Color from "./utils/colors";

const webhookClientLog = config.NOTIFY_WEBHOOK_URL
  ? new WebhookClient({
      url: config.NOTIFY_WEBHOOK_URL,
    })
  : null;

const webhookClientErr = config.NOTIFY_WEBHOOK_ERR_URL
  ? new WebhookClient({
      url: config.NOTIFY_WEBHOOK_ERR_URL,
    })
  : null;

export default async function webhookLog(
  title: string,
  message: string,
  color?: number,
): Promise<void> {
  if (!webhookClientLog) {
    logger.warn("No webhook client, skipping webhook log");
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(message || "No message")
    .setColor(color || null)
    .setTimestamp(new Date());

  try {
    await webhookClientLog.send({
      username: config.NOTIFY_WEBHOOK_USERNAME || "sushii",
      embeds: [embed],
    });

    logger.debug({ title, message }, "Sent webhook log");
  } catch (err) {
    logger.error({ err }, "Failed to send webhook log");
  }
}

export async function webhookErr(
  title: string,
  message: string,
): Promise<void> {
  if (!webhookClientErr) {
    logger.warn("No webhook client, skipping webhook log");
    return;
  }

  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(message || "No message")
    .setColor(Color.Error)
    .setTimestamp(new Date());

  try {
    await webhookClientErr.send({
      username: config.NOTIFY_WEBHOOK_USERNAME || "sushii",
      embeds: [embed],
    });

    logger.debug({ title, message }, "Sent webhook log");
  } catch (err) {
    logger.error({ err }, "Failed to send webhook log");
  }
}
