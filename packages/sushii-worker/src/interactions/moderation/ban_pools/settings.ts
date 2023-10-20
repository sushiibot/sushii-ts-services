import SushiiEmoji from "../../../constants/SushiiEmoji";
import { BanPoolMemberRow } from "./BanPoolMember.table";
import { BanPoolGuildSettingsRow } from "./GuildSettings.table";

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

export function buildPoolSettingsString(
  poolMember: BanPoolMemberRow,
  settings: BanPoolGuildSettingsRow | null,
): string {
  const member = poolMember;

  // Ignore blocked members
  if (poolMember && poolMember.permission === "blocked") {
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

  let alertChannelStr;
  if (!settings?.alert_channel_id) {
    alertChannelStr =
      "⚠️ **Warning:** This server does not have an alert channel set. \
Use `/banpool settings` to set one.";
  } else {
    alertChannelStr = `Alerts will be sent to <#${settings.alert_channel_id}>.`;
  }

  let permissionStr;
  if (member) {
    switch (member.permission) {
      case "view":
        permissionStr = "Viewer";

        // TODO: Ensure view permissions is shown as nothing and can't edit these
        // Display something better instead of just showing as nothing
        member.add_mode = "nothing";
        member.remove_mode = "nothing";
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

  if (member && member.permission === "view") {
    modeSection += "\n";
    modeSection +=
      "These settings are disabled because you aren't a pool editor. \
This server can't add or remove users from this pool. If you want edit permissions, \
ask the pool owner.";
  }

  // ---------------------------------------------------------------------------
  // Add mode
  // When to add bans in this server to this pool
  let addModeStr = "**When a user is banned in this server...**\n";

  addModeStr += [
    "> ",
    getRadioButton(member.add_mode, "all_bans"),
    " Automatically add to pool",
    "\n",

    "> ",
    getRadioButton(member.add_mode, "manual"),
    " Ask to add to pool",
    "\n",

    "> ",
    getRadioButton(member.add_mode, "nothing"),
    " Do nothing",
    "\n",
  ].join("");

  // ---------------------------------------------------------------------------
  // Remove mode
  // When to remove bans in this server from this pool
  let removeModeStr = "**When a user is unbanned from this server...**\n";

  removeModeStr += [
    "> ",
    getRadioButton(member.remove_mode, "all_unbans"),
    " Automatically remove from pool",
    "\n",

    "> ",
    getRadioButton(member.remove_mode, "manual"),
    " Ask to remove from pool",
    "\n",

    "> ",
    getRadioButton(member.remove_mode, "nothing"),
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
    getRadioButton(member.add_action, "ban"),
    " Automatically ban",
    "\n",

    "> ",
    getRadioButton(member.add_action, "timeout_and_ask"),
    " Timeout user and ask what to do", // TODO: In alerts channel
    "\n",

    "> ",
    getRadioButton(member.add_action, "ask"),
    " Ask what to do", // TODO: In alerts channel
    "\n",

    "> ",
    getRadioButton(member.add_action, "nothing"),
    " Do nothing",
    "\n",
  ].join("");

  // ---------------------------------------------------------------------------
  // Remove action

  let removeActionStr = "**When a user is unbanned by another server...**\n";

  removeActionStr += [
    "> ",
    getRadioButton(member.remove_action, "unban"),
    " Automatically unban",
    "\n",

    "> ",
    getRadioButton(member.remove_action, "ask"),
    " Ask what to do",
    "\n",

    "> ",
    getRadioButton(member.remove_action, "nothing"),
    " Do nothing",
    "\n",
  ].join("");

  // ---------------------------------------------------------------------------
  // Done

  const fullStr = [alertChannelStr];

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
