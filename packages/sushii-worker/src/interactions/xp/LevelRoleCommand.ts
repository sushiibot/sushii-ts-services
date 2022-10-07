import { SlashCommandBuilder, EmbedBuilder } from "@discordjs/builders";
import {
  APIChatInputApplicationCommandGuildInteraction,
  GatewayOpcodes,
  GatewayRequestGuildMembers,
  PermissionFlagsBits,
} from "discord-api-types/v10";
import dayjs from "dayjs";
import Context from "../../model/context";
import Color from "../../utils/colors";
import getMemberPermissions from "../../utils/getMemberPermissions";
import { isNoValuesDeletedError } from "../../utils/graphqlError";
import { SlashCommandHandler } from "../handlers";
import CommandInteractionOptionResolver from "../resolver";
import { interactionReplyErrorPlainMessage } from "../responses/error";
import canAddRole from "../../utils/canAddRole";
import customIds from "../customIds";
import { getHighestMemberRole } from "../../utils/hasPermission";

enum CommandName {
  LevelRoleNew = "new",
  LevelRoleDelete = "delete",
  LevelRoleList = "list",
  LevelRoleApply = "apply",
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
            .setRequired(true)
        )
        .addIntegerOption((o) =>
          o
            .setName(LevelRoleOption.AddLevel)
            .setDescription("The level to add the role at.")
            .setRequired(true)
            .setMinValue(2)
            .setMaxValue(500)
        )
        .addIntegerOption((o) =>
          o
            .setName(LevelRoleOption.RemoveLevel)
            .setDescription(
              "The level to remove the role at. This must be higher than add_level"
            )
            .setRequired(false)
            .setMinValue(3)
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
    .addSubcommand((c) =>
      c
        .setName(CommandName.LevelRoleApply)
        .setDescription("Apply level roles to all members that are eligible.")
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
      case CommandName.LevelRoleApply:
        return this.applyLevelRoleHandler(ctx, interaction);
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

    const canAddRes = await canAddRole(ctx, interaction.guild_id, role);
    if (canAddRes.err) {
      await interactionReplyErrorPlainMessage(
        ctx,
        interaction,
        canAddRes.val,
        true
      );

      return;
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

      return;
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

  private async applyLevelRoleHandler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandGuildInteraction
  ): Promise<void> {
    const { allLevelRoles } = await ctx.sushiiAPI.sdk.getLevelRoles({
      guildId: interaction.guild_id,
    });

    if (!allLevelRoles || allLevelRoles.nodes.length === 0) {
      await interactionReplyErrorPlainMessage(
        ctx,
        interaction,
        "There are no level roles to apply, please add some first!",
        true
      );

      return;
    }

    // Ensure permissions and role levels are below sushii's role
    const guild = await ctx.sushiiAPI.sdk.getRedisGuild({
      guild_id: interaction.guild_id,
    });

    if (!guild.redisGuildByGuildId) {
      // Not a user error
      throw new Error("Redis guild not found");
    }

    const guildData = guild.redisGuildByGuildId;
    const guildRolesMap = new Map(guildData.roles.map((r) => [r.id, r]));

    // Get sushii member
    const currentUser = await ctx.getCurrentUser();
    const sushiiMember = await ctx.REST.getMember(
      interaction.guild_id,
      currentUser.id
    );

    if (sushiiMember.err) {
      throw new Error("Failed to get sushii member");
    }

    const sushiiMemberData = sushiiMember.safeUnwrap();
    const sushiiPerms = getMemberPermissions(
      currentUser.id,
      sushiiMemberData,
      guild.redisGuildByGuildId
    );

    if (!sushiiPerms.has(PermissionFlagsBits.ManageRoles)) {
      await interactionReplyErrorPlainMessage(
        ctx,
        interaction,
        "I'm missing the `Manage Roles` permission needed to apply level roles! Please add it to me then try this again.",
        true
      );

      return;
    }

    const highestSushiiRole = getHighestMemberRole(
      sushiiMemberData,
      guild.redisGuildByGuildId
    );

    if (!highestSushiiRole) {
      throw new Error("No highest sushii role");
    }

    const levelRolesWithPosition = allLevelRoles.nodes.map((role) => ({
      position: guildRolesMap.get(role.roleId)?.position ?? 0,
      ...role,
    }));

    const higherRoles = levelRolesWithPosition.filter(
      (r) => r.position >= highestSushiiRole.position
    );

    if (higherRoles.length > 0) {
      const rolesStr = higherRoles.map((r) => `<@&${r.roleId}>`).join(", ");

      await interactionReplyErrorPlainMessage(
        ctx,
        interaction,
        `Some level roles are above my highest role, please move them below my highest role and try again: ${rolesStr}`,
        true
      );

      return;
    }

    // Check if there's already a job running
    const job = await ctx.sushiiAPI.sdk.getLevelRoleApplyJobByGuildId({
      guildId: interaction.guild_id,
    });

    if (job.levelRoleApplyJobByGuildId) {
      const updatedAt = dayjs.utc(job.levelRoleApplyJobByGuildId.updatedAt);

      // Job was updated within the past 10 minutes
      if (updatedAt.isAfter(dayjs.utc().subtract(10, "minute"))) {
        await interactionReplyErrorPlainMessage(
          ctx,
          interaction,
          "I'm already applying level roles, please wait for it to finish. Check the status here and I'll ping you when it's done!"
        );

        return;
      }

      // If job was updated > 10 minutes ago, assume it's stuck and delete it
    }

    // 1. Fetch all eligible users from DB
    const eligibleLevelRoles = await ctx.sushiiAPI.sdk.getEligibleLevelRoles({
      guildId: interaction.guild_id,
    });

    // No eligible users, e.g. everyone's level is below all level roles
    if (
      !eligibleLevelRoles.getEligibleLevelRoles ||
      eligibleLevelRoles.getEligibleLevelRoles?.nodes.length === 0
    ) {
      await ctx.REST.interactionReply(interaction, {
        embeds: [
          new EmbedBuilder()
            .setTitle("Apply level roles")
            .setDescription(
              "There are no eligible users to apply level roles for"
            )
            .setColor(Color.Success)
            .toJSON(),
        ],
      });

      return;
    }

    const msg = await ctx.REST.sendChannelMessage(interaction.channel_id, {
      embeds: [
        new EmbedBuilder()
          .setTitle("Apply level roles")
          .setDescription(
            `Ensuring ${eligibleLevelRoles.getEligibleLevelRoles.nodes.length} members have the correct level roles.`
          )
          .setColor(Color.Success)
          .toJSON(),
      ],
    });

    const chunkSize = 100;

    const userIDs = eligibleLevelRoles.getEligibleLevelRoles.nodes
      .map((node) => node.userId)
      .filter((id): id is string => !!id);

    // Save guild_id request/interaction ID to DB to be handled asynchronously
    await ctx.sushiiAPI.sdk.createLevelRoleApplyJob({
      guildId: interaction.guild_id,
      interactionId: interaction.id,
      // Who to ping after job is done
      notifyUserId: interaction.member.user.id,
      channelId: interaction.channel_id,
      // Unwrap since if the message fails to send then idk
      // This will be used to edit a message every time a chunk is processed
      messageId: msg.unwrap().id,
      membersTotal: userIDs.length.toString(),
      // Multiple GuildMemberRequests, so the chunk_count in the event itself
      // is not useful. Instead, we use our own chunk count and assume each
      // request only results in 1 member chunk event (<= 100 members each).
      requestsTotal: Math.ceil(userIDs.length / chunkSize).toString(),
    });

    // 2. Request users from Discord, paginate every 100 users
    // https://discord.com/developers/docs/topics/gateway-events#request-guild-members
    // pass array of 100 user_ids

    const promises = [];
    for (let i = 0; i < userIDs.length; i += chunkSize) {
      const chunk = userIDs.slice(i, i + chunkSize);

      const request: GatewayRequestGuildMembers = {
        op: GatewayOpcodes.RequestGuildMembers,
        d: {
          guild_id: interaction.guild_id,
          limit: 0,
          presences: false,
          user_ids: chunk,
          nonce: customIds.levelRoleApplyMemberRequest.compile({
            guildId: interaction.guild_id,
          }),
        },
      };

      promises.push(ctx.gateway.send(request));
    }

    await Promise.all(promises);

    // Guild chunk events are handled in EventHandler, not here

    // 3. Send processing message with number of members
    // E.g. Checking and applying level roles to 100 members.
    await ctx.REST.interactionReply(interaction, {
      embeds: [
        new EmbedBuilder()
          .setTitle("Starting!")
          .setDescription(
            `Adding level roles to ${userIDs.length} members... This will take some time so I will ping you when it's complete!`
          )
          .setColor(Color.Success)
          .toJSON(),
      ],
    });
  }
}
