import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  PermissionsBitField,
  EmbedBuilder,
} from "discord.js";
import dayjs from "dayjs";
import Context from "../../model/context";
import db from "../../model/db";
import { SlashCommandHandler } from "../handlers";
import Color from "../../utils/colors";
import toTimestamp from "../../utils/toTimestamp";
import {
  LookupGroupError,
  createGroup,
  createInvite,
  deleteGroup,
  deleteInvite,
  joinGroup,
  showGroup,
} from "./LookupGroup.service";

enum LookupGroupOptionCommand {
  Create = "create",
  List = "list",
  Show = "show",
  Delete = "delete",
  Invite = "invite",
  DeleteInvite = "delete_invite",
  Join = "join",
}

enum LookupGroupOption {
  Name = "name",
  Description = "description",
  ExpireAfter = "expire_after",
  InviteCode = "invite_code",
}

export default class LookupGroupCommand extends SlashCommandHandler {
  serverOnly = true;

  requiredBotPermissions = new PermissionsBitField();

  command = new SlashCommandBuilder()
    .setName("lookupgroup")
    .setDescription(
      "Manage lookup group settings, to control which servers you want to share lookup reasons with."
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addSubcommand((c) =>
      c
        .setName(LookupGroupOptionCommand.Create)
        .setDescription("Create a new lookup group.")
        .addStringOption((o) =>
          o
            .setName(LookupGroupOption.Name)
            .setDescription("Name of the lookup group.")
            .setRequired(true)
        )
        .addStringOption((o) =>
          o
            .setName(LookupGroupOption.Description)
            .setDescription("Description of the lookup group.")
            .setRequired(false)
        )
    )
    .addSubcommand((c) =>
      c
        .setName(LookupGroupOptionCommand.Join)
        .setDescription("Join another server's lookup group.")
        .addStringOption((o) =>
          o
            .setName(LookupGroupOption.InviteCode)
            .setDescription("Invite code for lookup group.")
            .setRequired(true)
        )
    )
    .addSubcommand((c) =>
      c
        .setName(LookupGroupOptionCommand.List)
        .setDescription(
          "List lookup groups your server created or is member of."
        )
    )
    .addSubcommand((c) =>
      c
        .setName(LookupGroupOptionCommand.Show)
        .setDescription("Show details of a specific lookup group.")
        .addStringOption((o) =>
          o
            .setName(LookupGroupOption.Name)
            .setDescription("Name or ID of the lookup group.")
            .setRequired(true)
        )
    )
    .addSubcommand((c) =>
      c
        .setName(LookupGroupOptionCommand.Delete)
        .setDescription("Delete a lookup group.")
        .addStringOption((o) =>
          o
            .setName(LookupGroupOption.Name)
            .setDescription("Name of the lookup group to delete.")
            .setRequired(true)
        )
    )
    .addSubcommand((c) =>
      c
        .setName(LookupGroupOptionCommand.Invite)
        .setDescription(
          "Create an invite for a lookup group, for other servers to join."
        )
        .addStringOption((o) =>
          o
            .setName(LookupGroupOption.Name)
            .setDescription("Name of the lookup group to create an invite for.")
            .setRequired(true)
        )
        .addStringOption((o) =>
          o
            .setName(LookupGroupOption.ExpireAfter)
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
    )
    .addSubcommand((c) =>
      c
        .setName(LookupGroupOptionCommand.DeleteInvite)
        .setDescription("Delete an invite for a lookup group.")
        .addStringOption((o) =>
          o
            .setName(LookupGroupOption.InviteCode)
            .setDescription("Invite code for lookup group.")
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
      case LookupGroupOptionCommand.Create:
        await this.handleCreate(ctx, interaction);
        break;
      case LookupGroupOptionCommand.Join:
        await this.handleJoin(ctx, interaction);
        break;
      case LookupGroupOptionCommand.List:
        await this.handleList(ctx, interaction);
        break;
      case LookupGroupOptionCommand.Show:
        await this.handleShow(ctx, interaction);
        break;
      case LookupGroupOptionCommand.Delete:
        await this.handleDelete(ctx, interaction);
        break;
      case LookupGroupOptionCommand.Invite:
        await this.handleInvite(ctx, interaction);
        break;
      case LookupGroupOptionCommand.DeleteInvite:
        await this.handleDeleteInvite(ctx, interaction);
        break;
      default:
        throw new Error("Unknown subcommand");
    }
  }

  async handleCreate(
    ctx: Context,
    interaction: ChatInputCommandInteraction<"cached">
  ): Promise<void> {
    const name = interaction.options.getString(LookupGroupOption.Name, true);
    const description = interaction.options.getString(
      LookupGroupOption.Description
    );

    let inviteCode;
    try {
      inviteCode = await createGroup(
        name,
        interaction.guildId,
        interaction.user.id,
        description
      );
    } catch (err) {
      if (err instanceof LookupGroupError) {
        await interaction.reply({
          embeds: [err.embed],
        });

        return;
      }

      throw err;
    }

    const embed = new EmbedBuilder()
      .setTitle(`Lookup group ${name} created`)
      .setDescription(
        `You can now invite other servers to join this lookup group with the following invite: \`${inviteCode}\` (expires in 1 day)\n
Use it with \`/lookupgroup join\` in another server to join this lookup group.\n\
If you want to make a new invite, use \`/lookupgroup invite\``
      )
      .addFields(
        {
          name: "Description",
          value: description ?? "No description provided",
        },
        {
          name: "Creator",
          value: `${interaction.user}`,
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
      LookupGroupOption.InviteCode,
      true
    );

    let group;
    let ownerGuild;
    try {
      const joinRes = await joinGroup(
        inviteCode,
        interaction.guildId,
        (guildId) => interaction.client.guilds.cache.get(guildId)
      );

      group = joinRes.group;
      ownerGuild = joinRes.guild;
    } catch (err) {
      if (err instanceof LookupGroupError) {
        await interaction.reply({
          embeds: [err.embed],
        });

        return;
      }

      throw err;
    }

    const embed = new EmbedBuilder()
      .setTitle(`Lookup group ${group.name} joined`)
      .setDescription(
        "You are now sharing lookup reasons with other servers in this lookup group."
      )
      .addFields(
        {
          name: "Description",
          value: group.description ?? "No description provided",
        },
        {
          name: "Owner",
          value: `Server: ${ownerGuild.name} (ID \`${ownerGuild.id}\`)\n Created by: <@${group.creator_id}>`,
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
    const ownedGroups = await db
      .selectFrom("app_public.lookup_groups")
      .selectAll()
      .where("guild_id", "=", interaction.guild.id)
      .execute();

    const memberGroups = await db
      .selectFrom("app_public.lookup_group_members")
      .innerJoin("app_public.lookup_groups", (join) =>
        join
          .onRef(
            "app_public.lookup_group_members.owner_guild_id",
            "=",
            "app_public.lookup_groups.guild_id"
          )
          .onRef(
            "app_public.lookup_group_members.name",
            "=",
            "app_public.lookup_groups.name"
          )
      )
      .selectAll()
      .where("member_guild_id", "=", interaction.guild.id)
      .orderBy([
        "app_public.lookup_groups.guild_id",
        "app_public.lookup_groups.name desc",
      ])
      .execute();

    const embed = new EmbedBuilder()
      .setTitle("Lookup groups")
      .setDescription(
        `This server owns \`${ownedGroups.length}\` lookup groups and is in \`${memberGroups.length}\` groups created by other servers.\n\n\
Use \`/lookupgroup show <id>\` to show more details and invites about a specific lookup group.`
      )
      .addFields(
        {
          name: "Owned groups",
          value:
            ownedGroups
              .map((group) => {
                let s = `**${group.name}**`;
                s += "\n";
                s += `╰ **ID:** \`${group.id}\``;
                s += "\n";
                s += `╰ **Description:** ${group.description ?? "None"}`;

                return s;
              })
              .join("\n") ||
            "No groups created. Create one with `/lookupgroup create`",
        },
        {
          name: "Member groups",
          value:
            memberGroups
              .map((group) => {
                const guildName =
                  interaction.client.guilds.cache.get(group.guild_id)?.name ??
                  "Unknown server";

                let s = `**${group.name}**`;
                s += "\n";
                s += `╰ **ID:** \`${group.id}\``;
                s += "\n";
                s += `╰ **Server:** ${guildName} (ID \`${group.guild_id}\`)`;
                s += "\n";
                s += `╰ **Owner:** <@${group.creator_id}>`;
                s += "\n";
                s += `╰ **Description:** ${group.description ?? "None"}`;

                return s;
              })
              .join("\n") || "No groups joined.",
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
      LookupGroupOption.Name,
      true
    );

    let members;
    let group;
    try {
      const shown = await showGroup(nameOrID, interaction.guildId);
      members = shown.members;
      group = shown.group;
    } catch (err) {
      if (err instanceof LookupGroupError) {
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

    // Only show invites if the server owns the group
    const isOwner = group.guild_id === interaction.guild.id;

    if (!isOwner) {
      const ownerGuildName =
        interaction.client.guilds.cache.get(group.guild_id)?.name ??
        "Unknown server";

      const embed = new EmbedBuilder()
        .setTitle(`Lookup group ${group.name}`)
        .setDescription("This server is a **member** of this lookup group.")
        .addFields(
          {
            name: "Description",
            value: group.description ?? "No description provided",
          },
          {
            name: "Owner",
            value: `Server: ${ownerGuildName} (ID \`${group.guild_id}\`)\n Created by: <@${group.creator_id}>`,
          },
          {
            name: `Members - ${membersStr.length} total`,
            value: membersStr,
          }
        )
        .setColor(Color.Success);

      await interaction.reply({
        embeds: [embed],
      });

      return;
    }

    // Own group, show invites and members
    const invites = await db
      .selectFrom("app_public.lookup_group_invites")
      .selectAll()
      .where("owner_guild_id", "=", interaction.guild.id)
      .where("name", "=", group.name)
      .execute();

    const embed = new EmbedBuilder()
      .setTitle(`Lookup group ${group.name}`)
      .setDescription("This server **owns** this lookup group.")
      .addFields(
        {
          name: "Description",
          value: group.description ?? "No description provided",
        },
        {
          name: "Creator",
          value: `<@${group.creator_id}>`,
        },
        {
          name: `Members - ${membersStr.length} total`,
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
    const name = interaction.options.getString(LookupGroupOption.Name, true);

    try {
      await deleteGroup(name, interaction.guildId);
    } catch (err) {
      if (err instanceof LookupGroupError) {
        await interaction.reply({
          embeds: [err.embed],
        });

        return;
      }

      throw err;
    }

    const embed = new EmbedBuilder()
      .setTitle(`Lookup group ${name} deleted`)
      .setDescription(
        `The lookup group ${name} has been deleted. \
All members of this lookup group have also been removed and reasons will no longer be shared.`
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
    const name = interaction.options.getString(LookupGroupOption.Name, true);
    const expireAfter = interaction.options.getString(
      LookupGroupOption.ExpireAfter,
      true
    );

    let inviteCode;
    try {
      inviteCode = await createInvite(name, interaction.guildId, expireAfter);
    } catch (err) {
      if (err instanceof LookupGroupError) {
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
        `You can now invite other servers to join this lookup group with the following invite: \`${inviteCode}\` (expires in 1 day)\n\n
Use \`/lookupgroup join ${inviteCode}\` in another server to join this lookup group.\n\
If you want to make a new invite, use \`/lookupgroup invite ${name} <invite_code>\``
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
      LookupGroupOption.InviteCode,
      true
    );

    try {
      await deleteInvite(inviteCode);
    } catch (err) {
      if (err instanceof LookupGroupError) {
        await interaction.reply({
          embeds: [err.embed],
        });

        return;
      }

      throw err;
    }

    const embed = new EmbedBuilder()
      .setTitle(`Lookup group invite ${inviteCode} deleted`)
      .setDescription(
        `The lookup group invite ${inviteCode} has been deleted. \
The invite is no longer valid and cannot be used to join the lookup group.
You can create a new invite with \`/lookupgroup invite\``
      )
      .setColor(Color.Success);

    await interaction.reply({
      embeds: [embed],
    });
  }
}
