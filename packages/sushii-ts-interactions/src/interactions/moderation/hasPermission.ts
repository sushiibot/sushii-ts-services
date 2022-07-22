import {
  APIChatInputApplicationCommandGuildInteraction,
  APIInteractionDataResolvedGuildMember,
  APIUser,
} from "discord-api-types/v10";
import { Err, Ok, Result } from "ts-results";
import { RedisGuildRole } from "../../generated/graphql";
import Context from "../../model/context";

// getHighestRole returns the highest role of a user in a guild
function getHighestRole(roles: RedisGuildRole[]): RedisGuildRole {
  return roles.reduce((prev, role) => {
    if (role.position > prev.position) {
      return role;
    }

    return prev;
  }, roles[0]);
}

export default async function hasPermissionTargetingMember(
  ctx: Context,
  interaction: APIChatInputApplicationCommandGuildInteraction,
  targetUser?: APIUser,
  targetMember?: APIInteractionDataResolvedGuildMember
): Promise<Result<true, string>> {
  if (!targetMember || !targetUser) {
    return Ok(true);
  }

  const { member: executorMember } = interaction;

  const guild = await ctx.sushiiAPI.sdk.getRedisGuild({
    guild_id: interaction.guild_id,
  });

  if (!guild.redisGuildByGuildId?.roles) {
    return Err("Guild not found");
  }

  const { ownerId } = guild.redisGuildByGuildId;
  // Cannot target self -- even if owner just to prevent failure
  if (targetUser.id === executorMember.user.id) {
    return Err("You cannot target yourself");
  }

  // Executor owner
  if (executorMember.user.id === ownerId) {
    return Ok(true);
  }

  // Cannot target owner
  if (targetUser.id === ownerId) {
    return Err("You cannot target the owner");
  }

  const rolesMap = guild.redisGuildByGuildId.roles.reduce((acc, role) => {
    if (role?.id) {
      acc.set(role.id, role);
    }
    return acc;
  }, new Map<string, RedisGuildRole>());

  const executorRoles = executorMember.roles
    .map((roleId) => rolesMap.get(roleId))
    .filter((role): role is RedisGuildRole => !role);
  const highestMemberRole = getHighestRole(executorRoles);

  const targetRoles = targetMember.roles
    .map((roleId) => rolesMap.get(roleId))
    .filter((role): role is RedisGuildRole => !role);
  const highestTargetRole = getHighestRole(targetRoles);

  // Target highest role has to be less than current role.
  if (highestTargetRole.position < highestMemberRole.position) {
    return Ok(true);
  }

  return Err("You cannot target a member with a higher role than you");
}
