import { Events, Message } from "discord.js";
import { Logger } from "pino";
import dayjs from "@/shared/domain/dayjs";
import { DeploymentService } from "../application/DeploymentService";
import { config } from "@/shared/infrastructure/config";
import toTimestamp from "@/utils/toTimestamp";
import { EventHandler } from "@/core/cluster/presentation/EventHandler";
import { Duration } from "dayjs/plugin/duration";

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
      await this.handleDeploymentStatusCommand(msg, dur, startTimestamp);
      return;
    }

    if (msg.content === "!toggle-deployment") {
      await this.handleToggleDeploymentCommand(msg, dur);
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

  private async handleToggleDeploymentCommand(
    msg: Message,
    dur: Duration,
  ): Promise<void> {
    try {
      const currentDeployment = this.deploymentService.getCurrentDeployment();

      const content = `🔄 Toggling deployment from \`${currentDeployment}\``;
      await msg.reply(content);

      const newDeployment =
        await this.deploymentService.toggleActiveDeployment();

      await msg.reply(`✅ Deployment toggled to: \`${newDeployment}\``);

      this.logger.info(
        {
          userId: msg.author.id,
          channelId: msg.channelId,
          from: currentDeployment,
          to: newDeployment,
          uptime: dur.humanize(),
        },
        "Deployment toggled successfully",
      );
    } catch (error) {
      this.logger.error(
        { error, userId: msg.author.id },
        "Failed to toggle deployment",
      );
      await msg.reply(`❌ Failed to toggle deployment: ${error}`);
    }
  }
}
