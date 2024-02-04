import z from "zod";

export const WebhookMessage = z.object({
  id: z.number(),
  updatedAt: z.string(),
});

export type WebhookMessageType = z.infer<typeof WebhookMessage>;
