import * as z from "zod"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const GuildConfigModel = z.object({
  id: z.bigint(),
  prefix: z.string().nullish(),
  joinMsg: z.string().nullish(),
  joinMsgEnabled: z.boolean(),
  joinReact: z.string().nullish(),
  leaveMsg: z.string().nullish(),
  leaveMsgEnabled: z.boolean(),
  msgChannel: z.bigint().nullish(),
  role_channel: z.bigint().nullish(),
  role_config: jsonSchema,
  role_enabled: z.boolean(),
  inviteGuard: z.boolean(),
  logMsg: z.bigint().nullish(),
  logMsgEnabled: z.boolean(),
  logMod: z.bigint().nullish(),
  logModEnabled: z.boolean(),
  logMember: z.bigint().nullish(),
  logMemberEnabled: z.boolean(),
  muteRole: z.bigint().nullish(),
  muteDuration: z.bigint().nullish(),
  muteDmText: z.string().nullish(),
  muteDmEnabled: z.boolean(),
  warnDmText: z.string().nullish(),
  warnDmEnabled: z.boolean(),
  maxMention: z.number().int().nullish(),
  disabledChannels: z.bigint().array(),
  data: jsonSchema,
})
