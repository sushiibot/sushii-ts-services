import {
  SlashCommandBuilder,
  EmbedBuilder,
  SelectMenuOptionBuilder,
  SelectMenuBuilder,
  ActionRowBuilder,
} from "@discordjs/builders";
import { isGuildInteraction } from "discord-api-types/utils/v10";
import {
  APIChatInputApplicationCommandGuildInteraction,
  APIChatInputApplicationCommandInteraction,
  APIMessage,
  ComponentType,
  MessageFlags,
  PermissionFlagsBits,
} from "discord-api-types/v10";
import { t } from "i18next";
import Context from "../../model/context";
import getInvokerUser from "../../utils/interactions";
import { SlashCommandHandler } from "../handlers";
import CommandInteractionOptionResolver from "../resolver";
import { getRoleMenuID } from "./ids";

const RE_EMOJI = /(<a?)?:(w+):(d{18}>)/;

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
        .addStringOption((o) =>
          o
            .setName("menu_name")
            .setDescription("The name of the role menu.")
            .setRequired(true)
        )
        .addStringOption((o) =>
          o
            .setName("description")
            .setDescription("The content of the role menu.")
            .setRequired(false)
        )
        .addIntegerOption((o) =>
          o
            .setName("max_roles")
            .setDescription("The maximum number of roles to allow.")
            .setRequired(false)
            .setMinValue(1)
            .setMaxValue(25)
        )
        .addRoleOption((o) =>
          o
            .setName("required_role")
            .setDescription("A role that the user must have to use this menu")
            .setRequired(false)
        )
    )
    .addSubcommand((c) =>
      c
        .setName("edit")
        .addStringOption((o) =>
          o
            .setName("menu_name")
            .setDescription("The name of the role menu to edit.")
            .setRequired(true)
        )
        .addStringOption((o) =>
          o
            .setName("new_menu_name")
            .setDescription("The new name of the role menu.")
            .setRequired(false)
        )
        .addStringOption((o) =>
          o
            .setName("description")
            .setDescription("The new content of the role menu.")
            .setRequired(false)
        )
        .addIntegerOption((o) =>
          o
            .setName("max_roles")
            .setDescription("The new maximum number of roles to allow.")
            .setRequired(false)
            .setMinValue(1)
            .setMaxValue(25)
        )
        .addRoleOption((o) =>
          o
            .setName("required_role")
            .setDescription("A role that the user must have to use this menu")
            .setRequired(false)
        )
    )
    .addSubcommand((c) =>
      c
        .setName("addroles")
        .setDescription("Add a role to the menu.")
        .addStringOption((o) =>
          o
            .setName("menu_name")
            .setDescription("The name of the menu to add the roles to.")
            .setRequired(true)
        )
        .addStringOption((o) =>
          o
            .setName("roles")
            .setDescription("The roles to add.")
            .setRequired(true)
        )
    )
    .addSubcommand((c) =>
      c
        .setName("removeroles")
        .setDescription("Remove a role from the menu.")
        .addStringOption((o) =>
          o
            .setName("menu_name")
            .setDescription("The name of the menu to remove the roles from.")
            .setRequired(true)
        )
        .addStringOption((o) =>
          o
            .setName("roles")
            .setDescription("The roles to remove.")
            .setRequired(true)
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
      default:
        throw new Error("Invalid subcommand.");
    }
  }

  private async newHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    if (!isGuildInteraction(interaction)) {
      throw new Error("This command can only be used in a server.");
    }

    const name = options.getString("name");
    if (!name) {
      throw new Error("No name provided.");
    }

    // -------------------------------------------------------------------------
    // Check if menu name already exists

    // Does not fetch message from Discord API, not needed
    const menu = await ctx.sushiiAPI.sdk.getRoleMenu({
      guildId: interaction.guild_id,
      menuName: name,
    });

    if (menu) {
      return ctx.REST.interactionReply(interaction, {
        content: t("rolemenu.new.error.name_already_exists", { name }),
      });
    }

    // -------------------------------------------------------------------------
    // Create menu

    const description = options.getString("description");
    const maxRoles = options.getInteger("max_roles");
    const requiredRole = options.getRole("required_role");

    const customID = getRoleMenuID(requiredRole?.id);

    let embed = new EmbedBuilder()
      .setTitle(name)
      .setDescription(description || null);

    if (maxRoles) {
      embed = embed.addFields([
        {
          name: "Max roles",
          value: maxRoles.toString(),
        },
      ]);
    }

    if (requiredRole) {
      embed = embed.addFields([
        {
          name: "required roles",
          value: `<@&${requiredRole.id}>`,
        },
      ]);
    }

    // Send additional message, not interaction response as we don't want the
    // extra slash command ui thing
    const message = await ctx.REST.sendChannelMessage(interaction.channel_id, {
      embeds: [embed.toJSON()],
    });

    // Save to DB
    await ctx.sushiiAPI.sdk.createRoleMenu({
      roleMenu: {
        channelId: interaction.channel_id,
        guildId: interaction.guild_id,
        messageId: message.id,
        menuName: name,
        description,
        maxCount: maxRoles,
      },
    });

    await ctx.REST.interactionReply(interaction, {
      content: t("rolemenu.new.created"),
      flags: MessageFlags.Ephemeral,
    });
  }

  private async editHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    const menuName = options.getString("menu_name");
    if (!menuName) {
      throw new Error("No name provided.");
    }

    const menuMsg = await ctx.sushiiAPI.sdk.getRoleMenu({
      guildId: interaction.guild_id,
      menuName,
    });

    if (!menuMsg) {
      return ctx.REST.interactionReply(interaction, {
        content: t("rolemenu.edit.no_active_menu"),
      });
    }

    const description = options.getString("description");
    const maxRoles = options.getInteger("max_roles") || 25;

    const selectMenu = new SelectMenuBuilder()
      .setCustomId("rolemenu:")
      .setMaxValues(maxRoles)
      .setOptions([
        new SelectMenuOptionBuilder()
          .setLabel("Rule 1")
          .setValue("rule1")
          .setDescription("Rule to member"),
      ])
      .setPlaceholder("Reason");

    const row = new ActionRowBuilder<SelectMenuBuilder>().setComponents([
      selectMenu,
    ]);

    const embed = new EmbedBuilder()
      .setTitle(menuName)
      .setDescription(description || null);

    await ctx.REST.interactionReply(interaction, {
      components: [row.toJSON()],
      embeds: [embed.toJSON()],
    });
  }

  private async addRolesHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    const menuName = options.getString("menu_name");
    if (!menuName) {
      throw new Error("No menu name provided.");
    }

    const roles = options.getString("roles");
    if (!roles) {
      throw new Error("No role provided.");
    }

    const menuMsg = await this.getMenuMessage(ctx, interaction, menuName);
    if (!menuMsg) {
      return ctx.REST.interactionReply(interaction, {
        content: t("rolemenu.edit.no_active_menu"),
      });
    }

    if (menuMsg.components === undefined) {
      throw new Error("No components found in message.");
    }

    const selectMenuRow = menuMsg.components[0];
    const selectMenu = selectMenuRow.components[0];
    if (selectMenu.type !== ComponentType.SelectMenu) {
      throw new Error("No select menu found in message.");
    }

    // Required
    const label = options.getString("label");
    if (!label) {
      throw new Error("No label provided.");
    }

    // Optional
    const description = options.getString("description");
    const emojiString = options.getString("emoji");

    let newOption = new SelectMenuOptionBuilder().setLabel(label);

    if (description) {
      newOption = newOption.setDescription(description);
    }

    if (emojiString) {
      const match = RE_EMOJI.exec(emojiString);
      if (!match) {
        throw new Error("Invalid emoji.");
      }

      const animated = match.at(1);
      const name = match.at(2);
      const id = match.at(3);

      newOption = newOption.setEmoji({
        id,
        name,
        animated: !!animated,
      });
    }

    selectMenu.options.push(newOption.toJSON());

    // Edit role menu message
    await ctx.REST.editChannelMessage(menuMsg.channel_id, menuMsg.id, menuMsg);

    await ctx.REST.interactionReply(interaction, {
      content: "added role",
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private async removeRolesHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    const name = options.getString("name");
    if (!name) {
      throw new Error("No name provided.");
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private async getMenuMessage(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    menuName: string
  ): Promise<APIMessage | null> {
    const menu = await ctx.sushiiAPI.sdk.getRoleMenu({
      guildId: interaction.guild_id,
      menuName,
    });

    if (!menu.roleMenuByGuildIdAndMenuName) {
      return null;
    }

    const msg = await ctx.REST.getChannelMessage(
      menu.roleMenuByGuildIdAndMenuName.channelId,
      menu.roleMenuByGuildIdAndMenuName.messageId
    );

    return msg;
  }
}
