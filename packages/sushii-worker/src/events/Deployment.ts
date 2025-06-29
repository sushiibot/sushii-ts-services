import { Events, Message } from "discord.js";
import dayjs from "dayjs";
import { EventHandlerFn } from "./EventHandler";
import Context from "../model/context";
import config from "../model/config";
import {
  getActiveDeployment,
  toggleActiveDeployment,
} from "../infrastructure/database/repositories/Deployment.repository";
import toTimestamp from "../utils/toTimestamp";

export const deployToggleHandler: EventHandlerFn<Events.MessageCreate> = async (
  ctx: Context,
  msg: Message,
): Promise<void> => {
  // Optional values, require both to be set.
  if (!config.OWNER_USER_ID || !config.OWNER_CHANNEL_ID) {
    return;
  }

  if (msg.author.id !== config.OWNER_USER_ID) {
    return;
  }

  if (msg.channelId !== config.OWNER_CHANNEL_ID) {
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
