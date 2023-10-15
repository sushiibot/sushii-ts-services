import {
  AppPublicBanPoolAddAction,
  AppPublicBanPoolAddMode,
  AppPublicBanPoolRemoveAction,
  AppPublicBanPoolRemoveMode,
} from "../../../model/dbTypes";
import { BanPoolRow } from "./BanPool.table";
import { BanPoolMemberRow } from "./BanPoolMember.table";

/**
 * Get the actual pool settings, depending on it's the owner or member
 *
 * @param pool
 * @param poolMember
 * @returns
 */
export function getTruePoolSettings(
  pool: BanPoolRow,
  poolMember: BanPoolMemberRow | null,
): {
  addMode: AppPublicBanPoolAddMode;
  removeMode: AppPublicBanPoolRemoveMode;
  addAction: AppPublicBanPoolAddAction;
  removeAction: AppPublicBanPoolRemoveAction;
} {
  if (poolMember) {
    return {
      addMode: poolMember.add_mode,
      removeMode: poolMember.remove_mode,
      addAction: poolMember.add_action,
      removeAction: poolMember.remove_action,
    };
  }

  return {
    addMode: pool.add_mode,
    removeMode: pool.remove_mode,
    addAction: pool.add_action,
    removeAction: pool.remove_action,
  };
}
