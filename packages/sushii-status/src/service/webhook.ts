import { StatusType } from "../model/status";

function shouldUpdateMessage(status: StatusType): boolean {
  // If the message is older than 5 minutes, update it
  if (!status.updatedAt) {
    return true;
  }

  const updatedAt = new Date(status.updatedAt);
  const now = new Date();

  const diff = now.getTime() - updatedAt.getTime();
  const diffMinutes = Math.floor(diff / 1000 / 60);

  return diffMinutes >= 5;
}
