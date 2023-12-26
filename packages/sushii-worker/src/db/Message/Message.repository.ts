import { DeleteResult, Kysely } from "kysely";
import { DB } from "../../model/dbTypes";

export function deleteMessagesBefore(
  db: Kysely<DB>,
  before: Date,
): Promise<DeleteResult> {
  return db
    .deleteFrom("app_public.messages")
    .where("created", "<", before)
    .executeTakeFirst();
}
