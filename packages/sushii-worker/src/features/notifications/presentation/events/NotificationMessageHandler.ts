import { Events, Message } from "discord.js";
import opentelemetry from "@opentelemetry/api";
import { EventHandler } from "@/core/cluster/presentation/EventHandler";
import { NotificationMessageService } from "../../application/NotificationMessageService";
import { NotificationService } from "../../application/NotificationService";
import {
  activeNotificationsGauge,
  sentNotificationsCounter,
} from "@/infrastructure/metrics/metrics";

const tracer = opentelemetry.trace.getTracer("notification-handler");

export class NotificationMessageHandler extends EventHandler<Events.MessageCreate> {
  constructor(
    private readonly messageService: NotificationMessageService,
    private readonly notificationService: NotificationService,
  ) {
    super();
  }

  readonly eventType = Events.MessageCreate;

  async handle(message: Message): Promise<void> {
    if (!message.inGuild() || message.author.bot || !message.content) {
      return;
    }

    await tracer.startActiveSpan("notificationHandler", async (span) => {
      try {
        await this.messageService.processMessage(message);
      } catch (error) {
        sentNotificationsCounter.inc({
          status: "failed",
        });
        throw error;
      } finally {
        span.end();
      }

      const totalActiveKeywords =
        await this.notificationService.getTotalNotificationCount();
      activeNotificationsGauge.set(totalActiveKeywords);
    });
  }
}
