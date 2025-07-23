import { describe, expect, test } from "bun:test";
import { NotificationBlock } from "./NotificationBlock";

describe("NotificationBlock", () => {
  test("creates user block", () => {
    const block = NotificationBlock.createUserBlock("user1", "blocked1");
    
    expect(block.userId).toBe("user1");
    expect(block.blockId).toBe("blocked1");
    expect(block.blockType).toBe("user");
    expect(block.isUserBlock).toBe(true);
    expect(block.isChannelBlock).toBe(false);
  });

  test("creates channel block", () => {
    const block = NotificationBlock.createChannelBlock("user1", "channel1");
    
    expect(block.blockType).toBe("channel");
    expect(block.isChannelBlock).toBe(true);
    expect(block.isUserBlock).toBe(false);
  });

  test("creates category block", () => {
    const block = NotificationBlock.createCategoryBlock("user1", "category1");
    
    expect(block.blockType).toBe("category");
    expect(block.isCategoryBlock).toBe(true);
    expect(block.isUserBlock).toBe(false);
  });
});