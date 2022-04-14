import {
  SlashCommandBuilder,
  Embed,
  SelectMenuOption,
  SelectMenuComponent,
  ActionRow,
} from "@discordjs/builders";
import { isGuildInteraction } from "discord-api-types/utils/v9";
import {
  APIChatInputApplicationCommandInteraction,
  APIMessage,
} from "discord-api-types/v9";
import { t } from "i18next";
import Context from "../../context";
import getInvokerUser from "../../utils/interactions";
import { SlashCommandHandler } from "../handlers";
import CommandInteractionOptionResolver from "../resolver";

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
    .addSubcommand((c) =>
      c
        .setName("new")
        .addStringOption((o) =>
          o
            .setName("title")
            .setDescription("The title of the role menu.")
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
            .setName("messageID")
            .setDescription("The message ID of the role menu to edit.")
            .setRequired(true)
        )
        .addStringOption((o) =>
          o
            .setName("title")
            .setDescription("The new title of the role menu.")
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
    .addSubcommandGroup((g) =>
      g
        .setName("role")
        .addSubcommand((c) =>
          c
            .setName("add")
            .setDescription("Add a role to the menu.")
            .addRoleOption((o) =>
              o
                .setName("role")
                .setDescription("The role to add.")
                .setRequired(true)
            )
            .addStringOption((o) =>
              o
                .setName("label")
                .setDescription(
                  "The label of the role (can be different from the role name)."
                )
                .setRequired(true)
            )
            .addStringOption((o) =>
              o
                .setName("description")
                .setDescription("The description of the role.")
                .setRequired(false)
            )
            .addStringOption((o) =>
              o
                .setName("emoji")
                .setDescription("The emoji of the role option.")
                .setRequired(false)
            )
        )
        .addSubcommand((c) =>
          c
            .setName("remove")
            .setDescription("Remove a role from the menu.")
            .addRoleOption((o) =>
              o
                .setName("role")
                .setDescription("The role to remove.")
                .setRequired(true)
            )
        )
    )
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandInteraction
  ): Promise<void> {
    if (!isGuildInteraction(interaction)) {
      throw new Error("This command can only be used in a guild.");
    }

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

      // role subgroup
      case "add":
        return this.roleAddHandler(ctx, interaction, options);
      case "remote":
        return this.roleRemoveHandler(ctx, interaction, options);
      default:
        throw new Error("Invalid subcommand.");
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private async newHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    const title = options.getString("title");
    if (!title) {
      throw new Error("No title provided.");
    }

    // Does not fetch message from Discord API, not needed
    const menu = await this.getActiveMenu(ctx, interaction);
    if (menu) {
      return ctx.REST.interactionReply(interaction, {
        content: t("rolemenu.new.already_active"),
      });
    }

    const description = options.getString("description");
    const maxRoles = options.getInteger("max_roles") || 25;

    const selectMenu = new SelectMenuComponent()
      .setCustomId("rolemenu:")
      .setMaxValues(maxRoles)
      .setOptions([
        new SelectMenuOption()
          .setLabel("Rule 1")
          .setValue("rule1")
          .setDescription("Rule to member"),
      ])
      .setPlaceholder("Reason");

    const row = new ActionRow().addComponents(selectMenu);

    const embed = new Embed()
      .setTitle(title)
      .setDescription(description || null);

    await ctx.REST.interactionReply(interaction, {
      embeds: [embed],
      components: [row],
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private async editHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    const title = options.getString("title");
    if (!title) {
      throw new Error("No title provided.");
    }

    const menuMsg = await this.getActiveMenuMessage(ctx, interaction);
    if (!menuMsg) {
      return ctx.REST.interactionReply(interaction, {
        content: t("rolemenu.edit.no_active_menu"),
      });
    }

    const description = options.getString("description");
    const maxRoles = options.getInteger("max_roles") || 25;

    const selectMenu = new SelectMenuComponent()
      .setCustomId("rolemenu:")
      .setMaxValues(maxRoles)
      .setOptions([
        new SelectMenuOption()
          .setLabel("Rule 1")
          .setValue("rule1")
          .setDescription("Rule to member"),
      ])
      .setPlaceholder("Reason");

    const row = new ActionRow().addComponents(selectMenu);

    const embed = new Embed()
      .setTitle(title)
      .setDescription(description || null);

    await ctx.REST.interactionReply(interaction, {
      embeds: [embed],
      components: [row],
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private async roleAddHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    const role = options.getRole("role");
    if (!role) {
      throw new Error("No role provided.");
    }

    const menuMsg = await this.getActiveMenuMessage(ctx, interaction);
    if (!menuMsg) {
      return ctx.REST.interactionReply(interaction, {
        content: t("rolemenu.edit.no_active_menu"),
      });
    }

    const label = options.getString("label");
    const description = options.getString("description");
    const emoji = options.getString("emoji");

    await ctx.REST.interactionReply(interaction, {
      content: "added role",
    });
  }

  // eslint-disable-next-line class-methods-use-this
  private async roleRemoveHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    const menuMsg = await this.getActiveMenuMessage(ctx, interaction);
    if (!menuMsg) {
      return ctx.REST.interactionReply(interaction, {
        content: t("rolemenu.edit.no_active_menu"),
      });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  private async getActiveMenu(
    ctx: Context,
    interaction: APIChatInputApplicationCommandInteraction
  ): Promise<RoleMenu | null> {
    const user = getInvokerUser(interaction);

    return ctx.sushiiAPI.getRoleMenuByUserID(user.id);
  }

  private async getActiveMenuMessage(
    ctx: Context,
    interaction: APIChatInputApplicationCommandInteraction
  ): Promise<APIMessage | null> {
    const roleMenu = this.getActiveMenu(ctx, interaction);
    if (!roleMenu) {
      return null;
    }

    return ctx.REST.getChannelMessage(menu.channelID, menu.messageID);
  }
}
