import z from "zod";

export const ShardStatus = z.object({
  id: z.number(),
  status: z.string(),
  ping: z.number(),
  guilds: z.number(),
  uptime: z.number(),
});

export const Status = z.object({
  updatedAt: z.string().optional(),
  shards: z.array(ShardStatus),
});

export type ShardStatusType = z.infer<typeof ShardStatus>;
export type StatusType = z.infer<typeof Status>;
