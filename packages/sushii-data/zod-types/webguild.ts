import * as z from "zod"

export const WebGuildModel = z.object({
  id: z.bigint(),
  name: z.string(),
  icon: z.string().nullish(),
  created_at: z.date(),
  updated_at: z.date(),
})
