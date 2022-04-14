import * as z from "zod"

export const RoleMenuModel = z.object({
  messageId: z.bigint(),
  guildId: z.bigint(),
  channelId: z.bigint(),
  editorId: z.bigint().nullish(),
})
