import { eq, and, inArray, or } from "drizzle-orm";
import { drizzleDb } from "../model/db";
import {
  userLevelsInAppPublic,
  xpBlocksInAppPublic,
  levelRolesInAppPublic,
} from "../db/schema";

export interface UpdateUserXpResult {
  old_level: string | null;
  new_level: string | null;
  add_role_ids: string[] | null;
  remove_role_ids: string[] | null;
}

/**
 * Calculate level from XP using the same formula as the PostgreSQL function
 * Formula: floor((sqrt(100 * (2 * xp + 25)) + 50) / 100)
 */
export function levelFromXp(xp: bigint): bigint {
  const xpNum = Number(xp);
  const level = Math.floor((Math.sqrt(100 * (2 * xpNum + 25)) + 50) / 100);
  return BigInt(level);
}

// Week calculation based on ISO week (Monday start)
function getWeek(date: Date): { week: number; year: number } {
  const d = new Date(date);

  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(
    ((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
  );

  return { week: weekNo, year: d.getUTCFullYear() };
}

/**
 * Check if current time periods match stored time periods for XP reset logic
 */
function shouldResetTimeframe(
  lastMsg: string,
  timeframe: "day" | "week" | "month",
): boolean {
  const lastMsgDate = new Date(lastMsg);
  const now = new Date();

  switch (timeframe) {
    case "day":
      return (
        lastMsgDate.getDate() !== now.getDate() ||
        lastMsgDate.getMonth() !== now.getMonth() ||
        lastMsgDate.getFullYear() !== now.getFullYear()
      );
    case "week": {
      const lastWeek = getWeek(lastMsgDate);
      const currentWeek = getWeek(now);

      return (
        lastWeek.week !== currentWeek.week || lastWeek.year !== currentWeek.year
      );
    }
    case "month":
      return (
        lastMsgDate.getMonth() !== now.getMonth() ||
        lastMsgDate.getFullYear() !== now.getFullYear()
      );
  }
}

/**
 * Calculate which roles should be added/removed based on level change
 */
async function calculateLevelRoles(
  guildId: bigint,
  oldLevel: bigint,
  newLevel: bigint,
): Promise<{ addRoleIds: string[] | null; removeRoleIds: string[] | null }> {
  // Get all level roles for this guild
  const levelRoles = await drizzleDb
    .select()
    .from(levelRolesInAppPublic)
    .where(eq(levelRolesInAppPublic.guildId, guildId));

  const addRoleIds: string[] = [];
  const removeRoleIds: string[] = [];

  for (const role of levelRoles) {
    const { roleId, addLevel, removeLevel } = role;

    // Role should be added if:
    // - add_level is set and new_level >= add_level
    // - remove_level is null OR new_level < remove_level
    if (
      addLevel !== null &&
      newLevel >= addLevel &&
      (removeLevel === null || newLevel < removeLevel)
    ) {
      addRoleIds.push(roleId.toString());
    }

    // Role should be removed if:
    // - remove_level is set and new_level >= remove_level
    if (removeLevel !== null && newLevel >= removeLevel) {
      removeRoleIds.push(roleId.toString());
    }
  }

  return {
    addRoleIds: addRoleIds.length > 0 ? addRoleIds : null,
    removeRoleIds: removeRoleIds.length > 0 ? removeRoleIds : null,
  };
}

/**
 * TypeScript implementation of the PostgreSQL update_user_xp function
 * Replicates the exact logic for XP blocking, calculation, timeframe tracking, and role management
 */
export async function updateUserXp(
  guildId: string,
  channelId: string,
  userId: string,
  roleIds: string[],
): Promise<UpdateUserXpResult> {
  const guildIdBigint = BigInt(guildId);
  const channelIdBigint = BigInt(channelId);
  const userIdBigint = BigInt(userId);
  const roleIdsBigint = roleIds.map((id) => BigInt(id));

  // Check XP blocks - if channel or any user role is blocked, return early
  const xpBlocks = await drizzleDb
    .select()
    .from(xpBlocksInAppPublic)
    .where(
      and(
        eq(xpBlocksInAppPublic.guildId, guildIdBigint),
        or(
          // Channel block
          and(
            eq(xpBlocksInAppPublic.blockId, channelIdBigint),
            eq(xpBlocksInAppPublic.blockType, "channel"),
          ),
          // Role blocks
          ...(roleIdsBigint.length > 0
            ? [
                and(
                  inArray(xpBlocksInAppPublic.blockId, roleIdsBigint),
                  eq(xpBlocksInAppPublic.blockType, "role"),
                ),
              ]
            : []),
        ),
      ),
    );

  // If any blocks found, return early with no XP gain
  if (xpBlocks.length > 0) {
    return {
      old_level: null,
      new_level: null,
      add_role_ids: null,
      remove_role_ids: null,
    };
  }

  // Get or create user level record
  const userLevel = await drizzleDb
    .select()
    .from(userLevelsInAppPublic)
    .where(
      and(
        eq(userLevelsInAppPublic.userId, userIdBigint),
        eq(userLevelsInAppPublic.guildId, guildIdBigint),
      ),
    )
    .limit(1);

  const now = new Date();
  const nowString = now.toISOString();

  // If user doesn't exist, create initial record
  if (userLevel.length === 0) {
    await drizzleDb.insert(userLevelsInAppPublic).values({
      userId: userIdBigint,
      guildId: guildIdBigint,
      msgAllTime: 5n, // First message gives 5 XP
      msgMonth: 5n,
      msgWeek: 5n,
      msgDay: 5n,
      lastMsg: nowString,
    });

    const newLevel = levelFromXp(5n);

    // Get level roles for the new level
    const { addRoleIds, removeRoleIds } = await calculateLevelRoles(
      guildIdBigint,
      0n,
      newLevel,
    );

    return {
      old_level: "0",
      new_level: newLevel.toString(),
      add_role_ids: addRoleIds,
      remove_role_ids: removeRoleIds,
    };
  }

  const currentRecord = userLevel[0];
  const oldLevel = levelFromXp(currentRecord.msgAllTime);

  // Check 1-minute cooldown
  const lastMsgTime = new Date(currentRecord.lastMsg);
  const timeSinceLastMsg = now.getTime() - lastMsgTime.getTime();
  if (timeSinceLastMsg < 60000) {
    // 60 seconds = 60000 milliseconds
    return {
      old_level: null,
      new_level: null,
      add_role_ids: null,
      remove_role_ids: null,
    };
  }

  // Calculate new XP values with timeframe resets
  const newMsgAllTime = currentRecord.msgAllTime + 5n;
  const newMsgMonth = shouldResetTimeframe(currentRecord.lastMsg, "month")
    ? 5n
    : currentRecord.msgMonth + 5n;
  const newMsgWeek = shouldResetTimeframe(currentRecord.lastMsg, "week")
    ? 5n
    : currentRecord.msgWeek + 5n;
  const newMsgDay = shouldResetTimeframe(currentRecord.lastMsg, "day")
    ? 5n
    : currentRecord.msgDay + 5n;

  // Update user level record
  await drizzleDb
    .update(userLevelsInAppPublic)
    .set({
      msgAllTime: newMsgAllTime,
      msgMonth: newMsgMonth,
      msgWeek: newMsgWeek,
      msgDay: newMsgDay,
      lastMsg: nowString,
    })
    .where(
      and(
        eq(userLevelsInAppPublic.userId, userIdBigint),
        eq(userLevelsInAppPublic.guildId, guildIdBigint),
      ),
    );

  const newLevel = levelFromXp(newMsgAllTime);

  // Calculate role changes
  const { addRoleIds, removeRoleIds } = await calculateLevelRoles(
    guildIdBigint,
    oldLevel,
    newLevel,
  );

  return {
    old_level: oldLevel.toString(),
    new_level: newLevel.toString(),
    add_role_ids: addRoleIds,
    remove_role_ids: removeRoleIds,
  };
}
