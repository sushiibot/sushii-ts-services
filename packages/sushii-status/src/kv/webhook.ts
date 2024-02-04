import { WebhookMessage, WebhookMessageType } from "../model/message";
import { MSG_ID_KEY } from "./keys";

export async function getWebhookMsgId(
  ns: KVNamespace<string>
): Promise<WebhookMessageType | null> {
  const data = ns.get(MSG_ID_KEY, "json");
  if (!data) {
    return null;
  }

  return WebhookMessage.parse(data);
}

export async function updateWebhookMsgId(
  ns: KVNamespace<string>,
  msg: WebhookMessageType
): Promise<void> {
  msg.updatedAt = new Date().toISOString();
  return ns.put(MSG_ID_KEY, JSON.stringify(msg));
}
