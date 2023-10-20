import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageActionRowComponentBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import { BanPoolMemberRow } from "./BanPoolMember.table";
import {
  BanPoolRow,
  addActionValues,
  addModeValues,
  removeActionValues,
  removeModeValues,
} from "./BanPool.table";
import {
  AppPublicBanPoolAddAction,
  AppPublicBanPoolAddMode,
  AppPublicBanPoolRemoveAction,
  AppPublicBanPoolRemoveMode,
} from "../../../model/dbTypes";
import logger from "../../../logger";

export enum BanPoolShowPage {
  Home = "home",
  Settings = "settings",
  Members = "members",
  Invites = "invites",
}

export enum BanPoolShowMainCustomId {
  GoSettings = `${BanPoolShowPage.Home}_settings`,
  GoMembers = `${BanPoolShowPage.Home}_members`,
  GoInvites = `${BanPoolShowPage.Home}_invites`,
}

export enum SettingsCustomId {
  AddMode = `${BanPoolShowPage.Settings}_add_mode`,
  RemoveMode = `${BanPoolShowPage.Settings}_remove_mode`,
  AddAction = `${BanPoolShowPage.Settings}_add_action`,
  RemoveAction = `${BanPoolShowPage.Settings}_remove_action`,
}

export const GoBackOverviewCustomId = "go_back_home";

function getBackButtonRow(): ActionRowBuilder<MessageActionRowComponentBuilder> {
  const row = new ActionRowBuilder<ButtonBuilder>();

  const backButton = new ButtonBuilder()
    .setCustomId(GoBackOverviewCustomId)
    .setLabel("Back to pool overview")
    .setStyle(ButtonStyle.Secondary);

  row.addComponents(backButton);

  return row;
}

/**
 *
 * @param pool
 * @returns
 */
export function getShowComponentsMain(
  isOwner: boolean,
  poolMemberCount: number,
  inviteCount: number,
): ActionRowBuilder<MessageActionRowComponentBuilder>[] {
  // Buttons to switch to page:
  // 1. settings
  // 2. member list
  // 3. invite list

  // Show settings
  const row = new ActionRowBuilder<ButtonBuilder>();

  const settingsButton = new ButtonBuilder()
    .setCustomId(BanPoolShowMainCustomId.GoSettings)
    .setLabel("Settings")
    .setStyle(ButtonStyle.Primary);

  const membersButton = new ButtonBuilder()
    .setCustomId(BanPoolShowMainCustomId.GoMembers)
    .setLabel("Members")
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(poolMemberCount === 0);

  logger.debug(
    {
      isOwner,
      poolMemberCount,
      inviteCount,
    },
    "getShowComponentsMain",
  );

  const invitesButton = new ButtonBuilder()
    .setCustomId(BanPoolShowMainCustomId.GoInvites)
    .setLabel("Invites")
    .setStyle(ButtonStyle.Secondary)
    // Disable if not owner
    // Disable if there are no invites
    .setDisabled(!isOwner || inviteCount === 0);

  row.addComponents(settingsButton, membersButton, invitesButton);

  return [row];
}

type OptionDetails<T> = {
  label: string;
  description: string;
  value: T;
};

/**
 * Returns a function that converts an option details to a select menu option
 *
 * @param currentOption
 * @returns
 */
function optionDetailsToSelectMenuOption<T extends string>(
  o: OptionDetails<T>,
): StringSelectMenuOptionBuilder {
  return new StringSelectMenuOptionBuilder()
    .setLabel(o.label)
    .setDescription(o.description)
    .setValue(o.value);
}

function getAddModeOption(
  mode: AppPublicBanPoolAddMode,
): OptionDetails<AppPublicBanPoolAddMode> {
  switch (mode) {
    case "all_bans":
      return {
        label: "All bans",
        description: "Add all bans to the pool",
        value: mode,
      };
    case "manual":
      return {
        label: "Manual",
        description: "Add bans manually",
        value: mode,
      };
    case "nothing":
      return {
        label: "Nothing",
        description: "Do nothing",
        value: mode,
      };
    default:
      throw new Error(`Unknown add mode '${mode}'`);
  }
}

function getRemoveModeOption(
  mode: AppPublicBanPoolRemoveMode,
): OptionDetails<AppPublicBanPoolRemoveMode> {
  switch (mode) {
    case "all_unbans":
      return {
        label: "All unbans",
        description: "Remove all unbans from the pool",
        value: mode,
      };
    case "manual":
      return {
        label: "Manual",
        description: "Remove unbans manually",
        value: mode,
      };
    case "nothing":
      return {
        label: "Nothing",
        description: "Do nothing",
        value: mode,
      };
    default:
      throw new Error(`Unknown remove mode '${mode}'`);
  }
}

function getAddActionOption(
  mode: AppPublicBanPoolAddAction,
): OptionDetails<AppPublicBanPoolAddAction> {
  switch (mode) {
    case "ban":
      return {
        label: "Ban",
        description: "Ban the user",
        value: mode,
      };
    case "ask":
      return {
        label: "Ask",
        description: "Ask what to do",
        value: mode,
      };
    case "timeout_and_ask":
      return {
        label: "Timeout and ask",
        description: "Timeout user and ask what to do",
        value: mode,
      };
    case "nothing":
      return {
        label: "Nothing",
        description: "Do nothing",
        value: mode,
      };
    default:
      throw new Error(`Unknown add action '${mode}'`);
  }
}

function getRemoveActionOption(
  mode: AppPublicBanPoolRemoveAction,
): OptionDetails<AppPublicBanPoolRemoveAction> {
  switch (mode) {
    case "unban":
      return {
        label: "Unban",
        description: "Unban the user",
        value: mode,
      };
    case "ask":
      return {
        label: "Ask",
        description: "Ask what to do",
        value: mode,
      };
    case "nothing":
      return {
        label: "Nothing",
        description: "Do nothing",
        value: mode,
      };
    default:
      throw new Error(`Unknown remove action '${mode}'`);
  }
}

function getAddModeSelectMenuOptions(): StringSelectMenuOptionBuilder[] {
  const addModeOptions = addModeValues
    .map(getAddModeOption)
    .map(optionDetailsToSelectMenuOption);

  return addModeOptions;
}

function getRemoveModeSelectMenuOptions(): StringSelectMenuOptionBuilder[] {
  const removeModeOptions = removeModeValues
    .map(getRemoveModeOption)
    .map(optionDetailsToSelectMenuOption);

  return removeModeOptions;
}

function getAddActionSelectMenuOptions(): StringSelectMenuOptionBuilder[] {
  return addActionValues
    .map(getAddActionOption)
    .map(optionDetailsToSelectMenuOption);
}

function getRemoveActionSelectMenuOptions(): StringSelectMenuOptionBuilder[] {
  return removeActionValues
    .map(getRemoveActionOption)
    .map(optionDetailsToSelectMenuOption);
}

/**
 * Get the message components for the settings page
 *
 * @param pool pool to show settings for
 * @param poolMember pool member to show settings for, optional if owner
 * @returns components for settings modifications
 */
export function getSettingsComponents(
  pool: BanPoolRow,
  poolMember: BanPoolMemberRow | null,
): ActionRowBuilder<MessageActionRowComponentBuilder>[] {
  const menus = [];

  // Either no pool member (owner) or pool member with edit permissions
  const canEdit = poolMember === null || poolMember.permission === "edit";

  // const poolSettings = getTruePoolSettings(pool, poolMember);

  // Don't set values by default, otherwise placeholder isn't shown
  if (canEdit) {
    const addModeOptions = getAddModeSelectMenuOptions();
    const removeModeOptions = getRemoveModeSelectMenuOptions();

    const addModeMenu = new StringSelectMenuBuilder()
      .setPlaceholder("When a user is banned in this server...")
      .setCustomId(SettingsCustomId.AddMode)
      .setMaxValues(1)
      .setMinValues(1)
      .addOptions(addModeOptions);

    const removeModeMenu = new StringSelectMenuBuilder()
      .setPlaceholder("When a user is unbanned from this server...")
      .setCustomId(SettingsCustomId.RemoveMode)
      .setMaxValues(1)
      .setMinValues(1)
      .addOptions(removeModeOptions);

    menus.push(addModeMenu, removeModeMenu);
  }

  const addActionOptions = getAddActionSelectMenuOptions();
  const removeActionOptions = getRemoveActionSelectMenuOptions();

  // Always show these
  const addAction = new StringSelectMenuBuilder()
    .setPlaceholder("When a user is banned by a different server...")
    .setCustomId(SettingsCustomId.AddAction)
    .setMaxValues(1)
    .setMinValues(1)
    .addOptions(addActionOptions);

  const removeAction = new StringSelectMenuBuilder()
    .setPlaceholder("When a user is unbanned by another server...")
    .setCustomId(SettingsCustomId.RemoveAction)
    .setMaxValues(1)
    .setMinValues(1)
    .addOptions(removeActionOptions);

  menus.push(addAction, removeAction);

  const rows: ActionRowBuilder<MessageActionRowComponentBuilder>[] = menus.map(
    (menu) =>
      new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu),
  );

  // Add back button
  rows.push(getBackButtonRow());

  return rows;
}

export function getMembersComponents(): ActionRowBuilder<MessageActionRowComponentBuilder>[] {
  const rows: ActionRowBuilder<MessageActionRowComponentBuilder>[] = [];

  // Currently only back button
  rows.push(getBackButtonRow());

  return rows;
}

export function getInvitesComponents(): ActionRowBuilder<MessageActionRowComponentBuilder>[] {
  const rows: ActionRowBuilder<MessageActionRowComponentBuilder>[] = [];

  // Currently only back button
  rows.push(getBackButtonRow());

  return rows;
}

export function getExpiredComponents(): ActionRowBuilder<MessageActionRowComponentBuilder>[] {
  const rows: ActionRowBuilder<MessageActionRowComponentBuilder>[] = [];

  const button = new ButtonBuilder()
    .setLabel("Expired - re-run command")
    .setCustomId("disabled")
    .setDisabled(true);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

  // Currently only back button
  rows.push(row);

  return rows;
}
