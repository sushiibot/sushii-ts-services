import dayjs from "dayjs";
import { User } from "discord.js";
import Context from "../../model/context";
import { getUserOrDefault, upsertUser } from "../../db/User/User.repository";
import db from "../../infrastructure/database/db";

/**
 * Response value of caught fishy
 */
export interface RepResponse {
  oldAmount: string;
  newAmount: string;
}

export default async function repForUser(
  ctx: Context,
  invoker: User,
  target: User,
): Promise<RepResponse | dayjs.Dayjs> {
  // Fetch both target and invoker
  const [dbUser, dbInvokerUser] = await Promise.all([
    getUserOrDefault(db, target.id),
    getUserOrDefault(db, invoker.id),
  ]);

  const lastRep = dayjs.utc(dbInvokerUser.last_rep);
  const nextRep = lastRep.add(dayjs.duration({ hours: 12 }));
  // Now is before next rep
  if (dayjs().utc().isBefore(nextRep)) {
    // User has already repped today
    return nextRep;
  }

  const oldAmount = dbUser.rep;
  const newAmount = BigInt(dbUser.rep) + BigInt(1);

  // Update rep for target
  dbUser.rep = newAmount.toString();
  // Update lastRep for invoker
  dbInvokerUser.last_rep = dayjs().utc().toDate();

  // Update invoker
  const updateInvokerPromise = upsertUser(db, dbInvokerUser);
  // Update target
  const updateUserPromise = upsertUser(db, dbUser);

  // Save to db
  await Promise.all([updateInvokerPromise, updateUserPromise]);

  return {
    oldAmount,
    newAmount: newAmount.toString(),
  };
}
