import db from "../../../infrastructure/database/db";
import { upsertGuildSettings } from "./GuildSettings.repository";

export async function settingsSetAlertsChannel(
  guildId: string,
  channelId: string,
): Promise<void> {
  await upsertGuildSettings(db, {
    guild_id: guildId,
    alert_channel_id: channelId,
  });
}
