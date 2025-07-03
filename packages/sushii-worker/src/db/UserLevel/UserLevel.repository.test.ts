import { describe, expect, test } from "bun:test";
import { getUserGuildAllRanks } from "./UserLevel.repository";
import "../../core/dayjs";
import db from "../../infrastructure/database/db";

describe("UserLevel.repository", () => {
  test("getUserGuildAllRanks", () => {
    const guildId = "167058919611564043";
    const userId = "150443906511667200";
    const ranks = getUserGuildAllRanks(db, guildId, userId);

    expect(ranks).resolves.toHaveProperty("day");
  });
});
