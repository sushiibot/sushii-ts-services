import { expect, describe, it, beforeEach, afterEach, test } from "bun:test";
// Need this to not fail on utc
import "../../../dayjs";
import db from "../../../infrastructure/database/db";
import {
  createPool,
  joinPool,
  // showPool,
  // deletePool,
} from "./BanPool.service";

import { BanPoolError } from "./errors";

test.skip("BanPool.service", () => {
  const givePoolName = "testing-pool";
  const giveGuildId = "1234";
  const giveUserId = "5432";
  const giveDescription = "this is a description";

  describe("createPool", () => {
    beforeEach(async () => {
      // Ensure clean slate
      await db
        .deleteFrom("app_public.ban_pools")
        .where("pool_name", "=", givePoolName)
        .where("guild_id", "=", giveGuildId)
        .execute();
    });

    afterEach(async () => {
      // Delete
      await db
        .deleteFrom("app_public.ban_pools")
        .where("pool_name", "=", givePoolName)
        .where("guild_id", "=", giveGuildId)
        .execute();
    });

    it("should create a new pool", async () => {
      const { pool, inviteCode } = await createPool(
        givePoolName,
        giveGuildId,
        giveUserId,
        giveDescription,
      );

      expect(inviteCode).toBeDefined();

      const selected = await db
        .selectFrom("app_public.ban_pools")
        .selectAll()
        .where("pool_name", "=", givePoolName)
        .where("guild_id", "=", giveGuildId)
        .executeTakeFirstOrThrow();

      expect(pool).toEqual(selected);

      expect(selected).toBeDefined();
      expect(selected.pool_name).toBe(givePoolName);
      expect(selected.guild_id).toBe(giveGuildId);
      expect(selected.creator_id).toBe(giveUserId);
      expect(selected.description).toBe(giveDescription);

      const selectedInvite = await db
        .selectFrom("app_public.ban_pool_invites")
        .selectAll()
        .where("invite_code", "=", inviteCode)
        .executeTakeFirstOrThrow();

      expect(selectedInvite).toBeDefined();
      expect(selectedInvite.pool_name).toBe(givePoolName);
      expect(selectedInvite.owner_guild_id).toBe(giveGuildId);
      expect(selectedInvite.invite_code).toBe(inviteCode);
      expect(selectedInvite.expires_at).not.toBeNull();
    });

    it("should throw an error if the pool already exists", async () => {
      await createPool(givePoolName, giveGuildId, giveUserId, giveDescription);

      try {
        await createPool(
          givePoolName,
          giveGuildId,
          giveUserId,
          giveDescription,
        );
      } catch (err) {
        expect(err).toBeInstanceOf(BanPoolError);
        expect((err as BanPoolError).type === "POOL_ALREADY_EXISTS");
      }
    });
  });

  describe("joinPool", () => {
    it("should join an existing pool", async () => {});

    it("should throw an error if the invite is expired", async () => {
      // TODO: Implement test
    });

    it("should throw an error if the pool is not found", async () => {
      // TODO: Implement test
    });

    it("should throw an error if the guild is already a member of the pool", async () => {
      // TODO: Implement test
    });

    it("should throw an error if the guild is the owner of the pool", async () => {
      const { inviteCode } = await createPool(
        givePoolName,
        giveGuildId,
        giveUserId,
        giveDescription,
      );

      expect(inviteCode).toBeDefined();

      try {
        await joinPool(inviteCode, giveGuildId, () => undefined);
      } catch (err) {
        expect(err).toBeInstanceOf(BanPoolError);
        expect((err as BanPoolError).type === "CANNOT_JOIN_OWN_POOL");
      }
    });

    it("should throw an error if the owner guild is unavailable", async () => {
      // TODO: Implement test
    });
  });

  describe("showPool", () => {
    it("should show an existing pool", async () => {
      // TODO: Implement test
    });

    it("should throw an error if the pool is not found", async () => {
      // TODO: Implement test
    });

    it("should throw an error if the guild is not a member of the pool", async () => {
      // TODO: Implement test
    });
  });

  describe("deletePool", () => {
    it("should delete an existing pool", async () => {
      // TODO: Implement test
    });

    it("should throw an error if the pool is not found", async () => {
      // TODO: Implement test
    });
  });

  describe("createInvite", () => {
    it("should create a new invite", async () => {
      // TODO: Implement test
    });

    it("should throw an error if the pool is not found", async () => {
      // TODO: Implement test
    });
  });

  describe("deleteInvite", () => {
    it("should delete an existing invite", async () => {
      // TODO: Implement test
    });

    it("should throw an error if the invite is not found", async () => {
      // TODO: Implement test
    });
  });
});
