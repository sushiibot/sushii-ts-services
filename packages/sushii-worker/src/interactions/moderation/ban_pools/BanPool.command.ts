import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  PermissionsBitField,
  EmbedBuilder,
} from "discord.js";
import dayjs from "dayjs";
import Context from "../../../model/context";
import { SlashCommandHandler } from "../../handlers";
import Color from "../../../utils/colors";
import toTimestamp from "../../../utils/toTimestamp";
import {
  createPool,
  deletePool,
  joinPool,
  showPool,
} from "./BanPool.service";
import {
BanPoolError
} from "./errors"
import { buildPoolSettingsString } from "./settings";
import { checkAndDeleteInvite, clearBanPoolInvites, createInvite } from "./BanPoolInvite.service";
import { getAllGuildBanPools } from "./BanPool.repository";
import { getAllBanPoolMemberships } from "./BanPoolMember.repository";
import { getAllBanPoolInvites } from "./BanPoolInvite.repository";
import db from "../../../model/db";

export enum BanPoolOptionCommand {
  Create = "create",
  List = "list",
  Show = "show",
  Delete = "delete",
  Invite = "invite",
  DeleteInvite = "delete-invite",
  ClearInvites = "clear-invites",
  Join = "join",
  ServerKick = "kick-server",
  // Grant permissions to a specific server, using their server ID
  ServerPermissions = "server-permissions",
}

export enum BanPoolOption {
  PoolName = "pool-name",
  Description = "description",
  InviteCode = "invite-code",
  ExpireAfter = "expire-after",
  MaxUses = "max-uses",
}

export default class BanPoolCommand extends SlashCommandHandler {
  serverOnly = true;

  requiredBotPermissions = new PermissionsBitField();

  command = new SlashCommandBuilder()
    .setName("banpool")
    .setDescription(
      "Manage ban pool settings, sync bans or share ban reasons."
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addSubcommand((c) =>
      c
        .setName(BanPoolOptionCommand.Create)
        .setDescription("Create a new ban pool.")
        .addStringOption((o) =>
          o
            .setName(BanPoolOption.PoolName)
            .setDescription("Name of the ban pool.")
            .setRequired(true)
        )
        .addStringOption((o) =>
          o
            .setName(BanPoolOption.Description)
            .setDescription("Description of the ban pool.")
            .setRequired(false)
        )
    )
    .addSubcommand((c) =>
      c
        .setName(BanPoolOptionCommand.Join)
        .setDescription("Join another server's ban pool.")
        .addStringOption((o) =>
          o
            .setName(BanPoolOption.InviteCode)
            .setDescription("Invite code for ban pool.")
            .setRequired(true)
        )
    )
    .addSubcommand((c) =>
      c
        .setName(BanPoolOptionCommand.List)
        .setDescription(
          "List ban pools your server created or is member of."
        )
    )
    .addSubcommand((c) =>
      c
        .setName(BanPoolOptionCommand.Show)
        .setDescription("Show details of a specific ban pool.")
        .addStringOption((o) =>
          o
            .setName(BanPoolOption.PoolName)
            .setDescription("Name or ID of the ban pool.")
            .setAutocomplete(true)
            .setRequired(true)
        )
    )
    .addSubcommand((c) =>
      c
        .setName(BanPoolOptionCommand.Delete)
        .setDescription("Delete a ban pool.")
        .addStringOption((o) =>
          o
            .setName(BanPoolOption.PoolName)
            .setDescription("Name of the ban pool to delete.")
            .setAutocomplete(true)
            .setRequired(true)
        )
    )
    .addSubcommand((c) =>
      c
        .setName(BanPoolOptionCommand.Invite)
        .setDescription(
          "Create an invite for a ban pool, for other servers to join."
        )
        .addStringOption((o) =>
          o
            .setName(BanPoolOption.PoolName)
            .setDescription("Name of the ban pool to create an invite for.")
            .setAutocomplete(true)
            .setRequired(true)
        )
        .addStringOption((o) =>
          o
            .setName(BanPoolOption.ExpireAfter)
            .setDescription("How long should this invite be valid for?")
            .setRequired(true)
            .setChoices(
              {
                name: "1 day",
                value: "86400",
              },
              {
                name: "1 week",
                value: (86400 * 7).toString(),
              },
              {
                name: "never",
                value: "never",
              }
            )
        )
        .addIntegerOption(o => 
          o.setName(BanPoolOption.MaxUses)
          .setDescription("How many times can this invite be used? (Default: Unlimited)")
          .setRequired(false)
        )
    )
    .addSubcommand((c) =>
      c
        .setName(BanPoolOptionCommand.DeleteInvite)
        .setDescription("Delete an invite for a ban pool.")
        .addStringOption((o) =>
          o
            .setName(BanPoolOption.PoolName)
            .setDescription("Name of the ban pool to delete an invite for.")
            .setAutocomplete(true)
            .setRequired(true)
        )
        .addStringOption((o) =>
          o
            .setName(BanPoolOption.InviteCode)
            .setDescription("Invite code for ban pool.")
            .setAutocomplete(true)
            .setRequired(true)
        )
    )
    .addSubcommand((c) =>
      c.setName(BanPoolOptionCommand.ClearInvites).setDescription(
        "Delete all invites for a ban pool."
      )
      .addStringOption((o) =>
      o
        .setName(BanPoolOption.PoolName)
        .setDescription("Name of the ban pool to delete an invite for.")
        .setAutocomplete(true)
        .setRequired(true)
    )
    )
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: ChatInputCommandInteraction
  ): Promise<void> {
    if (!interaction.inCachedGuild()) {
      throw new Error("Guild not cached");
    }

    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case BanPoolOptionCommand.Create:
        await this.handleCreate(ctx, interaction);
        break;
      case BanPoolOptionCommand.Join:
        await this.handleJoin(ctx, interaction);
        break;
      case BanPoolOptionCommand.List:
        await this.handleList(ctx, interaction);
        break;
      case BanPoolOptionCommand.Show:
        await this.handleShow(ctx, interaction);
        break;
      case BanPoolOptionCommand.Delete:
        await this.handleDelete(ctx, interaction);
        break;
      case BanPoolOptionCommand.Invite:
        await this.handleInvite(ctx, interaction);
        break;
      case BanPoolOptionCommand.DeleteInvite:
        await this.handleDeleteInvite(ctx, interaction);
        break;
      case BanPoolOptionCommand.ClearInvites:
        await this.handleClearInvites(ctx, interaction);
        break;
      default:
        throw new Error("Unknown subcommand");
    }
  }

  async handleCreate(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">
  ): Promise<void> {
    const name = interaction.options.getString(BanPoolOption.PoolName, true);
    const description = interaction.options.getString(
      BanPoolOption.Description
    );

    let pool;
    let inviteCode;
    try {
      const res = await createPool(
        name,
        interaction.guildId,
        interaction.user.id,
        description
      );

      pool = res.pool;
      inviteCode = res.inviteCode;
    } catch (err) {
      if (err instanceof BanPoolError) {
        await interaction.reply({
          embeds: [err.embed],
        });

        return;
      }

      throw err;
    }

    const embed = new EmbedBuilder()
      .setTitle(`Ban pool ${name} created`)
      .setDescription(
        `You can now invite other servers to join this ban pool with the following invite: \`${inviteCode}\` (expires in 1 day)\n
Use it with \`/banpool join\` in another server to join this ban pool.\n\
If you want to make a new invite, use \`/banpool invite\``
      )
      .addFields(
        {
          name: "Description",
          value: description ?? "No description provided",
        },
        {
          name: "Creator",
          value: `${interaction.user}`,
        },
        {
          name: "Settings",
          value: buildPoolSettingsString(pool),
          inline: false,
        }
      )
      .setColor(Color.Success);

    await interaction.reply({
      embeds: [embed],
    });
  }

  async handleJoin(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">
  ): Promise<void> {
    const inviteCode = interaction.options.getString(
      BanPoolOption.InviteCode,
      true
    );

    let pool;
    let ownerGuild;
    try {
      const joinRes = await joinPool(
        inviteCode,
        interaction.guildId,
        (guildId) => interaction.client.guilds.cache.get(guildId)
      );

      pool = joinRes.pool;
      ownerGuild = joinRes.guild;
    } catch (err) {
      if (err instanceof BanPoolError) {
        await interaction.reply({
          embeds: [err.embed],
        });

        return;
      }

      throw err;
    }

    const embed = new EmbedBuilder()
      .setTitle(`Ban pool ${pool.pool_name} joined`)
      .setDescription(
        "You are now sharing lookup reasons with other servers in this ban pool."
      )
      .addFields(
        {
          name: "Description",
          value: pool.description ?? "No description provided",
        },
        {
          name: "Owner",
          value: `Server: ${ownerGuild.name} (ID \`${ownerGuild.id}\`)\n Created by: <@${pool.creator_id}>`,
        }
      )
      .setColor(Color.Success);

    await interaction.reply({
      embeds: [embed],
    });
  }

  async handleList(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">
  ): Promise<void> {
    const ownedPools = await getAllGuildBanPools(interaction.guildId);
    const memberPools = await getAllBanPoolMemberships(db, interaction.guild.id)

    const embed = new EmbedBuilder()
      .setTitle("Ban pools")
      .setDescription(
        "Use `/banpool show <id>` to show more details and invites about a specific ban pool."
      )
      .addFields(
        {
          name: `Owned pools - ${ownedPools.length} total`,
          value:
            ownedPools
              .map((pool) => {
                let s = `- **${pool.pool_name}**`;
                s += "\n";
                s += `╰ **ID:** \`${pool.id}\``;
                s += "\n";
                s += `╰ **Description:** ${pool.description ?? "None"}`;

                return s;
              })
              .join("\n") ||
            "No pools created. Create one with `/banpool create`",
        },
        {
          name: `Member pools - ${memberPools.length} total`,
          value:
            memberPools
              .map((pool) => {
                const guildName =
                  interaction.client.guilds.cache.get(pool.owner_guild_id)?.name ??
                  "Unknown server";

                let s = `**${pool.pool_name}**`;
                s += "\n";
                s += `╰ **ID:** \`${pool.id}\``;
                s += "\n";
                s += `╰ **Server:** ${guildName} (ID \`${pool.owner_guild_id}\`)`;
                s += "\n";
                s += `╰ **Owner:** <@${pool.creator_id}>`;
                s += "\n";
                s += `╰ **Description:** ${pool.description ?? "None"}`;

                return s;
              })
              .join("\n") || "No pools joined.",
        }
      )

      .setColor(Color.Success);

    await interaction.reply({
      embeds: [embed],
    });
  }

  async handleShow(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">
  ): Promise<void> {
    const nameOrID = interaction.options.getString(
      BanPoolOption.PoolName,
      true
    );

    let pool;
    let poolMember;
    let members;
    try {
      const shown = await showPool(nameOrID, interaction.guildId);
      pool = shown.pool;
      poolMember = shown.poolMember;
      members = shown.members;
    } catch (err) {
      if (err instanceof BanPoolError) {
        await interaction.reply({
          embeds: [err.embed],
        });

        return;
      }

      throw err;
    }

    const membersStr =
      members
        .map((member) => {
          const guildName =
            interaction.client.guilds.cache.get(member.member_guild_id)?.name ??
            "Unknown server";

          return `${guildName} (ID \`${member.member_guild_id}\`)`;
        })
        .join("\n") || "No members.";

    // Only show invites if the server owns the pool
    const isOwner = pool.guild_id === interaction.guild.id;

    if (!isOwner && poolMember) {
      const ownerGuildName =
        interaction.client.guilds.cache.get(pool.guild_id)?.name ??
        "Unknown server";

      const embed = new EmbedBuilder()
        .setTitle(`Ban pool ${pool.pool_name}`)
        .setDescription("This server is a **member** of this ban pool.")
        .addFields(
          {
            name: "Description",
            value: pool.description ?? "No description provided",
          },
          {
            name: "Owner",
            value: `Server: ${ownerGuildName} (ID \`${pool.guild_id}\`)\n Created by: <@${pool.creator_id}>`,
          },
          {
            name: `Members - ${members.length} total`,
            value: membersStr,
          },
          {
            name: "Settings",
            // Use poolMember for MEMBER settings, not owner settings
            value: buildPoolSettingsString(poolMember),
            inline: false,
          }
        )
        .setColor(Color.Success);

      await interaction.reply({
        embeds: [embed],
      });

      return;
    }

    // Own pool, show invites and members
    const invites = await getAllBanPoolInvites(db, pool.pool_name, pool.guild_id);

    const embed = new EmbedBuilder()
      .setTitle(`Ban pool ${pool.pool_name}`)
      .setDescription("This server **owns** this ban pool.")
      .addFields(
        {
          name: "Description",
          value: pool.description ?? "No description provided",
        },
        {
          name: "Creator",
          value: `<@${pool.creator_id}>`,
        },
        {
          name: `Members - ${members.length} total`,
          value: membersStr,
        },
        {
          name: "Invites",
          value:
            invites
              .map((invite) => {
                const expiresAt = invite.expires_at
                  ? dayjs.utc(invite.expires_at)
                  : null;

                let s = `\`${invite.invite_code}\``;
                s += "\n";
                s += "╰ Expires: ";
                s += expiresAt ? toTimestamp(expiresAt) : "Never";

                return s;
              })
              .join("\n") || "No invites created.",
        },
        {
          name: "Settings",
          value: buildPoolSettingsString(pool),
          inline: false,
        }
      )
      .setColor(Color.Success);

    await interaction.reply({
      embeds: [embed],
    });
  }

  async handleDelete(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">
  ): Promise<void> {
    const name = interaction.options.getString(BanPoolOption.PoolName, true);

    try {
      await deletePool(name, interaction.guildId);
    } catch (err) {
      if (err instanceof BanPoolError) {
        await interaction.reply({
          embeds: [err.embed],
        });

        return;
      }

      throw err;
    }

    const embed = new EmbedBuilder()
      .setTitle(`Ban pool ${name} deleted`)
      .setDescription(
        `The ban pool ${name} has been deleted. \
All members of this ban pool have also been removed and reasons will no longer be shared.`
      )
      .setColor(Color.Success);

    await interaction.reply({
      embeds: [embed],
    });
  }

  async handleInvite(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">
  ): Promise<void> {
    const name = interaction.options.getString(BanPoolOption.PoolName, true);
    const expireAfter = interaction.options.getString(
      BanPoolOption.ExpireAfter,
      true
    );
    const maxUses = interaction.options.getInteger(BanPoolOption.MaxUses);

    const expireDate =
    expireAfter === "never"
      ? null
      : dayjs.utc().add(parseInt(expireAfter, 10), "seconds");

    let inviteCode;
    try {
      inviteCode = await createInvite(
        name, 
        interaction.guildId,
        expireDate,
        maxUses,
      );
    } catch (err) {
      if (err instanceof BanPoolError) {
        await interaction.reply({
          embeds: [err.embed],
        });

        return;
      }

      throw err;
    }

    const embed = new EmbedBuilder()
      .setTitle("Invite created")
      .setDescription(
        `You can now invite other servers to join this ban pool with the following invite: \`${inviteCode}\` (expires in 1 day)\n\n
Use \`/banpool join ${inviteCode}\` in another server to join this ban pool.\n\
If you want to make a new invite, use \`/banpool invite ${name} <invite_code>\``
      )
      .setColor(Color.Success);

    await interaction.reply({
      embeds: [embed],
    });
  }

  async handleDeleteInvite(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">
  ): Promise<void> {
    const inviteCode = interaction.options.getString(
      BanPoolOption.InviteCode,
      true
    );

    try {
      await checkAndDeleteInvite(
        inviteCode,
        interaction.guildId,
        );
    } catch (err) {
      if (err instanceof BanPoolError) {
        await interaction.reply({
          embeds: [err.embed],
        });

        return;
      }

      throw err;
    }

    const embed = new EmbedBuilder()
      .setTitle("Invite deleted")
      .setDescription(
        `The ban pool invite \`${inviteCode}\` has been deleted. \n\
The invite is no longer valid and cannot be used to join the ban pool.
You can create a new invite with \`/banpool invite\``
      )
      .setColor(Color.Success);

    await interaction.reply({
      embeds: [embed],
    });
  }

  async handleClearInvites(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">
  ): Promise<void> {
    const poolName = interaction.options.getString(
      BanPoolOption.PoolName,
      true
    );

    try {
      await clearBanPoolInvites(
        poolName,
        interaction.guildId,
        );
    } catch (err) {
      if (err instanceof BanPoolError) {
        await interaction.reply({
          embeds: [err.embed],
        });

        return;
      }

      throw err;
    }

    const embed = new EmbedBuilder()
      .setTitle("All invites deleted")
      .setDescription(
        `All ban pool invites for the ${poolName} pool have been deleted. \n\
You can create a new invite with \`/banpool invite\``
      )
      .setColor(Color.Success);

    await interaction.reply({
      embeds: [embed],
    });
  }
}