import { PermissionsBitField } from "discord.js";
import { APIGuildMember } from "discord-api-types/v10";
import { GetRedisGuildQuery } from "../generated/graphql";

// Based off discord.js
// https://github.com/discordjs/discord.js/blob/9f63eb977f15250e9fb0b5673e56dccf6efff0f4/packages/discord.js/src/structures/GuildMember.js#L236
export default function getMemberPermissions(
  userId: string,
  member: APIGuildMember,
  redisGuild: NonNullable<GetRedisGuildQuery["redisGuildByGuildId"]>
): PermissionsBitField {
  if (userId === redisGuild.ownerId) {
    return new PermissionsBitField(PermissionsBitField.All).freeze();
  }

  const guildRoles = new Map(redisGuild.roles?.map((r) => [r.id, r]));

  return new PermissionsBitField(
    member.roles
      .map((roleId) => guildRoles.get(roleId)?.permissions)
      .filter((p): p is string => !!p)
      .map((p) => BigInt(p))
  ).freeze();
}
