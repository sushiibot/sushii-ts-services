import {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import { PermissionFlagsBits } from "discord-api-types/v10";
import Context from "../../model/context";
import Color from "../../utils/colors";
import { isNoValuesDeletedError } from "../../utils/graphqlError";
import { SlashCommandHandler } from "../handlers";
import { interactionReplyErrorPlainMessage } from "../responses/error";
import canAddRole from "../../utils/canAddRole";

enum CommandName {
  LevelRoleNew = "new",
  LevelRoleDelete = "delete",
  LevelRoleList = "list",
}

enum LevelRoleOption {
  Role = "role",
  AddLevel = "add_level",
  RemoveLevel = "remove_level",
  Channel = "channel",
}

export default class LevelRoleCommand extends SlashCommandHandler {
  serverOnly = true;

  command = new SlashCommandBuilder()
    .setName("levelrole")
    .setDescription("Configure level roles.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addSubcommand((c) =>
      c
        .setName(CommandName.LevelRoleNew)
        .setDescription("Create a new level role.")
        .addRoleOption((o) =>
          o
            .setName(LevelRoleOption.Role)
            .setDescription("The role to add.")
            .setRequired(true),
        )
        .addIntegerOption((o) =>
          o
            .setName(LevelRoleOption.AddLevel)
            .setDescription("The level to add the role at.")
            .setRequired(true)
            .setMinValue(2)
            .setMaxValue(500),
        )
        .addIntegerOption((o) =>
          o
            .setName(LevelRoleOption.RemoveLevel)
            .setDescription(
              "The level to remove the role at. This must be higher than add_level",
            )
            .setRequired(false)
            .setMinValue(3)
            .setMaxValue(500),
        ),
    )
    .addSubcommand((c) =>
      c
        .setName(CommandName.LevelRoleDelete)
        .setDescription("Delete a level role.")
        .addRoleOption((o) =>
          o
            .setName(LevelRoleOption.Role)
            .setDescription("The role to remove.")
            .setRequired(true),
        ),
    )
    .addSubcommand((c) =>
      c.setName(CommandName.LevelRoleList).setDescription("List level roles."),
    )
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: ChatInputCommandInteraction,
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Guild not cached");
    }

    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case CommandName.LevelRoleNew:
        return this.newLevelRoleHandler(ctx, interaction);
      case CommandName.LevelRoleDelete:
        return this.deleteLevelRoleHandler(ctx, interaction);
      case CommandName.LevelRoleList:
        return this.listLevelRoleHandler(ctx, interaction);
      default:
        throw new Error(`Invalid command ${subcommand}`);
    }
  }

  private async newLevelRoleHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const role = interaction.options.getRole(LevelRoleOption.Role, true);
    const addLevel = interaction.options.getInteger(
      LevelRoleOption.AddLevel,
      true,
    );
    const removeLevel = interaction.options.getInteger(
      LevelRoleOption.RemoveLevel,
    );

    const canAddRes = await canAddRole(interaction, role);
    if (canAddRes.err) {
      await interactionReplyErrorPlainMessage(
        ctx,
        interaction,
        canAddRes.val,
        true,
      );

      return;
    }

    if (removeLevel && removeLevel <= addLevel) {
      await interactionReplyErrorPlainMessage(
        ctx,
        interaction,
        "remove_level must be higher than add_level",
        true,
      );

      return;
    }

    await ctx.sushiiAPI.sdk.upsertLevelRole({
      guildId: interaction.guildId,
      roleId: role.id,
      addLevel: addLevel.toString(),
      removeLevel: removeLevel?.toString(),
    });

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Created a new level role")
          .setFields([
            {
              name: "Role",
              value: `<@&${role.id}>`,
            },
            {
              name: "Add level",
              value: addLevel.toString(),
            },
            {
              name: "Remove level",
              value:
                removeLevel?.toString() ??
                "Role will not be automatically removed",
            },
          ])
          .setColor(Color.Success)
          .toJSON(),
      ],
    });
  }

  private async deleteLevelRoleHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const role = interaction.options.getRole(LevelRoleOption.Role, true);

    try {
      await ctx.sushiiAPI.sdk.deleteLevelRole({
        guildId: interaction.guildId,
        roleId: role.id,
      });
    } catch (err) {
      if (!isNoValuesDeletedError(err)) {
        throw err;
      }

      await interactionReplyErrorPlainMessage(
        ctx,
        interaction,
        `No level role was found for <@&${role.id}>`,
        true,
      );

      return;
    }

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Deleted level role")
          .setFields([
            {
              name: "Role",
              value: `<@&${role.id}>`,
            },
          ])
          .setColor(Color.Success)
          .toJSON(),
      ],
    });
  }

  private async listLevelRoleHandler(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">,
  ): Promise<void> {
    const { allLevelRoles } = await ctx.sushiiAPI.sdk.getLevelRoles({
      guildId: interaction.guildId,
    });

    if (!allLevelRoles) {
      throw new Error("No level roles");
    }

    if (allLevelRoles.nodes.length === 0) {
      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle("All level roles")
            .setDescription("There are no level roles")
            .setColor(Color.Success)
            .toJSON(),
        ],
      });

      return;
    }

    const levelRoles = allLevelRoles.nodes.map((node) => {
      let s = `<@&${node.roleId}>`;

      if (node.addLevel) {
        s += ` at level ${node.addLevel}`;
      }

      if (node.removeLevel) {
        s += ` and removed at level ${node.removeLevel}`;
      }

      return s;
    });

    await interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("All level roles")
          .setDescription(levelRoles.join("\n"))
          .setColor(Color.Success)
          .toJSON(),
      ],
    });
  }
}
