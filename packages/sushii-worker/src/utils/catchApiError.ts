import { DiscordAPIError } from "discord.js";
import { Err, Ok, Result } from "ts-results";

type ReturnPromiseType<T extends (...args: any) => Promise<any>> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : any;

const catchApiError = async <F extends (...args: any[]) => any>(
  f: F,
  ...args: Parameters<F>
): Promise<Result<ReturnPromiseType<F>, DiscordAPIError>> => {
  try {
    return Ok(await f(...args));
  } catch (e) {
    if (e instanceof DiscordAPIError) {
      return Err(e);
    }

    throw e;
  }
};

export default catchApiError;
