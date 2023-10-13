import { EmbedBuilder } from "discord.js";
import dayjs from "dayjs";
import { BanPoolRow } from "./BanPool.table";
import { BanPoolMemberRow } from "./BanPoolMember.table";
import { BanPoolInviteRow } from "./BanPoolInvite.table";
import Color from "../../../utils/colors";
import { buildPoolSettingsString } from "./settings";
import toTimestamp from "../../../utils/toTimestamp";

export function getShowEmbed(
  pool: BanPoolRow,
  isMember: boolean,
  ownerGuildName: string | null,
  memberCount: number,
  inviteCount: number,
): EmbedBuilder {
  const description = isMember
    ? "This server is a member of this ban pool."
    : "This server **owns** this ban pool.";

  const fields = [
    {
      name: "Description",
      value: pool.description ?? "No description provided",
    },
  ];

  if (ownerGuildName) {
    fields.push({
      name: "Owner",
      value: `${ownerGuildName} (ID \`${pool.guild_id}\`)`,
    });
  } else {
    fields.push({
      name: "Creator",
      value: `<@${pool.creator_id}>`,
    });
  }

  fields.push({
    name: "Members",
    value: `${memberCount} members`,
  });

  // Add invites count for owner
  if (!isMember) {
    fields.push({
      name: "Invites",
      value: `${inviteCount} invites`,
    });
  }

  const builder = new EmbedBuilder()
    .setTitle(`Ban pool ${pool.pool_name}`)
    .setDescription(description)
    .addFields(fields)
    .setColor(Color.Info);

  return builder;
}

export function getSettingsEmbed(pool: BanPoolRow): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle("Ban Pool Settings")
    .setAuthor({
      name: pool.pool_name,
    })
    .setDescription(buildPoolSettingsString(pool))
    .setColor(Color.Info);
}

/**
 * Get string to display members in a ban pool
 *
 * @param members array of members in a ban pool
 * @param getGuildName function to get the name of a guild from id
 * @returns formatted string to display members in a ban pool
 */
function formatMembers(
  members: BanPoolMemberRow[],
  getGuildName: (guildId: string) => string | undefined,
): string {
  return (
    members
      .map((member) => {
        const guildName =
          getGuildName(member.member_guild_id) ?? "Unknown server";

        return `${guildName} (ID \`${member.member_guild_id}\`)`;
      })
      .join("\n") || "No members."
  );
}

/**
 * Get embed to show members in a ban pool
 *
 * @param pool pool to show members for
 * @param members members in the pool
 * @param getGuildName function to get the name of a guild from id
 * @returns embed to show members in a ban pool
 */
export function getMembersEmbed(
  pool: BanPoolRow,
  members: BanPoolMemberRow[],
  getGuildName: (guildId: string) => string | undefined,
): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle("Ban Pool Members")
    .setAuthor({
      name: pool.pool_name,
    })
    .setDescription(formatMembers(members, getGuildName))
    .setColor(Color.Info);
}

/**
 * Get string to display invites in a ban pool
 */
function formatInvites(invites: BanPoolInviteRow[]): string {
  return (
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
      .join("\n") || "No invites created."
  );
}

/**
 * Get embed to show invites in a ban pool
 *
 * @param pool pool to show invites for
 * @param invites invites in the pool
 * @returns embed to show invites in a ban pool
 */
export function getInvitesEmbed(
  pool: BanPoolRow,
  invites: BanPoolInviteRow[],
): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle("Ban Pool Invites")
    .setAuthor({
      name: pool.pool_name,
    })
    .setDescription(formatInvites(invites))
    .setColor(Color.Info);
}
