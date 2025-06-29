import { Insertable, Selectable, Updateable } from "kysely";
import {
  AppPublicBanPoolAddAction,
  AppPublicBanPoolAddMode,
  AppPublicBanPoolRemoveAction,
  AppPublicBanPoolRemoveMode,
  AppPublicBanPools,
} from "../../../model/dbTypes";

export type BanPoolRow = Selectable<AppPublicBanPools>;
export type InsertableBanPoolRow = Insertable<AppPublicBanPools>;
export type UpdateableBanPoolRow = Updateable<AppPublicBanPools>;

export const addModeValues: AppPublicBanPoolAddMode[] = [
  "all_bans",
  "manual",
  "nothing",
];

export const removeModeValues: AppPublicBanPoolRemoveMode[] = [
  "all_unbans",
  "manual",
  "nothing",
];

export const addActionValues: AppPublicBanPoolAddAction[] = [
  "ban",
  "timeout_and_ask",
  "ask",
  "nothing",
];

export const removeActionValues: AppPublicBanPoolRemoveAction[] = [
  "unban",
  "ask",
  "nothing",
];
