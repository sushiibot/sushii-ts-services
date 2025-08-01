import { Duration } from "dayjs/plugin/duration";
import { Events, Message } from "discord.js";
import { Logger } from "pino";

import { EventHandler } from "@/core/cluster/presentation/EventHandler";
import dayjs from "@/shared/domain/dayjs";
import { config } from "@/shared/infrastructure/config";
import toTimestamp from "@/utils/toTimestamp";

import { DeploymentService } from "../application/DeploymentService";

export class DeploymentEventHandler extends EventHandler<Events.MessageCreate> {
  readonly eventType = Events.MessageCreate;

  constructor(
    private readonly deploymentService: DeploymentService,
    private readonly logger: Logger,
  ) {
    super();
  }

  async handle(msg: Message): Promise<void> {
    // Optional values, require both to be set.
    if (!config.deployment.ownerUserId || !config.deployment.ownerChannelId) {
      return;
    }

    // Check if this is an authorized message (either from owner or E2E webhook)
    const isOwnerMessage = msg.author.id === config.deployment.ownerUserId;
    const isE2EWebhookMessage =
      msg.webhookId &&
      config.deployment.e2eWebhookId &&
      msg.webhookId === config.deployment.e2eWebhookId;

    if (!isOwnerMessage && !isE2EWebhookMessage) {
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
      await this.handleDeploymentStatusCommand(msg, dur, startTimestamp);
      return;
    }

    if (msg.content.startsWith("!set-deployment ")) {
      await this.handleSetDeploymentCommand(msg, dur);
      return;
    }
  }

  private async handleDeploymentStatusCommand(
    msg: Message,
    dur: Duration,
    startTimestamp: string,
  ): Promise<void> {
    try {
      const deployment = this.deploymentService.getCurrentDeployment();

      const content =
        `Current deployment: \`${deployment}\`` +
        `\nuptime: ${dur.humanize()}` +
        `\nstarted: ${startTimestamp}`;

      await msg.reply(content);
    } catch (error) {
      this.logger.error(
        { error, userId: msg.author.id },
        "Failed to get deployment status",
      );

      await msg.reply("❌ Failed to get deployment status");
    }
  }

  private async handleSetDeploymentCommand(
    msg: Message,
    dur: Duration,
  ): Promise<void> {
    try {
      // Parse deployment target from command
      const parts = msg.content.split(" ");
      if (parts.length !== 2) {
        await msg.reply("❌ Usage: `!set-deployment <blue|green>`");
        return;
      }

      const targetDeployment = parts[1].toLowerCase();
      if (targetDeployment !== "blue" && targetDeployment !== "green") {
        await msg.reply("❌ Invalid deployment. Use: `blue` or `green`");
        return;
      }

      const currentDeployment = this.deploymentService.getCurrentDeployment();
      const result = await this.deploymentService.setActiveDeployment(
        targetDeployment as "blue" | "green",
      );

      if (!result.changed) {
        await msg.reply(`✅ Already set to \`${targetDeployment}\` deployment`);
        return;
      }

      await msg.reply(
        `🔄 Setting deployment from \`${currentDeployment}\` to \`${targetDeployment}\``,
      );
      await msg.reply(`✅ Deployment set to: \`${result.deployment}\``);

      this.logger.info(
        {
          userId: msg.author.id,
          channelId: msg.channelId,
          from: currentDeployment,
          to: result.deployment,
          uptime: dur.humanize(),
        },
        "Deployment set successfully",
      );
    } catch (error) {
      this.logger.error(
        { error, userId: msg.author.id },
        "Failed to set deployment",
      );
      await msg.reply(`❌ Failed to set deployment: ${error}`);
    }
  }
}
