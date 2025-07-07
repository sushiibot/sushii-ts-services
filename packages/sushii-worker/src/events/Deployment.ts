import { Events, Message } from "discord.js";
import dayjs from "dayjs";
import { EventHandlerFn } from "./EventHandler";
import Context from "../model/context";
import { config } from "@/core/shared/config";
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

  const deploymentService = ctx.deploymentService;
  if (!deploymentService) {
    await msg.reply("❌ Deployment service not available");
    return;
  }

  const uptime = process.uptime();
  const dur = dayjs.duration({
    seconds: uptime,
  });

  const processStart = dayjs().utc().subtract(uptime, "seconds");
  const startTimestamp = toTimestamp(processStart, "f");

  if (msg.content === "!deployment") {
    const deployment = deploymentService.getCurrentDeployment();
    const isActive = deploymentService.isCurrentDeploymentActive();
    const status = isActive ? "🟢 ACTIVE" : "🔴 INACTIVE";
    const content = `Deployment is currently set to: \`${deployment}\` ${status} (uptime: ${dur.humanize()} - started: ${startTimestamp})`;
    await msg.reply(content);
    return;
  }

  if (msg.content === "!toggle-deployment") {
    const currentDeployment = deploymentService.getCurrentDeployment();
    await msg.reply(
      `🔄 Toggling deployment from \`${currentDeployment}\` (uptime: ${dur.humanize()} - started: ${startTimestamp})`,
    );

    try {
      const newDeployment = await deploymentService.toggleActiveDeployment();
      const newStatus = deploymentService.isCurrentDeploymentActive()
        ? "🟢 ACTIVE"
        : "🔴 INACTIVE";
      await msg.reply(
        `✅ Deployment toggled, new deployment is: \`${newDeployment}\` ${newStatus}`,
      );
    } catch (error) {
      await msg.reply(`❌ Failed to toggle deployment: ${error}`);
    }
  }
};
