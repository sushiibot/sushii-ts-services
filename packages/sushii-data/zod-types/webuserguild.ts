import * as z from "zod"

export const WebUserGuildModel = z.object({
  user_id: z.bigint(),
  guild_id: z.bigint(),
  owner: z.boolean(),
  permissions: z.bigint(),
  manage_guild: z.boolean().nullish(),
})
