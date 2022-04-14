import * as z from "zod"

export const MemberModel = z.object({
  guild_id: z.bigint(),
  user_id: z.bigint(),
  join_time: z.date(),
})
