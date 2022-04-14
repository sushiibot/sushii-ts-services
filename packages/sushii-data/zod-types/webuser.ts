import * as z from "zod"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const WebUserModel = z.object({
  id: z.bigint(),
  username: z.string(),
  discriminator: z.number().int(),
  avatar: z.string().nullish(),
  is_admin: z.boolean(),
  details: jsonSchema,
  created_at: z.date(),
  updated_at: z.date(),
})
