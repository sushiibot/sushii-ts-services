import * as z from "zod"
import { CompleteGuildRuleSetConfig, RelatedGuildRuleSetConfigModel, CompleteGuildRule, RelatedGuildRuleModel } from "./index"

export const GuildRuleSetModel = z.object({
  id: z.bigint(),
  guild_id: z.bigint().nullish(),
  name: z.string(),
  description: z.string().nullish(),
  enabled: z.boolean(),
  editable: z.boolean(),
  author: z.bigint().nullish(),
  category: z.string().nullish(),
  created_at: z.date(),
  updated_at: z.date(),
})

export interface CompleteGuildRuleSet extends z.infer<typeof GuildRuleSetModel> {
  guild_rule_set_configs?: CompleteGuildRuleSetConfig | null
  guild_rules: CompleteGuildRule[]
}

/**
 * RelatedGuildRuleSetModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedGuildRuleSetModel: z.ZodSchema<CompleteGuildRuleSet> = z.lazy(() => GuildRuleSetModel.extend({
  guild_rule_set_configs: RelatedGuildRuleSetConfigModel.nullish(),
  guild_rules: RelatedGuildRuleModel.array(),
}))
