import { SlashCommandBuilder, EmbedBuilder } from "@discordjs/builders";
import { APIChatInputApplicationCommandGuildInteraction } from "discord-api-types/v10";
import Context from "../../model/context";
import Color from "../../utils/colors";
import { isNoValuesDeletedError } from "../../utils/graphqlError";
import { SlashCommandHandler } from "../handlers";
import CommandInteractionOptionResolver from "../resolver";
import { interactionReplyErrorPlainMessage } from "../responses/error";

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
    .addSubcommand((c) =>
      c
        .setName(CommandName.LevelRoleNew)
        .setDescription("Create a new level role.")
        .addRoleOption((o) =>
          o
            .setName(LevelRoleOption.Role)
            .setDescription("The role to add.")
            .setRequired(true)
        )
        .addIntegerOption((o) =>
          o
            .setName(LevelRoleOption.AddLevel)
            .setDescription("The level to add the role at.")
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(500)
        )
        .addIntegerOption((o) =>
          o
            .setName(LevelRoleOption.RemoveLevel)
            .setDescription(
              "The level to remove the role at. This must be higher than add_level"
            )
            .setRequired(false)
            .setMinValue(2)
            .setMaxValue(500)
        )
    )
    .addSubcommand((c) =>
      c
        .setName(CommandName.LevelRoleDelete)
        .setDescription("Delete a level role.")
        .addRoleOption((o) =>
          o
            .setName(LevelRoleOption.Role)
            .setDescription("The role to remove.")
            .setRequired(true)
        )
    )
    .addSubcommand((c) =>
      c.setName(CommandName.LevelRoleList).setDescription("List level roles.")
    )
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
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
      case CommandName.LevelRoleNew:
        return this.newLevelRoleHandler(ctx, interaction, options);
      case CommandName.LevelRoleDelete:
        return this.deleteLevelRoleHandler(ctx, interaction, options);
      case CommandName.LevelRoleList:
        return this.listLevelRoleHandler(ctx, interaction);
      default:
        throw new Error(`Invalid command ${subcommand}`);
    }
  }

  private async newLevelRoleHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    const role = options.getRole(LevelRoleOption.Role);
    const addLevel = options.getInteger(LevelRoleOption.AddLevel);
    const removeLevel = options.getInteger(LevelRoleOption.RemoveLevel);

    if (!role) {
      throw new Error("Missing role");
    }

    // Add level is required but remove is not
    if (!addLevel) {
      throw new Error("Missing add_level");
    }

    if (removeLevel && removeLevel <= addLevel) {
      await interactionReplyErrorPlainMessage(
        ctx,
        interaction,
        "remove_level must be higher than add_level",
        true
      );
    }

    await ctx.sushiiAPI.sdk.upsertLevelRole({
      guildId: interaction.guild_id,
      roleId: role.id,
      addLevel: addLevel.toString(),
      removeLevel: removeLevel?.toString(),
    });

    await ctx.REST.interactionReply(interaction, {
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
    interaction: APIChatInputApplicationCommandGuildInteraction,
    options: CommandInteractionOptionResolver
  ): Promise<void> {
    const role = options.getRole(LevelRoleOption.Role);
    if (!role) {
      throw new Error("Missing role");
    }

    try {
      await ctx.sushiiAPI.sdk.deleteLevelRole({
        guildId: interaction.guild_id,
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
        true
      );

      return;
    }

    await ctx.REST.interactionReply(interaction, {
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
    interaction: APIChatInputApplicationCommandGuildInteraction
  ): Promise<void> {
    const { allLevelRoles } = await ctx.sushiiAPI.sdk.getLevelRoles({
      guildId: interaction.guild_id,
    });

    if (!allLevelRoles) {
      throw new Error("No level roles");
    }

    if (allLevelRoles.nodes.length === 0) {
      await ctx.REST.interactionReply(interaction, {
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

    await ctx.REST.interactionReply(interaction, {
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
