import { expect, describe, it } from "bun:test";
// Need this to not fail on utc
import "@/core/shared/dayjs";

import db from "../../infrastructure/database/db";
import {
  deleteModLogsRange,
  insertModLog,
  upsertModLog,
} from "./ModLog.repository";
import { InsertableModLogRow } from "./ModLog.table";

describe("ModLog.repository", () => {
  describe("insertModLog", () => {
    it("should increment case_id", async () => {
      const caseNoId = {
        guild_id: "123",
        user_id: "123",
        action: "kick",
        reason: "reason",
        action_time: new Date(),
        pending: false,
        user_tag: "user#1234",
        attachments: [],
      };

      const case1 = await insertModLog(db, caseNoId);
      const case2 = await insertModLog(db, caseNoId);
      const case3 = await insertModLog(db, caseNoId);

      const startId = Number(case1.case_id);

      expect(Number(case1.case_id)).toEqual(startId);
      expect(Number(case2.case_id)).toEqual(startId + 1);
      expect(Number(case3.case_id)).toEqual(startId + 2);
    });
  });

  describe("upsertModLog", () => {
    it("should create a new mod log", async () => {
      const expectedMogLog: InsertableModLogRow = {
        guild_id: "123",
        case_id: "2",
        dm_channel_id: null,
        dm_message_error: null,
        dm_message_id: null,
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
        expect(expectedMogLog).toEqual(insertedModLog as any);

        const deleted = await deleteModLogsRange(
          tx,
          expectedMogLog.guild_id as any,
          expectedMogLog.case_id as any,
          expectedMogLog.case_id as any,
        );

        expect(deleted).toHaveLength(1);
        expect(deleted[0]).toEqual(expectedMogLog as any);
      });
    });
  });
});
