import {
  SlashCommandBuilder,
  EmbedBuilder,
  ChatInputCommandInteraction,
  InteractionContextType,
} from "discord.js";
import { PermissionFlagsBits } from "discord.js";
import Context from "@/model/context";
import Color from "@/utils/colors";
import { SlashCommandHandler } from "@/interactions/handlers";
import { interactionReplyErrorPlainMessage } from "@/interactions/responses/error";
import canAddRole from "@/utils/canAddRole";
import {
  deleteLevelRole,
  getAllLevelRoles,
  upsertLevelRole,
} from "@/db/LevelRole/LevelRole.repository";
import db from "@/infrastructure/database/db";

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
    .setContexts(InteractionContextType.Guild)
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
      await interactionReplyErrorPlainMessage(interaction, canAddRes.val, true);

      return;
    }

    if (removeLevel && removeLevel <= addLevel) {
      await interactionReplyErrorPlainMessage(
        interaction,
        "remove_level must be higher than add_level",
        true,
      );

      return;
    }

    await upsertLevelRole(
      db,
      interaction.guildId,
      role.id,
      addLevel,
      removeLevel || undefined,
    );

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

    const deletedCount = await deleteLevelRole(
      db,
      interaction.guildId,
      role.id,
    );

    if (deletedCount.numDeletedRows === BigInt(0)) {
      await interactionReplyErrorPlainMessage(
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
    const allLevelRoles = await getAllLevelRoles(db, interaction.guildId);

    if (allLevelRoles.length === 0) {
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

    const levelRoles = allLevelRoles.map((node) => {
      let s = `<@&${node.role_id}>`;

      if (node.add_level) {
        s += ` at level ${node.add_level}`;
      }

      if (node.remove_level) {
        s += ` and removed at level ${node.remove_level}`;
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
