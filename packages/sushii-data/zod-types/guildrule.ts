import * as z from "zod"
import { CompleteGuildRuleSet, RelatedGuildRuleSetModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const GuildRuleModel = z.object({
  id: z.bigint(),
  set_id: z.bigint(),
  name: z.string(),
  enabled: z.boolean(),
  trigger: jsonSchema,
  conditions: jsonSchema,
  actions: jsonSchema,
  created_at: z.date(),
  updated_at: z.date(),
})

export interface CompleteGuildRule extends z.infer<typeof GuildRuleModel> {
  guild_rule_sets: CompleteGuildRuleSet
}

/**
 * RelatedGuildRuleModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedGuildRuleModel: z.ZodSchema<CompleteGuildRule> = z.lazy(() => GuildRuleModel.extend({
  guild_rule_sets: RelatedGuildRuleSetModel,
}))
