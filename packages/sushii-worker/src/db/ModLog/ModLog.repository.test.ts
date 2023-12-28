import { expect, describe, it, beforeEach, afterEach } from "bun:test";
// Need this to not fail on utc
import "../../dayjs";

import db from "../../model/db";
import { deleteModLogsRange, upsertModLog } from "./ModLog.repository";
import { InsertableModLogRow } from "./ModLog.table";

describe("ModLog.repository", () => {
  describe("upsertModLog", () => {
    it("should create a new mod log", async () => {
      const expectedMogLog: InsertableModLogRow = {
        guild_id: "123",
        case_id: "2",
        user_id: "123",
        action: "kick",
        reason: "reason",
        action_time: new Date(),
        pending: false,
        user_tag: "user#1234",
        attachments: [],
        executor_id: null,
        msg_id: null,
      };

      await db.transaction().execute(async (tx) => {
        const insertedModLog = await upsertModLog(tx, expectedMogLog);
        expect(expectedMogLog).toEqual(insertedModLog);

        const deleted = await deleteModLogsRange(
          tx,
          expectedMogLog.guild_id!,
          expectedMogLog.case_id,
          expectedMogLog.case_id,
        );

        expect(deleted).toHaveLength(1);
        expect(deleted[0]).toEqual(expectedMogLog);
      });
    });
  });
});
