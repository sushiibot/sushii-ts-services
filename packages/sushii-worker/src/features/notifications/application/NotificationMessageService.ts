import { Logger } from "pino";
import { GuildMember, Message } from "discord.js";
import { Notification } from "../domain/entities/Notification";
import { NotificationService } from "./NotificationService";
import { createNotificationEmbed } from "../presentation/views/NotificationEmbedView";

export class NotificationMessageService {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly logger: Logger,
  ) {}

  async processMessage(message: Message): Promise<void> {
    if (!message.inGuild() || message.author.bot || !message.content) {
      return;
    }

    const matchedNotifications =
      await this.notificationService.findMatchingNotifications(
        message.guildId,
        message.channel.parentId,
        message.channelId,
        message.author.id,
        message.content,
      );

    if (matchedNotifications.length === 0) {
      return;
    }

    const uniqueNotifications = this.deduplicateByUser(matchedNotifications);
    await this.sendNotifications(message, uniqueNotifications);
  }

  private deduplicateByUser(notifications: Notification[]): Notification[] {
    const seenUserIds = new Set<string>();
    return notifications.filter((notification) => {
      if (seenUserIds.has(notification.userId)) {
        return false;
      }
      seenUserIds.add(notification.userId);
      return true;
    });
  }

  private async sendNotifications(
    message: Message<true>,
    notifications: Notification[],
  ): Promise<void> {
    for (const notification of notifications) {
      try {
        await this.sendNotificationToUser(message, notification);
      } catch (error) {
        this.logger.error(
          { error, guildId: message.guildId, userId: notification.userId },
          "Failed to send notification to user",
        );
      }
    }
  }

  private async sendNotificationToUser(
    message: Message<true>,
    notification: Notification,
  ): Promise<void> {
    let member: GuildMember;

    try {
      member = await message.guild.members.fetch(notification.userId);
    } catch {
      await this.handleMemberNotFound(message, notification);
      return;
    }

    if (!this.canMemberViewChannel(message, member)) {
      this.logger.debug(
        {
          guildId: message.guildId,
          userId: member.id,
          channelId: message.channelId,
        },
        "Member cannot view channel, skipping notification",
      );
      return;
    }

    const embed = createNotificationEmbed(message, notification);

    try {
      await member.send({ embeds: [embed] });
      this.logger.debug(
        { userId: notification.userId, keyword: notification.keyword },
        "Sent notification",
      );
    } catch (error) {
      this.logger.debug(
        { userId: notification.userId, error },
        "Failed to send DM notification",
      );
    }
  }

  private async handleMemberNotFound(
    message: Message,
    notification: Notification,
  ): Promise<void> {
    this.logger.debug(
      { guildId: message.guildId, userId: notification.userId },
      "Member not found, cleaning up notification",
    );

    await this.notificationService.cleanupMemberLeft(
      notification.guildId,
      notification.userId,
    );
  }

  private canMemberViewChannel(message: Message, member: GuildMember): boolean {
    if (!message.inGuild()) {
      return false;
    }

    const memberPermissions = message.channel.permissionsFor(member);
    return memberPermissions?.has("ViewChannel") ?? false;
  }
}
