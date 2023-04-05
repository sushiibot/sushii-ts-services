import dotenv from "dotenv";
import { GraphQLError } from "graphql";
import Context from "./context";
import SushiiSDK from "./api";
import Metrics from "./metrics";
import { getSdkWebsocket, getWsClient } from "./graphqlClient";

describe("SushiiSDK", () => {
  let sushiiSDK: SushiiSDK;

  beforeAll(() => {
    dotenv.config();

    const wsClient = getWsClient();
    const wsSdk = getSdkWebsocket(wsClient);

    const ctx = new Context(new Metrics(), wsSdk);

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
    try {
      await sushiiSDK.sdk.createUser({ id: "1234" });
    } catch (e) {
      expect(e).toBeInstanceOf(Object);
      expect((e as GraphQLError).message).toBe(
        'duplicate key value violates unique constraint "users_pkey"'
      );
    }
  });
});
