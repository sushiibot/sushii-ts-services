import { EmbedBuilder, Guild } from "discord.js";
import dayjs from "dayjs";
import { randomBytes } from "crypto";
import base32 from "hi-base32";
import { AllSelection } from "kysely/dist/cjs/parser/select-parser";
import db from "../../model/db";
import Color from "../../utils/colors";
import { DB } from "../../model/dbTypes";

type ErrorType =
  | "INVITE_NOT_FOUND"
  | "INVITE_EXPIRED"
  | "GROUP_NOT_FOUND"
  | "GROUP_ALREADY_EXISTS"
  | "CANNOT_JOIN_OWN_GROUP"
  | "GUILD_UNAVAILABLE";

const notFoundBasic = new EmbedBuilder()
  .setTitle("Lookup group not found")
  .setDescription(
    "The lookup group you provided doesn't exist, please try another lookup group."
  )
  .setColor(Color.Error);

const inviteNotFoundEmbed = new EmbedBuilder()
  .setTitle("Invite not found")
  .setDescription(
    "The invite code you provided is invalid or has expired. \
Check with the server that provided you with an invite code. They can use `/lookupgroup invite` to create a new invite."
  )
  .setColor(Color.Error);

const inviteExpiredEmbed = new EmbedBuilder()
  .setTitle("Invite expired")
  .setDescription(
    "The invite code you provided has expired. \
Check with the server that provided you with an invite code. They can use `/lookupgroup invite` to create a new invite."
  )
  .setColor(Color.Error);

const joinOwnGroupEmbed = new EmbedBuilder()
  .setTitle("Failed to join lookup group")
  .setDescription(
    "You cannot join your own lookup group, you are already a member of it!\n\
Use this code on another server, or join groups created by other servers if they provide you an invite."
  )
  .setColor(Color.Error);

const guildUnavailableEmbed = new EmbedBuilder()
  .setTitle("Failed to join lookup group")
  .setDescription(
    "Seems like that server that created the lookup group is no longer available, please try another invite or ensure they have sushii still in the server."
  )
  .setColor(Color.Error);

const notFoundWithIDEmbed = new EmbedBuilder()
  .setTitle("Lookup group not found")
  .setDescription(
    "The lookup group you provided doesn't exist or you aren't part of it - please try another lookup group. \n\
If you're checking another server's group, use the group number ID instead of the name listed in `/lookupgroup list`"
  )
  .setColor(Color.Error);

export class LookupGroupError extends Error {
  public type: ErrorType;

  public embed: EmbedBuilder;

  constructor(type: ErrorType, message: string, embed: EmbedBuilder) {
    super(message);

    this.type = type;
    this.embed = embed;
  }
}

// Create a randomized base64 string without special characters and starting with lg-
function generateInvite(): string {
  return base32.encode(randomBytes(12)).toLowerCase().replace(/=/g, "");
}

export async function createGroup(
  groupName: string,
  guildId: string,
  creatorId: string,
  description: string | null
): Promise<string> {
  const existingGroup = await db
    .selectFrom("app_public.lookup_groups")
    .selectAll()
    .where("name", "=", groupName)
    .where("guild_id", "=", guildId)
    .executeTakeFirst();

  if (existingGroup) {
    const embed = new EmbedBuilder()
      .setTitle("Lookup group already exists")
      .setDescription("Use a different name for your lookup group.")
      .setColor(Color.Error);

    throw new LookupGroupError(
      "GROUP_ALREADY_EXISTS",
      "Lookup group already exists",
      embed
    );
  }

  await db
    .insertInto("app_public.lookup_groups")
    .values({
      name: groupName,
      description,
      guild_id: guildId,
      creator_id: creatorId,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  const inviteCode = generateInvite();

  // Create 1d invite code
  await db
    .insertInto("app_public.lookup_group_invites")
    .values({
      owner_guild_id: guildId,
      name: groupName,
      invite_code: inviteCode,
      expires_at: dayjs.utc().add(1, "day").toDate(),
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  return inviteCode;
}

export async function joinGroup(
  inviteCode: string,
  guildId: string,
  getOwnerGuild: (guildId: string) => Guild | undefined
): Promise<{
  group: AllSelection<DB, "app_public.lookup_groups">;
  guild: Guild;
}> {
  const invite = await db
    .selectFrom("app_public.lookup_group_invites")
    .selectAll()
    .where("invite_code", "=", inviteCode)
    .executeTakeFirst();

  if (!invite) {
    throw new LookupGroupError(
      "INVITE_NOT_FOUND",
      "Invite not found",
      inviteNotFoundEmbed
    );
  }

  // Check if invite is expired
  if (dayjs.utc(invite.expires_at).isBefore(dayjs.utc())) {
    // Delete the expired invite
    await db
      .deleteFrom("app_public.lookup_group_invites")
      .where("invite_code", "=", inviteCode)
      .execute();

    throw new LookupGroupError(
      "INVITE_EXPIRED",
      "Invite expired",
      inviteExpiredEmbed
    );
  }

  const group = await db
    .selectFrom("app_public.lookup_groups")
    .selectAll()
    .where("name", "=", invite.name)
    // Invite's guild id, not current guild id
    .where("guild_id", "=", invite.owner_guild_id)
    .executeTakeFirst();

  // This shouldn't really happen since invite will be deleted if group is also deleted
  if (!group) {
    throw new LookupGroupError(
      "GROUP_NOT_FOUND",
      "Group not found",
      notFoundBasic
    );
  }

  // Check if it's the server's own group
  if (group.guild_id === guildId) {
    throw new LookupGroupError(
      "CANNOT_JOIN_OWN_GROUP",
      "Can't join your own group",
      joinOwnGroupEmbed
    );
  }

  // Get guild info of group owner
  const ownerGuild = getOwnerGuild(group.guild_id);
  if (!ownerGuild) {
    throw new LookupGroupError(
      "GUILD_UNAVAILABLE",
      "Guild unavailable",
      guildUnavailableEmbed
    );
  }

  // Join group
  await db
    .insertInto("app_public.lookup_group_members")
    .values({
      member_guild_id: guildId,
      owner_guild_id: group.guild_id,
      name: group.name,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  return {
    group,
    guild: ownerGuild,
  };
}

export async function showGroup(
  nameOrID: string,
  guildId: string
): Promise<{
  group: AllSelection<DB, "app_public.lookup_groups">;
  members: AllSelection<DB, "app_public.lookup_group_members">[];
}> {
  const groupID = parseInt(nameOrID, 10);

  let groupQuery = db.selectFrom("app_public.lookup_groups").selectAll();

  if (Number.isNaN(groupID)) {
    groupQuery = groupQuery
      .where("name", "=", nameOrID)
      .where("guild_id", "=", guildId);
  } else {
    groupQuery = groupQuery.where((eb) =>
      eb.or([
        // Could be a number as the name
        eb.and([eb("name", "=", nameOrID), eb("guild_id", "=", guildId)]),

        // Could be a number ID
        eb("id", "=", groupID),
      ])
    );
  }

  const group = await groupQuery.executeTakeFirst();
  if (!group) {
    throw new LookupGroupError(
      "GROUP_NOT_FOUND",
      "Lookup group not found",
      notFoundWithIDEmbed
    );
  }

  // Make sure this server is allowed to view it, either owner or member
  let canView = group.guild_id === guildId;

  // Not owner, check if member
  if (!canView) {
    const member = await db
      .selectFrom("app_public.lookup_group_members")
      .selectAll()
      .where("member_guild_id", "=", guildId)
      .where("name", "=", group.name)
      .executeTakeFirst();

    // If member was found
    canView = !!member;
  }

  if (!canView) {
    throw new LookupGroupError(
      "GROUP_NOT_FOUND",
      "Lookup group not found",
      notFoundWithIDEmbed
    );
  }

  const members = await db
    .selectFrom("app_public.lookup_group_members")
    .selectAll()
    .where("owner_guild_id", "=", group.guild_id)
    .where("name", "=", group.name)
    .execute();

  return {
    group,
    members,
  };
}

export async function deleteGroup(
  groupName: string,
  guildId: string
): Promise<void> {
  const group = await db
    .selectFrom("app_public.lookup_groups")
    .selectAll()
    .where("name", "=", groupName)
    .where("guild_id", "=", guildId)
    .executeTakeFirst();

  if (!group) {
    throw new LookupGroupError(
      "GROUP_NOT_FOUND",
      "Lookup group not found",
      notFoundBasic
    );
  }

  // Delete group
  await db
    .deleteFrom("app_public.lookup_groups")
    .where("name", "=", groupName)
    .where("guild_id", "=", guildId)
    .execute();
}

export async function createInvite(
  groupName: string,
  guildId: string,
  expireAfter: string
): Promise<string> {
  const group = await db
    .selectFrom("app_public.lookup_groups")
    .selectAll()
    .where("name", "=", groupName)
    .where("guild_id", "=", guildId)
    .executeTakeFirst();

  if (!group) {
    throw new LookupGroupError(
      "GROUP_NOT_FOUND",
      "Lookup group not found",
      notFoundBasic
    );
  }

  // Create invite
  const inviteCode = generateInvite();

  const expireDate =
    expireAfter === "never"
      ? null
      : dayjs.utc().add(parseInt(expireAfter, 10), "seconds");

  await db
    .insertInto("app_public.lookup_group_invites")
    .values({
      owner_guild_id: guildId,
      name: groupName,
      invite_code: inviteCode,
      expires_at: expireDate?.toDate(),
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  return inviteCode;
}

export async function deleteInvite(inviteCode: string): Promise<void> {
  const invite = await db
    .selectFrom("app_public.lookup_group_invites")
    .selectAll()
    .where("invite_code", "=", inviteCode)
    .where((eb) =>
      eb.or([
        // Either null expiry
        eb("expires_at", "is", null),

        // Or not expired yet
        eb("expires_at", ">", dayjs.utc().toDate()),
      ])
    )
    .executeTakeFirst();

  if (!invite) {
    const embed = new EmbedBuilder()
      .setTitle("Invite not found")
      .setDescription("The invite code you provided is invalid or has expired.")
      .setColor(Color.Error);

    throw new LookupGroupError("INVITE_NOT_FOUND", "Invite not found", embed);
  }

  // Delete invite
  await db
    .deleteFrom("app_public.lookup_group_invites")
    .where("invite_code", "=", inviteCode)
    .execute();
}
