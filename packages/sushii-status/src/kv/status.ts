import { Status, StatusType } from "../model/status";
import { STATUS_KEY } from "./keys";

export async function getStatus(
  ns: KVNamespace<string>
): Promise<StatusType | null> {
  const data = await ns.get(STATUS_KEY, "json");
  if (!data) {
    return null;
  }

  return Status.parse(data);
}

export async function setStatus(
  ns: KVNamespace<string>,
  status: StatusType
): Promise<void> {
  status.updatedAt = new Date().toISOString();

  return ns.put(STATUS_KEY, JSON.stringify(status));
}
