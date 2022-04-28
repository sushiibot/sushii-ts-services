import dayjs from "dayjs";
import {
  APIChatInputApplicationCommandInteraction,
  APIUser,
} from "discord-api-types/v10";
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
  invoker: APIUser,
  target: APIUser
): Promise<RepResponse | dayjs.Dayjs> {
  // Fetch both target and invoker
  const [dbUser, dbInvokerUser] = await Promise.all([
    ctx.sushiiAPI.getOrCreateUser(target.id),
    ctx.sushiiAPI.getOrCreateUser(invoker.id),
  ]);

  const lastRep = dayjs(dbInvokerUser.lastRep);
  const nextRep = lastRep.add(dayjs.duration({ hours: 12 }));
  if (lastRep.isBefore(nextRep)) {
    // User has already repped today
    return nextRep;
  }

  const oldAmount = dbUser.rep;
  const newAmount = BigInt(dbUser.rep) + BigInt(1);

  // Update rep for target
  dbUser.rep = newAmount.toString();
  // Update lastRep for invoker
  dbInvokerUser.lastRep = dayjs().toISOString();

  // Update invoker
  const updateInvokerPromise = ctx.sushiiAPI.sdk.updateUser({
    id: dbInvokerUser.id,
    userPatch: dbInvokerUser,
  });
  // Update target
  const updateUserPromise = ctx.sushiiAPI.sdk.updateUser({
    id: target.id,
    userPatch: dbUser,
  });

  // Save to db
  await Promise.all([updateInvokerPromise, updateUserPromise]);

  return {
    oldAmount,
    newAmount: newAmount.toString(),
  };
}
