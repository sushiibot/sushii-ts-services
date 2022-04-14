import { z } from 'zod';
import { RoleMenuModel } from 'zod-types/rolemenu';

export const RoleMenuTransport = RoleMenuModel.extend({
  messageId: z.string(),
  guildId: z.string(),
  channelId: z.string(),
  editorId: z.string().nullish(),
});

export const modelToRoleMenuTransport = RoleMenuModel.extend({
  messageId: z.bigint().transform((x) => x.toString()),
  guildId: z.bigint().transform((x) => x.toString()),
  channelId: z.bigint().transform((x) => x.toString()),
  editorId: z
    .bigint()
    .transform((x) => x.toString())
    .nullish(),
});

export type RoleMenuTransport = z.infer<typeof RoleMenuTransport>;

export const transportToRoleMenuModel = RoleMenuModel.extend({
  messageId: z.string().transform(BigInt),
  guildId: z.string().transform(BigInt),
  channelId: z.string().transform(BigInt),
  editorId: z.string().transform(BigInt).nullish(),
});
