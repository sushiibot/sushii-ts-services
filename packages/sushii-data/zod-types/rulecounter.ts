import * as z from "zod"

export const RuleCounterModel = z.object({
  time: z.date(),
  guild_id: z.bigint(),
  name: z.string(),
})
