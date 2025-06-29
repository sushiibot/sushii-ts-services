import { Insertable, Selectable, Updateable } from "kysely";
import { z } from "zod";
import { AppPublicUsers } from "../../infrastructure/database/config/dbTypes";

export const profileDataSchema = z.object({
  patron_cents: z.number().optional(),
  patron_emoji_url: z.string().optional(),
});

export type ProfileData = z.infer<typeof profileDataSchema>;

export type UserRow = Selectable<AppPublicUsers>;
export type InsertableUserRow = Insertable<AppPublicUsers>;
export type UpdateableUserRow = Updateable<AppPublicUsers>;
