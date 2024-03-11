import { describe, test, expect } from "bun:test";
import {
  getMatchingNotifications,
  insertNotification,
  stringToKeywords,
} from "./Notification.repository";
import db from "../../model/db";
import { insertNotificationBlock } from "./NotificationBlock.repository";
import { AppPublicNotificationBlockType } from "../../model/dbTypes";

interface MatchingNotificationTest {
  name: string;
  authorId: string;
  channelId: string;
  guildId: string;
  messageContent: string;
  notifications: { user_id: string; guild_id: string; keyword: string }[];
  blocks: {
    user_id: string;
    block_id: string;
    block_type: AppPublicNotificationBlockType;
  }[];
  expectedNotifications: {
    user_id: string;
    guild_id: string;
    keyword: string;
  }[];
}

describe("Notification.repository", () => {
  test("stringToKeywords", () => {
    const keywords = stringToKeywords("hello   world  ");
    expect(keywords).toEqual(["hello", "world"]);
  });

  const tests: MatchingNotificationTest[] = [
    {
      name: "found - no blocks",
      authorId: "2",
      channelId: "200",
      guildId: "300",
      messageContent: "hello world",
      notifications: [{ user_id: "1", guild_id: "300", keyword: "hello" }],
      blocks: [],
      expectedNotifications: [
        { user_id: "1", guild_id: "300", keyword: "hello" },
      ],
    },
    {
      name: "found - different block owner",
      authorId: "2",
      channelId: "200",
      guildId: "300",
      messageContent: "hello world",
      notifications: [{ user_id: "1", guild_id: "300", keyword: "hello" }],
      // block different from notification owner
      blocks: [{ user_id: "3", block_id: "2", block_type: "user" }],
      expectedNotifications: [
        { user_id: "1", guild_id: "300", keyword: "hello" },
      ],
    },
    {
      name: "skipped - author same as owner",
      authorId: "1",
      channelId: "200",
      guildId: "300",
      messageContent: "hello world",
      notifications: [{ user_id: "1", guild_id: "300", keyword: "hello" }],
      blocks: [],
      expectedNotifications: [],
    },
    {
      name: "blocked - user",
      authorId: "2",
      channelId: "200",
      guildId: "300",
      messageContent: "hello world",
      notifications: [{ user_id: "1", guild_id: "300", keyword: "hello" }],
      blocks: [{ user_id: "1", block_id: "2", block_type: "user" }],
      expectedNotifications: [],
    },
    {
      name: "blocked - channel",
      authorId: "2",
      channelId: "200",
      guildId: "300",
      messageContent: "hello world",
      notifications: [{ user_id: "1", guild_id: "300", keyword: "hello" }],
      blocks: [{ user_id: "1", block_id: "200", block_type: "channel" }],
      expectedNotifications: [],
    },
  ];

  tests.forEach((tt) => {
    test(`getMatchingNotifications-${tt.name}`, async () => {
      try {
        /* eslint-disable no-await-in-loop */
        await db.transaction().execute(async (tx) => {
          // Insert notifications
          for (const noti of tt.notifications) {
            const insertRes = await insertNotification(
              tx,
              noti.guild_id,
              noti.user_id,
              noti.keyword,
            );

            expect(Number(insertRes.numInsertedOrUpdatedRows)).toEqual(1);
          }

          // Insert blocks
          for (const block of tt.blocks) {
            const insertRes = await insertNotificationBlock(
              tx,
              block.user_id,
              block.block_id,
              block.block_type,
            );

            expect(Number(insertRes.numInsertedOrUpdatedRows)).toEqual(1);
          }

          const notifications = await getMatchingNotifications(
            tx,
            tt.guildId,
            tt.channelId,
            tt.authorId,
            tt.messageContent,
          );

          expect(notifications).toEqual(tt.expectedNotifications);

          // Avoid contaminating other tests
          throw new Error("rollback");
        });
      } catch (err) {
        // Expected error from rollback, ignore
        if (err instanceof Error && err.message === "rollback") {
          return;
        }

        // Any other error is unexpected so rethrow it
        throw err;
      }
      /* eslint-enable no-await-in-loop */
    });
  });
});
