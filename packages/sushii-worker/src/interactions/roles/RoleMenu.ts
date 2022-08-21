import {
  SlashCommandBuilder,
  EmbedBuilder,
  SelectMenuOptionBuilder,
  SelectMenuBuilder,
  ActionRowBuilder,
  ButtonBuilder,
} from "@discordjs/builders";
import { isGuildInteraction } from "discord-api-types/utils/v10";
import {
  APIChatInputApplicationCommandGuildInteraction,
  ButtonStyle,
  PermissionFlagsBits,
} from "discord-api-types/v10";
import { t } from "i18next";
import { None, Option, Some } from "ts-results";
import { GetRoleMenuQuery, RedisGuildRole } from "../../generated/graphql";
import logger from "../../logger";
import Context from "../../model/context";
import Color from "../../utils/colors";
import { SlashCommandHandler } from "../handlers";
import CommandInteractionOptionResolver from "../resolver";
import { interactionReplyErrorMessage } from "../responses/error";
import { buildCustomID } from "./RoleMenuButtonHandler";

const RE_EMOJI = /(<a?)?:(w+):(d{17,20}>)/;
const RE_ROLE = /<@&(\d{17,20})>/g;

enum RoleMenuOption {
  Name = "menu_name",
  NewName = "new_menu_name",
  Description = "description",
  Roles = "roles",
  MaxRoles = "max_roles",
  RequiredRole = "required_role",
  Channel = "channel",
  Type = "type",
}

enum RoleMenuType {
  SelectMenu = "select_menu",
  Buttons = "buttons",
}

export default class RoleMenuCommand extends SlashCommandHandler {
  serverOnly = true;

  /**
   * /rolemenu new [title] (description) (max roles) (required_role)
   * /rolemenu edit [message id] (title) (description) (max roles) (required_role)
   * /rolemenu role add [role] (label) (description) (emoji)
   * /rolemenu role remove [role]
   */
  command = new SlashCommandBuilder()
    .setName("rolemenu")
    .setDescription("Create a role menu.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addSubcommand((c) =>
      c
        .setName("new")
        .setDescription("Create a new role menu.")
        .addStringOption((o) =>
          o
            .setName(RoleMenuOption.Name)
            .setDescription("The name of the role menu.")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption((o) =>
          o
            .setName(RoleMenuOption.Description)
            .setDescription("The content of the role menu.")
            .setRequired(false)
        )
        .addIntegerOption((o) =>
          o
            .setName(RoleMenuOption.MaxRoles)
            .setDescription("The maximum number of roles to allow.")
            .setRequired(false)
            .setMinValue(1)
            .setMaxValue(25)
        )
        .addRoleOption((o) =>
          o
            .setName(RoleMenuOption.RequiredRole)
            .setDescription("A role that the user must have to use this menu")
            .setRequired(false)
        )
    )
    .addSubcommand((c) =>
      c
        .setName("edit")
        .setDescription("Edit a role menu's options.")
        .addStringOption((o) =>
          o
            .setName(RoleMenuOption.Name)
            .setDescription("The name of the role menu to edit.")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption((o) =>
          o
            .setName(RoleMenuOption.NewName)
            .setDescription("The new name of the role menu.")
            .setRequired(false)
        )
        .addStringOption((o) =>
          o
            .setName(RoleMenuOption.Description)
            .setDescription("The new content of the role menu.")
            .setRequired(false)
        )
        .addIntegerOption((o) =>
          o
            .setName(RoleMenuOption.MaxRoles)
            .setDescription("The new maximum number of roles to allow.")
            .setRequired(false)
            .setMinValue(1)
            .setMaxValue(25)
        )
        .addRoleOption((o) =>
          o
            .setName(RoleMenuOption.RequiredRole)
            .setDescription("A role that the user must have to use this menu")
            .setRequired(false)
        )
    )
    .addSubcommand((c) =>
      c
        .setName("addroles")
        .setDescription("Add roles to a menu.")
        .addStringOption((o) =>
          o
            .setName(RoleMenuOption.Name)
            .setDescription("The name of the menu to add the roles to.")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption((o) =>
          o
            .setName(RoleMenuOption.Roles)
            .setDescription("The roles to add, you can add multiple at a time.")
            .setRequired(true)
        )
    )
    .addSubcommand((c) =>
      c
        .setName("removeroles")
        .setDescription("Remove roles from a menu.")
        .addStringOption((o) =>
          o
            .setName(RoleMenuOption.Name)
            .setDescription("The name of the menu to remove the roles from.")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption((o) =>
          o
            .setName(RoleMenuOption.Roles)
            .setDescription(
              "The roles to remove, you can add multiple at a time."
            )
            .setRequired(true)
        )
    )
    .addSubcommand((c) =>
      c
        .setName("delete")
        .setDescription("Delete a role menu.")
        .addStringOption((o) =>
          o
            .setName(RoleMenuOption.Name)
            .setDescription("The name of the menu to add the roles to.")
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand((c) =>
      c
        .setName("send")
        .setDescription("Send a role menu to a channel.")
        .addStringOption((o) =>
          o
            .setName(RoleMenuOption.Name)
            .setDescription("The name of the role menu.")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption((o) =>
          o
            .setName(RoleMenuOption.Type)
            .setDescription("The type of menu to send.")
            .setRequired(true)
            .setChoices(
              {
                name: "Select menu",
                value: RoleMenuType.SelectMenu,
              },
              {
                name: "Buttons",
                value: RoleMenuType.Buttons,
              }
            )
        )
        .addChannelOption((o) =>
          o
            .setName(RoleMenuOption.Channel)
            .setDescription(
              "The channel to send the role menu to, by default the current channel."
            )
            .setRequired(false)
        )
    )
    .toJSON();

  async handler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction
  ): Promise<void> {
    const options = new CommandInteractionOptionResolver(
      interaction.data.options,
      interaction.data.resolved
    );

    const subcommand = options.getSubcommand();
    switch (subcommand) {
      case "new":
        return this.newHandler(ctx, interaction, options);
      case "edit":
        return this.editHandler(ctx, interaction, options);
      case "addroles":
        return this.addRolesHandler(ctx, interaction, options);
      case "removeroles":
        return this.removeRolesHandler(ctx, interaction, options);
      case "delete":
        return this.deleteHandler(ctx, interaction, options);
      case "send":
        return this.sendHandler(ctx, interaction, options);
      default:
        throw new Error("Invalid subcommand.");
    }
  }

  private async newHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    if (!isGuildInteraction(interaction)) {
      throw new Error("This command can only be used in a server.");
    }

    const name = options.getString(RoleMenuOption.Name);
    if (!name) {
      throw new Error("No name provided.");
    }

    // -------------------------------------------------------------------------
    // Check if menu name already exists

    // Does not fetch message from Discord API, not needed
    const menu = await this.getMenu(ctx, interaction, name);
    if (menu.some) {
      await ctx.REST.interactionReply(interaction, {
        content: t("rolemenu.new.error.name_already_exists", { name }),
      });

      return;
    }

    // -------------------------------------------------------------------------
    // Create menu

    const description = options.getString(RoleMenuOption.Description);
    const maxRoles = options.getInteger(RoleMenuOption.MaxRoles);
    const requiredRole = options.getRole(RoleMenuOption.RequiredRole);

    // Save to DB
    await ctx.sushiiAPI.sdk.createRoleMenu({
      roleMenu: {
        guildId: interaction.guild_id,
        menuName: name,
        requiredRole: requiredRole?.id,
        description,
        maxCount: maxRoles,
      },
    });

    await ctx.REST.interactionReply(interaction, {
      embeds: [
        new EmbedBuilder()
          .setTitle("Created a new role menu")
          .setFields([
            {
              name: "Name",
              value: name,
            },
            {
              name: "Description",
              value: description || "No description set.",
            },
            {
              name: "Max Roles",
              value: maxRoles?.toString() || "No limit on max roles.",
            },
            {
              name: "Required",
              value: requiredRole ? `<&@${requiredRole}>` : "No required role.",
            },
          ])
          .setColor(Color.Success)
          .toJSON(),
      ],
    });
  }

  private async editHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    const menuName = options.getString(RoleMenuOption.Name);
    if (!menuName) {
      throw new Error("No name provided.");
    }

    const roleMenu = await this.getMenu(ctx, interaction, menuName);

    if (roleMenu.none) {
      await ctx.REST.interactionReply(interaction, {
        content: t("rolemenu.edit.menu_not_found"),
      });

      return;
    }

    const newName = options.getString(RoleMenuOption.NewName);
    if (newName) {
      const newMenuNameExists = await this.getMenu(ctx, interaction, menuName);

      if (newMenuNameExists.some) {
        await ctx.REST.interactionReply(interaction, {
          content: t("rolemenu.edit.menu_name_exists"),
        });

        return;
      }
    }

    const description = options.getString(RoleMenuOption.Description);
    const maxCount = options.getInteger(RoleMenuOption.MaxRoles);
    const requiredRole = options.getRole(RoleMenuOption.RequiredRole);

    // Save to DB
    await ctx.sushiiAPI.sdk.updateRoleMenu({
      guildId: interaction.guild_id,
      menuName,
      roleMenuPatch: {
        guildId: interaction.guild_id,
        menuName,
        requiredRole: requiredRole?.id,
        description,
        maxCount,
      },
    });

    await ctx.REST.interactionReply(interaction, {
      embeds: [
        new EmbedBuilder()
          .setTitle("Edited role menu")
          .setColor(Color.Success)
          .toJSON(),
      ],
    });
  }

  private async addRolesHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    const menuName = options.getString(RoleMenuOption.Name);
    if (!menuName) {
      throw new Error("No menu name provided.");
    }

    const roleMenu = await this.getMenu(ctx, interaction, menuName);
    if (roleMenu.none) {
      await ctx.REST.interactionReply(interaction, {
        content: t("rolemenu.edit.menu_not_found"),
      });

      return;
    }

    const roles = options.getString(RoleMenuOption.Roles);
    if (!roles) {
      throw new Error("No role provided.");
    }

    // First match to get the ID group
    const roleIds = [...roles.matchAll(RE_ROLE)].map((match) => match[1]);
    if (!roleIds) {
      await ctx.REST.interactionReply(interaction, {
        content: t("rolemenu.edit.no_roles_given"),
      });

      return;
    }

    // Add new roles to the menu
    let newRoleIds = roleMenu.safeUnwrap().roleIds || [];
    newRoleIds = newRoleIds.concat(roleIds);

    // Deduplicate -- sets are ordered so this should preserve order
    newRoleIds = [...new Set(newRoleIds)];

    if (newRoleIds.length > 25) {
      await ctx.REST.interactionReply(interaction, {
        content: t("rolemenu.edit.too_many_roles"),
      });

      return;
    }

    // Save to DB
    await ctx.sushiiAPI.sdk.updateRoleMenu({
      guildId: interaction.guild_id,
      menuName,
      roleMenuPatch: {
        guildId: interaction.guild_id,
        menuName,
        roleIds: newRoleIds,
      },
    });

    await ctx.REST.interactionReply(interaction, {
      embeds: [
        new EmbedBuilder()
          .setTitle("Added roles to role menu")
          .setFields([
            {
              name: "Added roles",
              value: roleIds.map((id) => `<@&${id}>`).join(" "),
            },
            {
              name: "New menu roles",
              value: newRoleIds.map((id) => `<@&${id}>`).join(" "),
            },
          ])
          .setColor(Color.Success)
          .toJSON(),
      ],
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private async removeRolesHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    const menuName = options.getString(RoleMenuOption.Name);
    if (!menuName) {
      throw new Error("No name provided.");
    }

    const roleMenu = await this.getMenu(ctx, interaction, menuName);
    if (roleMenu.none) {
      await ctx.REST.interactionReply(interaction, {
        content: t("rolemenu.edit.menu_not_found"),
      });

      return;
    }

    const roles = options.getString(RoleMenuOption.Roles);
    if (!roles) {
      throw new Error("No role provided.");
    }

    const roleIdsToRemove = [...roles.matchAll(RE_ROLE)].map(
      (match) => match[1]
    );
    if (!roleIdsToRemove) {
      await ctx.REST.interactionReply(interaction, {
        content: t("rolemenu.edit.no_roles_given"),
      });

      return;
    }

    // Remove roles from the menu
    const newRoleIds = roleMenu
      .safeUnwrap()
      .roleIds?.filter((id) => id && !roleIdsToRemove.includes(id));

    // Save to DB
    await ctx.sushiiAPI.sdk.updateRoleMenu({
      guildId: interaction.guild_id,
      menuName,
      roleMenuPatch: {
        guildId: interaction.guild_id,
        menuName,
        roleIds: newRoleIds,
      },
    });

    await ctx.REST.interactionReply(interaction, {
      embeds: [
        new EmbedBuilder()
          .setTitle("Delete roles from menu")
          .setFields([
            {
              name: "Removed roles",
              value: roleIdsToRemove.map((id) => `<@&${id}>`).join(" "),
            },
            {
              name: "New menu roles",
              value:
                newRoleIds?.map((id) => `<@&${id}>`).join(" ") ||
                "Menu has no roles",
            },
          ])
          .setColor(Color.Success)
          .toJSON(),
      ],
    });
  }

  private async deleteHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    const name = options.getString(RoleMenuOption.Name);
    if (!name) {
      throw new Error("No name provided.");
    }

    await ctx.sushiiAPI.sdk.deleteRoleMenu({
      guildId: interaction.guild_id,
      menuName: name,
    });

    await ctx.REST.interactionReply(interaction, {
      embeds: [
        new EmbedBuilder()
          .setTitle("Deleted role menu")
          .setColor(Color.Success)
          .toJSON(),
      ],
    });
  }

  private async sendHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    const name = options.getString(RoleMenuOption.Name);
    if (!name) {
      throw new Error("No name provided.");
    }

    const sendChannel = options.getChannel(RoleMenuOption.Channel);
    const sendChannelId = sendChannel?.id || interaction.channel_id;

    const type = options.getString(RoleMenuOption.Type);
    if (!type) {
      throw new Error("No type provided.");
    }

    // ------------------------------------------------------------
    // Get menu from db

    const roleMenu = await this.getMenu(ctx, interaction, name);
    if (roleMenu.none) {
      await ctx.REST.interactionReply(interaction, {
        content: t("rolemenu.edit.menu_not_found"),
      });

      return;
    }

    const roleMenuData = roleMenu.safeUnwrap();

    // ------------------------------------------------------------
    // Get guild role names
    const redisGuild = await ctx.sushiiAPI.sdk.getRedisGuild({
      guild_id: interaction.guild_id,
    });

    const guildRoles = redisGuild.redisGuildByGuildId?.roles;
    if (!guildRoles) {
      throw new Error("No roles found in guild.");
    }

    const guildRolesMap = guildRoles.reduce((map, role) => {
      if (role) {
        map.set(role.id, role);
      }

      return map;
    }, new Map<string, RedisGuildRole>());

    if (!roleMenuData.roleIds || roleMenuData.roleIds.length === 0) {
      await interactionReplyErrorMessage(
        ctx,
        interaction,
        t("rolemenu.send.error.menu_has_no_roles")
      );

      return;
    }

    if (
      roleMenuData.maxCount &&
      roleMenuData.roleIds.length < roleMenuData.maxCount
    ) {
      await interactionReplyErrorMessage(
        ctx,
        interaction,
        t("rolemenu.send.error.menu_has_less_roles_than_max")
      );

      return;
    }

    const roleIds = roleMenuData.roleIds.filter((id): id is string => !!id);

    const fields = [];
    if (roleMenuData.requiredRole) {
      fields.push({
        name: "Required role",
        value: `<@&${roleMenuData.requiredRole}>`,
      });
    }

    if (roleMenuData.maxCount) {
      fields.push({
        name: "Maximum roles you can pick",
        value: roleMenuData.maxCount.toString(),
      });
    }

    const embed = new EmbedBuilder()
      .setTitle(name)
      .setDescription(roleMenuData.description || null)
      .setFields(fields);

    // --------------------------------------------------------------
    // Build buttons
    const components = [];
    if (type === RoleMenuType.Buttons) {
      let row = new ActionRowBuilder<ButtonBuilder>();

      for (const roleId of roleIds) {
        const button = new ButtonBuilder()
          .setCustomId(buildCustomID(roleId))
          .setLabel(guildRolesMap.get(roleId)?.name || roleId)
          .setStyle(ButtonStyle.Secondary);

        // Row full, push to component rows list
        if (row.components.length === 5) {
          components.push(row.toJSON());

          // Create new row
          row = new ActionRowBuilder<ButtonBuilder>();
        }

        // Add component to row
        row = row.addComponents([button]);
      }

      // No more roles, check again if there are any remaining buttons
      if (row.components.length > 0) {
        components.push(row.toJSON());
      }
    }

    // --------------------------------------------------------------
    // Build select menu

    if (type === RoleMenuType.SelectMenu) {
      const selectOptions = [];

      for (const roleId of roleIds) {
        const option = new SelectMenuOptionBuilder()
          .setValue(buildCustomID(roleId))
          .setLabel(guildRolesMap.get(roleId)?.name || roleId);

        selectOptions.push(option);
      }

      const selectMenu = new SelectMenuBuilder()
        .setPlaceholder("Select a role")
        .setCustomId(`roleMenu:select:${name}`)
        .addOptions(selectOptions)
        .setMaxValues(roleMenuData.maxCount || 25);

      const row = new ActionRowBuilder<SelectMenuBuilder>()
        .addComponents([selectMenu])
        .toJSON();
      components.push(row);
    }

    const res = await ctx.REST.sendChannelMessage(sendChannelId, {
      embeds: [embed.toJSON()],
      components,
    });

    if (res.err) {
      logger.error(res.val, "Error sending role menu message");
      await ctx.REST.interactionReply(interaction, {
        content: t("rolemenu.edit.error.send_message"),
      });

      return;
    }

    await ctx.REST.interactionReply(interaction, {
      embeds: [
        new EmbedBuilder()
          .setTitle("Sent role menu")
          .setDescription(`<#${sendChannelId}>`)
          .setColor(Color.Success)
          .toJSON(),
      ],
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private async getMenu(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    menuName: string
  ): Promise<
    Option<NonNullable<GetRoleMenuQuery["roleMenuByGuildIdAndMenuName"]>>
  > {
    const menu = await ctx.sushiiAPI.sdk.getRoleMenu({
      guildId: interaction.guild_id,
      menuName,
    });

    if (!menu.roleMenuByGuildIdAndMenuName) {
      return None;
    }

    return Some(menu.roleMenuByGuildIdAndMenuName);
  }
}