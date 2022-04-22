import { User, Sdk } from "../generated/graphql";

type DBUser = Omit<User, "nodeId">;

export default class SushiiSDK {
  constructor(public sdk: Sdk) {}

  async getOrCreate(userId: string): Promise<DBUser> {
    const { userById } = await this.sdk.userByID({ id: userId });

    let dbUser = userById;
    if (!dbUser) {
      const { createUser } = await this.sdk.createUser({ id: userId });
      dbUser = createUser?.user;
    }

    if (!dbUser) {
      throw new Error("Failed to find or create user");
    }

    return dbUser;
  }
}
