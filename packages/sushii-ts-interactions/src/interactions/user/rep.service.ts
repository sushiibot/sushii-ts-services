import {
  APIChatInputApplicationCommandInteraction,
  APIUser,
} from "discord-api-types/v9";
import Context from "../../context";

/**
 * Response value of caught fishy
 */
export interface RepResponse {
  oldAmount: string;
  newAmount: string;
}

export default async function repForUser(
  ctx: Context,
  _interaction: APIChatInputApplicationCommandInteraction,
  user: APIUser
): Promise<RepResponse> {
  const dbUser = await ctx.sushiiAPI.getOrCreate(user.id);

  const oldAmount = dbUser.rep;

  const newRep = BigInt(dbUser.rep) + BigInt(1);

  // Update rep
  dbUser.rep = newRep.toString();
  dbUser.lastRep = new Date().toISOString();

  await ctx.sushiiAPI.sdk.updateUser({ id: user.id, userPatch: dbUser });

  return {
    oldAmount,
    newAmount: newRep.toString(),
  };
}
