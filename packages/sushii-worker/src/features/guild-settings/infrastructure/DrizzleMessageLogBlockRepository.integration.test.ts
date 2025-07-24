import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "bun:test";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import pino, { Logger } from "pino";

import { msgLogBlocksInAppPublic } from "@/infrastructure/database/schema";
import * as schema from "@/infrastructure/database/schema";
import { PostgresTestDatabase } from "@/test/PostgresTestDatabase";

import { MessageLogBlockType } from "../domain/entities/MessageLogBlock";
import { DrizzleMessageLogBlockRepository } from "./DrizzleMessageLogBlockRepository";

describe("DrizzleMessageLogBlockRepository (Integration)", () => {
  let testDb: PostgresTestDatabase;
  let db: ReturnType<typeof import("drizzle-orm/node-postgres").drizzle>;
  let repo: DrizzleMessageLogBlockRepository;
  let logger: Logger;

  beforeAll(async () => {
    testDb = new PostgresTestDatabase();
    db = await testDb.initialize();
    logger = pino({ level: "silent" }); // Silent logger for tests
    repo = new DrizzleMessageLogBlockRepository(
      db as unknown as NodePgDatabase<typeof schema>,
      logger,
    );
  });

  beforeEach(async () => {
    // Clear tables before each test to ensure isolation
    await db.delete(msgLogBlocksInAppPublic);
  });

  afterAll(async () => {
    await testDb?.close();
  });

  test("returns empty array when no blocks exist for guild", async () => {
    const guildId = "123456789";

    const blocks = await repo.findByGuildId(guildId);

    expect(blocks).toEqual([]);
  });

  test("adds and retrieves message log blocks correctly", async () => {
    const guildId = "123456789";
    const channelId = "987654321";
    const blockType: MessageLogBlockType = "all";

    await repo.addBlock(guildId, channelId, blockType);

    const blocks = await repo.findByGuildId(guildId);

    expect(blocks).toHaveLength(1);
    expect(blocks[0].guildId).toBe(guildId);
    expect(blocks[0].channelId).toBe(channelId);
    expect(blocks[0].blockType).toBe(blockType);
  });

  test("handles multiple blocks for same guild", async () => {
    const guildId = "123456789";
    const channel1 = "111111111";
    const channel2 = "222222222";
    const channel3 = "333333333";

    await repo.addBlock(guildId, channel1, "all");
    await repo.addBlock(guildId, channel2, "edits");
    await repo.addBlock(guildId, channel3, "deletes");

    const blocks = await repo.findByGuildId(guildId);

    expect(blocks).toHaveLength(3);

    const sortedBlocks = blocks.sort((a, b) =>
      a.channelId.localeCompare(b.channelId),
    );
    expect(sortedBlocks[0].channelId).toBe(channel1);
    expect(sortedBlocks[0].blockType).toBe("all");
    expect(sortedBlocks[1].channelId).toBe(channel2);
    expect(sortedBlocks[1].blockType).toBe("edits");
    expect(sortedBlocks[2].channelId).toBe(channel3);
    expect(sortedBlocks[2].blockType).toBe("deletes");
  });

  test("filters blocks by guild ID correctly", async () => {
    const guild1 = "111111111";
    const guild2 = "222222222";
    const channelId = "987654321";

    await repo.addBlock(guild1, channelId, "all");
    await repo.addBlock(guild2, channelId, "edits");

    const guild1Blocks = await repo.findByGuildId(guild1);
    const guild2Blocks = await repo.findByGuildId(guild2);

    expect(guild1Blocks).toHaveLength(1);
    expect(guild1Blocks[0].guildId).toBe(guild1);
    expect(guild1Blocks[0].blockType).toBe("all");

    expect(guild2Blocks).toHaveLength(1);
    expect(guild2Blocks[0].guildId).toBe(guild2);
    expect(guild2Blocks[0].blockType).toBe("edits");
  });

  test("updates block type on conflict", async () => {
    const guildId = "123456789";
    const channelId = "987654321";

    // Add initial block
    await repo.addBlock(guildId, channelId, "all");

    let blocks = await repo.findByGuildId(guildId);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].blockType).toBe("all");

    // Update with different block type
    await repo.addBlock(guildId, channelId, "edits");

    blocks = await repo.findByGuildId(guildId);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].blockType).toBe("edits");
  });

  test("removes block correctly", async () => {
    const guildId = "123456789";
    const channelId = "987654321";

    // Add block
    await repo.addBlock(guildId, channelId, "all");

    let blocks = await repo.findByGuildId(guildId);
    expect(blocks).toHaveLength(1);

    // Remove block
    await repo.removeBlock(guildId, channelId);

    blocks = await repo.findByGuildId(guildId);
    expect(blocks).toHaveLength(0);
  });

  test("removes only specified block when multiple exist", async () => {
    const guildId = "123456789";
    const channel1 = "111111111";
    const channel2 = "222222222";

    // Add multiple blocks
    await repo.addBlock(guildId, channel1, "all");
    await repo.addBlock(guildId, channel2, "edits");

    let blocks = await repo.findByGuildId(guildId);
    expect(blocks).toHaveLength(2);

    // Remove one block
    await repo.removeBlock(guildId, channel1);

    blocks = await repo.findByGuildId(guildId);
    expect(blocks).toHaveLength(1);
    expect(blocks[0].channelId).toBe(channel2);
    expect(blocks[0].blockType).toBe("edits");
  });

  test("remove operation is idempotent", async () => {
    const guildId = "123456789";
    const channelId = "987654321";

    // Try to remove non-existent block
    await repo.removeBlock(guildId, channelId);

    const blocks = await repo.findByGuildId(guildId);
    expect(blocks).toHaveLength(0);

    // Add and remove block, then try to remove again
    await repo.addBlock(guildId, channelId, "all");
    await repo.removeBlock(guildId, channelId);
    await repo.removeBlock(guildId, channelId); // Second removal

    const blocksAfter = await repo.findByGuildId(guildId);
    expect(blocksAfter).toHaveLength(0);
  });

  test("handles all block types correctly", async () => {
    const guildId = "123456789";
    const blockTypes: MessageLogBlockType[] = ["all", "edits", "deletes"];

    for (let i = 0; i < blockTypes.length; i++) {
      const channelId = `${111111111 + i}`;
      await repo.addBlock(guildId, channelId, blockTypes[i]);
    }

    const blocks = await repo.findByGuildId(guildId);

    expect(blocks).toHaveLength(3);

    const blockTypesSaved = blocks.map((b) => b.blockType).sort();
    expect(blockTypesSaved).toEqual(["all", "deletes", "edits"]);
  });
});
