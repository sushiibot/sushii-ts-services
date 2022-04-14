import * as z from "zod"
import { RuleScope } from "@prisma/client"

export const RuleGaugeModel = z.object({
  time: z.date(),
  guild_id: z.bigint(),
  scope: z.nativeEnum(RuleScope),
  scope_id: z.bigint(),
  name: z.string(),
  value: z.bigint(),
})
