import { Err, Ok, Result } from "ts-results";
import { APIRole } from "discord-api-types/v10";
import { GetRedisGuildQuery } from "../generated/graphql";
import { getHighestMemberRole } from "./hasPermission";
import Context from "../model/context";

export default async function canAddRole(
  ctx: Context,
  guildId: string,
  role: APIRole,
  options?: {
    redisGuild?: NonNullable<GetRedisGuildQuery["redisGuildByGuildId"]>;
  }
): Promise<Result<void, string>> {
  let guild;

  if (options?.redisGuild) {
    guild = options.redisGuild;
  } else {
    const redisGuildRes = await ctx.sushiiAPI.sdk.getRedisGuild({
      guild_id: guildId,
    });

    if (!redisGuildRes.redisGuildByGuildId) {
      return Err("Server was not found");
    }

    guild = redisGuildRes.redisGuildByGuildId;
  }

  const currentUser = await ctx.getCurrentUser();
  const sushiiMember = await ctx.REST.getMember(guildId, currentUser.id);

  if (sushiiMember.err) {
    return Err("Failed to get sushii member");
  }

  const sushiiMemberData = sushiiMember.safeUnwrap();
  const sushiiHighestRole = getHighestMemberRole(sushiiMemberData, guild);

  if (sushiiHighestRole === null) {
    return Err(
      "Hmm something went wrong getting sushii's roles, please make sure sushii has a role with required permissions!"
    );
  }

  // Check if role is higher than sushii's highest role
  // Level role must be below sushii's highest role
  if (role.position >= sushiiHighestRole.position) {
    Err(
      "Role must be lower than sushii's highest role. Please move the role below sushii's role or move sushii's role to be higher."
    );
  }

  return Ok.EMPTY;
}
