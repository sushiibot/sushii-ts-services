import { Kysely } from "kysely";
import { DB } from "../../model/dbTypes";
import { UserRow } from "./User.table";
import { json } from "../json";

const defaultUser: UserRow = {
  id: "0",
  rep: "0",
  fishies: "0",
  is_patron: false,
  last_fishies: null,
  last_rep: null,
  lastfm_username: null,
  patron_emoji: null,
  profile_data: {},
};

/**
 * Upsert a user into the database
 *
 * @param db database
 * @param user user data to upsert
 * @returns
 */
export function upsertUser(db: Kysely<DB>, user: UserRow): Promise<UserRow> {
  return db
    .insertInto("app_public.users")
    .values({
      ...user,
      profile_data: json(user.profile_data),
    })
    .onConflict((oc) =>
      oc.column("id").doUpdateSet({
        ...user,
        profile_data: json(user.profile_data),
      }),
    )
    .returningAll()
    .executeTakeFirstOrThrow();
}

/**
 * Get a user from the database by ID
 *
 * @param db database
 * @param userId user ID
 * @returns
 */
export function getUser(
  db: Kysely<DB>,
  userId: string,
): Promise<UserRow | undefined> {
  return db
    .selectFrom("app_public.users")
    .selectAll()
    .where("id", "=", userId)
    .executeTakeFirst();
}

/**
 * Get a user from the database by ID, or return a default user if the user
 * doesn't exist
 *
 * @param db database
 * @param userId user ID
 */
export async function getUserOrDefault(
  db: Kysely<DB>,
  userId: string,
): Promise<UserRow> {
  const user = await getUser(db, userId);
  if (user) {
    return user;
  }

  return {
    ...defaultUser,
    // ID should always be set
    id: userId,
  };
}
