import { Events, Message } from "discord.js";
import dayjs from "dayjs";
import { EventHandlerFn } from "./EventHandler";
import Context from "../model/context";
import config from "../model/config";
import {
  getActiveDeployment,
  toggleActiveDeployment,
} from "../db/Deployment/Deployment.repository";

export const deployToggleHandler: EventHandlerFn<Events.MessageCreate> = async (
  ctx: Context,
  msg: Message,
): Promise<void> => {
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

  if (msg.content === "!deployment") {
    const deployment = getActiveDeployment();
    const content = `Deployment is currently set to: \`${deployment}\` (uptime: ${dur.humanize()})`;
    await msg.reply(content);
    return;
  }

  if (msg.content === "!toggle-deployment") {
    const deployment = getActiveDeployment();
    await msg.reply(
      `Toggling deployment from \`${deployment}\` (uptime: ${dur.humanize()})`,
    );
    const newDeployment = await toggleActiveDeployment();

    await msg.reply(
      `Deployment toggled, new deployment is: \`${newDeployment}\``,
    );
  }
};
