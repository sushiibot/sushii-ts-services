import { ClientError } from "graphql-request";
import dotenv from "dotenv";
import { Config } from "./config";
import Context from "./context";
import SushiiSDK from "./api";
import Metrics from "./metrics";

describe.skip("SushiiSDK", () => {
  let sushiiSDK: SushiiSDK;

  beforeEach(() => {
    dotenv.config();
    const conf = new Config();
    const ctx = new Context(conf, new Metrics());

    sushiiSDK = ctx.sushiiAPI;
  });

  it("should create a new user", async () => {
    const user = await sushiiSDK.getOrCreateUser("1234");

    expect(user.id).toBe("1234");
  });

  it("should find existing user", async () => {
    const user = await sushiiSDK.getOrCreateUser("1234");
    expect(user.id).toBe("1234");

    user.fishies = "100";
    await sushiiSDK.sdk.updateUser({ id: "1234", userPatch: user });

    const userUpdated = await sushiiSDK.getOrCreateUser("1234");
    expect(userUpdated).toEqual(user);
    expect(userUpdated.fishies).toBe("100");
  });

  it("should not throw error when user not found", async () => {
    const { userById } = await sushiiSDK.sdk.userByID({ id: "100" });
    expect(userById).toBeNull();
  });

  it("should throw error creating user already exists", async () => {
    const res = sushiiSDK.sdk.createUser({ id: "1234" });
    return expect(res).rejects.toThrowError(ClientError);
  });
});
