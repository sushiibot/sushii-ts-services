import {
  APIChatInputApplicationCommandGuildInteraction,
  APIGuildMember,
  APIInteractionDataResolvedGuildMember,
  APIUser,
} from "discord-api-types/v10";
import { Err, Ok, Result } from "ts-results";
import { GetRedisGuildQuery, RedisGuildRole } from "../generated/graphql";
import Context from "../model/context";

// getHighestRole returns the highest role of a user in a guild
function getHighestRole(roles: RedisGuildRole[]): RedisGuildRole | null {
  if (roles.length === 0) {
    return null;
  }

  return roles.reduce((prev, role) => {
    if (role.position > prev.position) {
      return role;
    }

    return prev;
  }, roles[0]);
}

export function getHighestMemberRole(
  member: APIGuildMember,
  redisGuild: NonNullable<GetRedisGuildQuery["redisGuildByGuildId"]>
): RedisGuildRole | null {
  const rolesMap = redisGuild.roles?.reduce((acc, role) => {
    if (role?.id) {
      acc.set(role.id, role);
    }
    return acc;
  }, new Map<string, RedisGuildRole>());

  if (!rolesMap) {
    return null;
  }

  const roles = member.roles
    .map((roleId) => rolesMap.get(roleId))
    .filter((role): role is RedisGuildRole => !!role);

  return getHighestRole(roles);
}

export default async function hasPermissionTargetingMember(
  ctx: Context,
  interaction: APIChatInputApplicationCommandGuildInteraction,
  redisGuild: NonNullable<GetRedisGuildQuery["redisGuildByGuildId"]>,
  targetUser?: APIUser,
  targetMember?: Omit<APIInteractionDataResolvedGuildMember, "permissions">
): Promise<Result<true, string>> {
  if (!targetMember || !targetUser) {
    return Ok(true);
  }

  const { member: executorMember } = interaction;

  // No roles in guild? Or just missing from query
  if (!redisGuild.roles) {
    return Ok(true);
  }

  const { ownerId } = redisGuild;
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

  const rolesMap = redisGuild.roles.reduce((acc, role) => {
    if (role?.id) {
      acc.set(role.id, role);
    }
    return acc;
  }, new Map<string, RedisGuildRole>());

  const executorRoles = executorMember.roles
    .map((roleId) => rolesMap.get(roleId))
    .filter((role): role is RedisGuildRole => !!role);
  const highestMemberRole = getHighestRole(executorRoles);

  const targetRoles = targetMember.roles
    .map((roleId) => rolesMap.get(roleId))
    .filter((role): role is RedisGuildRole => !!role);
  const highestTargetRole = getHighestRole(targetRoles);

  // Default 0 for @everyone role position
  const highestMemberRolePosition = highestMemberRole?.position ?? 0;
  const highestTargetRolePosition = highestTargetRole?.position ?? 0;

  // Target highest role has to be less than current role.
  if (highestTargetRolePosition < highestMemberRolePosition) {
    return Ok(true);
  }

  if (highestTargetRolePosition === highestMemberRolePosition) {
    return Err(
      "You cannot target a member with the same highest role than you"
    );
  }

  return Err("You cannot target a member with a higher role than you");
}
