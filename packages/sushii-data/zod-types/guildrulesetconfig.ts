import * as z from "zod"
import { CompleteGuildRuleSet, RelatedGuildRuleSetModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const GuildRuleSetConfigModel = z.object({
  set_id: z.bigint(),
  enabled: z.boolean(),
  config: jsonSchema,
  created_at: z.date(),
  updated_at: z.date(),
})

export interface CompleteGuildRuleSetConfig extends z.infer<typeof GuildRuleSetConfigModel> {
  guild_rule_sets: CompleteGuildRuleSet
}

/**
 * RelatedGuildRuleSetConfigModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedGuildRuleSetConfigModel: z.ZodSchema<CompleteGuildRuleSetConfig> = z.lazy(() => GuildRuleSetConfigModel.extend({
  guild_rule_sets: RelatedGuildRuleSetModel,
}))
