import { Events, Message } from "discord.js";
import dayjs from "dayjs";
import { EventHandlerFn } from "./EventHandler";
import Context from "../model/context";
import { config } from "@/core/config";
import {
  getActiveDeployment,
  toggleActiveDeployment,
} from "../db/Deployment/Deployment.repository";
import toTimestamp from "../utils/toTimestamp";

export const deployToggleHandler: EventHandlerFn<Events.MessageCreate> = async (
  ctx: Context,
  msg: Message,
): Promise<void> => {
  // Optional values, require both to be set.
  if (!config.deployment.ownerUserId || !config.deployment.ownerChannelId) {
    return;
  }

  if (msg.author.id !== config.deployment.ownerUserId) {
    return;
  }

  if (msg.channelId !== config.deployment.ownerChannelId) {
    return;
  }

  const uptime = process.uptime();
  const dur = dayjs.duration({
    seconds: uptime,
  });

  const processStart = dayjs().utc().subtract(uptime, "seconds");
  const startTimestamp = toTimestamp(processStart, "f");

  if (msg.content === "!deployment") {
    const deployment = await getActiveDeployment();
    const content = `Deployment is currently set to: \`${deployment}\` (uptime: ${dur.humanize()} - started: ${startTimestamp})`;
    await msg.reply(content);
    return;
  }

  if (msg.content === "!toggle-deployment") {
    const deployment = await getActiveDeployment();
    await msg.reply(
      `Toggling deployment from \`${deployment}\` (uptime: ${dur.humanize()} - started: ${startTimestamp})`,
    );

    const newDeployment = await toggleActiveDeployment();
    await msg.reply(
      `Deployment toggled, new deployment is: \`${newDeployment?.name}\``,
    );
  }
};
