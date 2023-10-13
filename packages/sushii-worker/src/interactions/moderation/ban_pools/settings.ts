import SushiiEmoji from "../../../constants/SushiiEmoji";
import { BanPoolRow } from "./BanPool.table";
import { BanPoolMemberRow } from "./BanPoolMember.table";

/**
 * Get the corresponding emoji for the current radio button
 *
 * @param selectedValue Current user selected value
 * @param choiceValue The value of the radio option
 * @returns Emoji for the radio button
 */
export function getRadioButton<T>(selectedValue: T, choiceValue: T): string {
  return selectedValue === choiceValue
    ? SushiiEmoji.RadioOn
    : SushiiEmoji.RadioOff;
}

export function isPoolMember(
  pool:
  | BanPoolRow
  | BanPoolMemberRow,
): pool is BanPoolMemberRow {
  return "permission" in pool;
}

export function buildPoolSettingsString(
  pool:
    | BanPoolRow
    | BanPoolMemberRow,
): string {
  const isMember = isPoolMember(pool);

  // Ignore blocked members
  if (isMember && pool.permission === "blocked") {
    throw new Error("Member is blocked, shouldn't be able to call this.");
  }

  /*
     -- Invited guilds can view the pool, but not edit it.
  -- Can be changed to 'edit' by pool owner, which lets them add bans.
  permission  app_public.ban_pool_permission  not null default 'view',

  -- Only for pool members with edit permissions.
  add_mode    app_public.ban_pool_add_mode    not null default 'all_bans',
  remove_mode app_public.ban_pool_remove_mode not null default 'all_unbans',

  -- For all pool members with edit/view permissions.
  add_action    app_public.ban_pool_add_action    not null default 'ban',
  remove_action app_public.ban_pool_remove_action not null default 'unban',
  */

  let permissionStr;
  if (isMember) {
    switch (pool.permission) {
      case "view":
        permissionStr = "Viewer";

        // TODO: Ensure view permissions is shown as nothing and can't edit these
        pool.add_mode = "nothing";
        pool.remove_mode = "nothing";
        break;
      case "edit":
        permissionStr = "Editor (add / remove bans)";
        break;
      case "blocked":
        permissionStr = "";
        break;
    }
  }

  // ---------------------------------------------------------------------------
  // Mode - Bans in this server
  // ---------------------------------------------------------------------------

  let modeSection = "__**Ban / Unban in THIS server**__";

  if (isMember && pool.permission === "view") {
    modeSection += "\n";
    modeSection += "These settings are disabled because you aren't a pool editor. \
This server can't add or remove users from this pool. If you want edit permissions, \
ask the pool owner."
  }

  // ---------------------------------------------------------------------------
  // Add mode
  // When to add bans in this server to this pool
  let addModeStr = "**When a user is banned in this server...**\n";

  addModeStr += [
    "> ",
    getRadioButton(pool.add_mode, "all_bans"),
    " Automatically add to pool",
    "\n",

    "> ",
    getRadioButton(pool.add_mode, "manual"),
    " Ask to add to pool",
    "\n",

    "> ",
    getRadioButton(pool.add_mode, "nothing"),
    " Do nothing",
    "\n",
  ].join("");

  // ---------------------------------------------------------------------------
  // Remove mode
  // When to remove bans in this server from this pool
  let removeModeStr = "**When a user is unbanned from this server...**\n";

  removeModeStr += [
    "> ",
    getRadioButton(pool.remove_mode, "all_unbans"),
    " Automatically remove from pool",
    "\n",

    "> ",
    getRadioButton(pool.remove_mode, "manual"),
    " Ask to remove from pool",
    "\n",

    "> ",
    getRadioButton(pool.remove_mode, "nothing"),
    " Do nothing",
    "\n",
  ].join("");

  // ---------------------------------------------------------------------------
  // Action - Bans in other servers
  // ---------------------------------------------------------------------------

  const actionSection = "__**Ban / Unban by OTHER servers in this pool**__";

  // ---------------------------------------------------------------------------
  // Add action

  let addActionStr = "**When a user is banned by a different server...**\n";

  addActionStr += [
    "> ",
    getRadioButton(pool.add_action, "ban"),
    " Automatically ban",
    "\n",

    "> ",
    getRadioButton(pool.add_action, "require_confirmation"),
    " Ask what to do", // TODO: In alerts channel
    "\n",

    "> ",
    getRadioButton(pool.add_action, "nothing"),
    " Do nothing",
    "\n",
  ].join("");

  // ---------------------------------------------------------------------------
  // Remove action

  let removeActionStr = "**When a user is unbanned by another server...**\n";

  removeActionStr += [
    "> ",
    getRadioButton(pool.remove_action, "unban"),
    " Automatically unban",
    "\n",

    "> ",
    getRadioButton(pool.remove_action, "require_confirmation"),
    " Ask what to do",
    "\n",

    "> ",
    getRadioButton(pool.remove_action, "nothing"),
    " Do nothing",
    "\n",
  ].join("");

  // ---------------------------------------------------------------------------
  // Done

  const fullStr = [];

  if (permissionStr) {
    fullStr.push(permissionStr);
  }

  fullStr.push(
    modeSection,
    addModeStr,
    removeModeStr,

    actionSection,
    addActionStr,
    removeActionStr,
  );

  return fullStr.join("\n");
}
