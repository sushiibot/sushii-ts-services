import { User } from "discord.js";
import { Result } from "ts-results";

export interface UserRepository {
  cacheUser(user: User): Promise<Result<void, string>>;
}
