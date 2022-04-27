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
  ComponentType,
} from "discord-api-types/v9";
import { t } from "i18next";
import Context from "../../context";
import { RoleMenuByChannelAndEditorIdQuery } from "../../generated/graphql";
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

  private async newHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    if (!isGuildInteraction(interaction)) {
      throw new Error("This command can only be used in a server.");
    }

    const invoker = getInvokerUser(interaction);

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
    const requiredRole = options.getRole("required_role");

    const customID = getRoleMenuID(requiredRole?.id);

    const selectMenu = new SelectMenuComponent()
      .setCustomId(customID)
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

    // Send additional message, not interaction response as we don't want the
    // extra slash command ui thing
    const message = await ctx.REST.sendChannelMessage(interaction.channel_id, {
      components: [row],
      embed,
    });

    // Save to DB
    await ctx.sushiiAPI.sdk.createRoleMenu({
      roleMenu: {
        channelId: interaction.channel_id,
        editorId: invoker.id,
        guildId: interaction.guild_id,
        messageId: message.id,
      },
    });

    await ctx.REST.interactionReply(interaction, {
      embeds: [embed],
      components: [row],
    });
  }

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

    let newOption = new SelectMenuOption().setLabel(label);

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

    selectMenu.options.push(newOption);

    // Edit role menu message
    await ctx.REST.editChannelMessage(menuMsg.channel_id, menuMsg.id, menuMsg);

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
  ): Promise<
    RoleMenuByChannelAndEditorIdQuery["roleMenuByChannelIdAndEditorId"]
  > {
    const user = getInvokerUser(interaction);

    const menu = await ctx.sushiiAPI.sdk.roleMenuByChannelAndEditorID({
      channelId: interaction.channel_id,
      editorId: user.id,
    });

    return menu.roleMenuByChannelIdAndEditorId;
  }

  private async getActiveMenuMessage(
    ctx: Context,
    interaction: APIChatInputApplicationCommandInteraction
  ): Promise<APIMessage | null> {
    const roleMenu = await this.getActiveMenu(ctx, interaction);
    if (!roleMenu) {
      return null;
    }

    return ctx.REST.getChannelMessage(roleMenu.channelId, roleMenu.messageId);
  }
}
