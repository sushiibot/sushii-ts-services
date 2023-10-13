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

enum BanPoolCustomId {
  Settings = "settings",
  Members = "members",
  Invites = "invites",
}

/**
 *
 * @param pool
 * @returns
 */
export function getShowComponentsMain(
  poolMember: BanPoolMemberRow | null,
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
    .setCustomId(BanPoolCustomId.Settings)
    .setLabel("Settings")
    .setStyle(ButtonStyle.Primary);

  const membersButton = new ButtonBuilder()
    .setCustomId(BanPoolCustomId.Members)
    .setLabel("Members")
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(poolMemberCount === 0);

  // If there is no pool member, then we're the owner
  const isOwner = poolMember === undefined;

  const invitesButton = new ButtonBuilder()
    .setCustomId(BanPoolCustomId.Invites)
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

function getAddModeSelectMenuOptions(
  currentOption: AppPublicBanPoolAddMode,
): StringSelectMenuOptionBuilder[] {
  const addModeOptions = addModeValues.map(getAddModeOption).map((o) =>
    new StringSelectMenuOptionBuilder()
      .setLabel(o.label)
      .setDescription(o.description)
      .setValue(o.value)
      .setDefault(o.value === currentOption),
  );

  return addModeOptions;
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

function getRemoveModeSelectMenuOptions(
  currentOption: AppPublicBanPoolRemoveMode,
): StringSelectMenuOptionBuilder[] {
  const removeModeOptions = removeModeValues.map(getRemoveModeOption).map((o) =>
    new StringSelectMenuOptionBuilder()
      .setLabel(o.label)
      .setDescription(o.description)
      .setValue(o.value)
      .setDefault(o.value === currentOption),
  );

  return removeModeOptions;
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

function getAddActionSelectMenuOptions(
  currentOption: AppPublicBanPoolAddAction,
): StringSelectMenuOptionBuilder[] {
  return addActionValues.map(getAddActionOption).map((o) =>
    new StringSelectMenuOptionBuilder()
      .setLabel(o.label)
      .setDescription(o.description)
      .setValue(o.value)
      .setDefault(o.value === currentOption),
  );
}

function getRemoveActionSelectMenuOptions(
  currentOption: AppPublicBanPoolRemoveAction,
): StringSelectMenuOptionBuilder[] {
  return removeActionValues.map(getRemoveActionOption).map((o) =>
    new StringSelectMenuOptionBuilder()
      .setLabel(o.label)
      .setDescription(o.description)
      .setValue(o.value)
      .setDefault(o.value === currentOption),
  );
}

function getCurrentPoolSettings(
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

  const poolSettings = getCurrentPoolSettings(pool, poolMember);

  if (canEdit) {
    const addModeOptions = getAddModeSelectMenuOptions(poolSettings.addMode);
    const removeModeOptions = getRemoveModeSelectMenuOptions(
      poolSettings.removeMode,
    );

    const addModeMenu = new StringSelectMenuBuilder()
      .setPlaceholder("Change add mode")
      .setMaxValues(1)
      .setMinValues(1)
      .addOptions(addModeOptions);

    const removeModeMenu = new StringSelectMenuBuilder()
      .setPlaceholder("Change remove mode")
      .setMaxValues(1)
      .setMinValues(1)
      .addOptions(removeModeOptions);

    menus.push(addModeMenu, removeModeMenu);
  }

  const addActionOptions = getAddActionSelectMenuOptions(
    poolSettings.addAction,
  );
  const removeActionOptions = getRemoveActionSelectMenuOptions(
    poolSettings.removeAction,
  );

  // Always show these
  const addAction = new StringSelectMenuBuilder()
    .setPlaceholder("Change add action")
    .setMaxValues(1)
    .setMinValues(1)
    .addOptions(addActionOptions);

  const removeAction = new StringSelectMenuBuilder()
    .setPlaceholder("Change remove action")
    .setMaxValues(1)
    .setMinValues(1)
    .addOptions(removeActionOptions);

  menus.push(addAction, removeAction);

  return menus.map((menu) =>
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu),
  );
}
