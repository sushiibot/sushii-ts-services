import { AllSelection } from "kysely/dist/cjs/parser/select-parser";
import { DB } from "../../../model/dbTypes";
import SushiiEmoji from "../../../constants/SushiiEmoji";

/**
 * Get the corresponding emoji for the current radio button
 * 
 * @param selectedValue Current user selected value
 * @param choiceValue The value of the radio option
 * @returns Emoji for the radio button
 */
export function getRadioButton<T>(selectedValue: T, choiceValue: T): string {
  return selectedValue === choiceValue ? SushiiEmoji.RadioOn : SushiiEmoji.RadioOff
}

export function buildPoolSettingsString(
  pool: AllSelection<DB, "app_public.ban_pools">,
  poolMember: AllSelection<DB, "app_public.ban_pool_members">,
  ): string {
    // Ignore blocked members
    if (poolMember.permission === "blocked") {
      return ""
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

  let permissionStr
  switch (poolMember.permission) {
    case "view":
      permissionStr = "Viewer"
      break;
    case "edit":
      permissionStr = "Editor (add / remove bans)"
      break;
  }

  // ---------------------------------------------------------------------------
  // Add mode
  // When to add bans in this server to this pool
  let addModeStr = "**When to add this server's bans to pool:**\n"

  addModeStr += getRadioButton(poolMember.add_mode, "all_bans")
  addModeStr += "Automatically add all bans"
  addModeStr += "\n"

  addModeStr += getRadioButton(poolMember.add_mode, "manual")
  addModeStr += "Manually add bans"
  addModeStr += "\n"

  addModeStr += getRadioButton(poolMember.add_mode, "nothing")
  addModeStr += "Add nothing (lookup reasons only)"
  addModeStr += "\n"

  // ---------------------------------------------------------------------------
  // Remove mode
  // When to remove bans in this server from this pool
  let removeModeStr = "**When to remove this server's bans from pool:**\n"

  removeModeStr += getRadioButton(poolMember.remove_mode, "all_unbans")
  removeModeStr += "Automatically remove all unbans"
  removeModeStr += "\n"

  removeModeStr += getRadioButton(poolMember.remove_mode, "manual")
  removeModeStr += "Manually remove unbans"
  removeModeStr += "\n"

  removeModeStr += getRadioButton(poolMember.remove_mode, "nothing")
  removeModeStr += "Remove nothing (lookup reasons only)"
  removeModeStr += "\n"

  // ---------------------------------------------------------------------------
  // Add action

  let addActionStr = "**What to do when pool bans are added by other servers:**\n"
  
  addActionStr += getRadioButton(poolMember.add_action, "ban")
  addActionStr += "Automatically ban"
  addActionStr += "\n"

  addActionStr += getRadioButton(poolMember.add_action, "require_confirmation")
  addActionStr += "Ask for confirmation"
  addActionStr += "\n"

  addActionStr += getRadioButton(poolMember.add_action, "nothing")
  addActionStr += "Do nothing"
  addActionStr += "\n"

  // ---------------------------------------------------------------------------
  // Remove action

  let removeActionStr = "**What to do when pool bans are removed by other servers:**\n"

  removeActionStr += getRadioButton(poolMember.remove_action, "unban")
  removeActionStr += "Automatically unban"
  removeActionStr += "\n"

  removeActionStr += getRadioButton(poolMember.remove_action, "require_confirmation")
  removeActionStr += "Ask for confirmation"
  removeActionStr += "\n"

  removeActionStr += getRadioButton(poolMember.remove_action, "nothing")
  removeActionStr += "Do nothing"
  removeActionStr += "\n"

  // ---------------------------------------------------------------------------
  // Done

  const fullStr = [
    `**Permission**: ${permissionStr}`,
    addModeStr,
    removeModeStr,
    addActionStr,
    removeActionStr
  ].join("\n")
  
  return fullStr;
}
