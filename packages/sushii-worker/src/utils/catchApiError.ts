import { DiscordAPIError } from "discord.js";
import { Err, Ok, Result } from "ts-results";

export default async function catchApiError<T>(
  f: () => Promise<T>
): Promise<Result<T, DiscordAPIError>> {
  try {
    return Ok(await f());
  } catch (e) {
    if (e instanceof DiscordAPIError) {
      return Err(e);
    }

    throw e;
  }
}
