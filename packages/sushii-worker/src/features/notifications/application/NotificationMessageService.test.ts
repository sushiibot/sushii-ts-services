import { describe, expect, test, mock } from "bun:test";
import { NotificationMessageService } from "./NotificationMessageService";
import { Notification } from "../domain/entities/Notification";

describe("NotificationMessageService", () => {
  const mockNotificationService = {
    findMatchingNotifications: mock(() => Promise.resolve([])),
    cleanupMemberLeft: mock(() => Promise.resolve()),
  };

  const mockLogger = {
    debug: mock(),
    error: mock(),
  };

  const service = new NotificationMessageService(
    mockNotificationService as any,
    mockLogger as any,
  );

  test("ignores bot messages", async () => {
    const mockMessage = {
      inGuild: () => true,
      author: { bot: true, id: "bot123" },
      content: "test message",
    };

    await service.processMessage(mockMessage as any);

    expect(mockNotificationService.findMatchingNotifications).not.toHaveBeenCalled();
  });

  test("ignores DM messages", async () => {
    const mockMessage = {
      inGuild: () => false,
      author: { bot: false, id: "user123" },
      content: "test message",
    };

    await service.processMessage(mockMessage as any);

    expect(mockNotificationService.findMatchingNotifications).not.toHaveBeenCalled();
  });

  test("ignores messages without content", async () => {
    const mockMessage = {
      inGuild: () => true,
      author: { bot: false, id: "user123" },
      content: "",
    };

    await service.processMessage(mockMessage as any);

    expect(mockNotificationService.findMatchingNotifications).not.toHaveBeenCalled();
  });

  test("processes valid messages", async () => {
    const notifications = [
      Notification.create("guild1", "user1", "test"),
      Notification.create("guild1", "user2", "hello"),
    ];
    mockNotificationService.findMatchingNotifications.mockResolvedValue(notifications);

    const mockMessage = {
      inGuild: () => true,
      author: { bot: false, id: "author123" },
      content: "test hello world",
      guildId: "guild1",
      channelId: "channel1",
      channel: { parentId: "category1" },
    };

    await service.processMessage(mockMessage as any);

    expect(mockNotificationService.findMatchingNotifications).toHaveBeenCalledWith(
      "guild1",
      "category1", 
      "channel1",
      "author123",
      "test hello world"
    );
  });

  test("deduplicates notifications by user", async () => {
    const notifications = [
      Notification.create("guild1", "user1", "test"),
      Notification.create("guild1", "user1", "hello"), // duplicate user
      Notification.create("guild1", "user2", "world"),
    ];
    mockNotificationService.findMatchingNotifications.mockResolvedValue(notifications);

    const mockGuild = {
      members: {
        fetch: mock((userId: string) => {
          if (userId === "user1" || userId === "user2") {
            return Promise.resolve({
              id: userId,
              send: mock(() => Promise.resolve()),
            });
          }
          return Promise.reject(new Error("Member not found"));
        }),
      },
    };

    const mockMessage = {
      inGuild: () => true,
      author: { bot: false, id: "author123" },
      content: "test hello world",
      guildId: "guild1",
      channelId: "channel1",
      channel: { 
        parentId: "category1",
        permissionsFor: mock(() => ({ has: () => true })),
      },
      guild: mockGuild,
      url: "https://discord.com/channels/guild1/channel1/msg123",
      member: { displayAvatarURL: () => "avatar.png" },
    };

    await service.processMessage(mockMessage as any);

    // Should only fetch 2 unique users, not 3
    expect(mockGuild.members.fetch).toHaveBeenCalledTimes(2);
    expect(mockGuild.members.fetch).toHaveBeenCalledWith("user1");
    expect(mockGuild.members.fetch).toHaveBeenCalledWith("user2");
  });

  test("cleans up notifications for missing members", async () => {
    const notifications = [Notification.create("guild1", "user1", "test")];
    mockNotificationService.findMatchingNotifications.mockResolvedValue(notifications);

    const mockGuild = {
      members: {
        fetch: mock(() => Promise.reject(new Error("Member not found"))),
      },
    };

    const mockMessage = {
      inGuild: () => true,
      author: { bot: false, id: "author123" },
      content: "test message",
      guildId: "guild1",
      channelId: "channel1",
      channel: { parentId: "category1" },
      guild: mockGuild,
    };

    await service.processMessage(mockMessage as any);

    expect(mockNotificationService.cleanupMemberLeft).toHaveBeenCalledWith("guild1", "user1");
  });
});