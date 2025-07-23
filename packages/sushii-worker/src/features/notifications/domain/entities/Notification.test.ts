import { describe, expect, test } from "bun:test";
import { Notification } from "./Notification";

describe("Notification", () => {
  test("creates valid notification", () => {
    const notification = Notification.create("guild1", "user1", "test");
    
    expect(notification.guildId).toBe("guild1");
    expect(notification.userId).toBe("user1");
    expect(notification.keyword).toBe("test");
    expect(notification.cleanedKeyword).toBe("test");
  });

  test("cleans keyword to lowercase", () => {
    const notification = Notification.create("guild1", "user1", "  TEST  ");
    
    expect(notification.cleanedKeyword).toBe("test");
  });

  test("rejects keyword too short", () => {
    expect(() => Notification.create("guild1", "user1", "ab")).toThrow(
      "Keyword must be at least 3 characters long"
    );
  });

  test("rejects keyword too long", () => {
    const longKeyword = "a".repeat(101);
    expect(() => Notification.create("guild1", "user1", longKeyword)).toThrow(
      "Keyword must be no more than 100 characters long"
    );
  });
});