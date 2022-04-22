import { GraphQLClient } from "graphql-request";
import { getSdk } from "../generated/graphql";
import SushiiSDK from "./api";

describe("SushiiSDK", () => {
  let graphqlClient: GraphQLClient;
  let sushiiSDK: SushiiSDK;

  beforeEach(() => {
    graphqlClient = new GraphQLClient("http://localhost:8080/graphql");

    sushiiSDK = new SushiiSDK(getSdk(graphqlClient));
  });

  it("should create a new user", async () => {
    const user = await sushiiSDK.getOrCreate("1234");

    expect(user.id).toBe("1234");
  });

  it("should find existing user", async () => {
    const user = await sushiiSDK.getOrCreate("1234");
    expect(user.id).toBe("1234");

    user.fishies = "100";
    await sushiiSDK.sdk.updateUser({ id: "1234", userPatch: user });

    const userUpdated = await sushiiSDK.getOrCreate("1234");
    expect(userUpdated).toEqual(user);
    expect(userUpdated.fishies).toBe("100");
  });

  it("should not throw error when user not found", async () => {
    const { userById } = await sushiiSDK.sdk.userByID({ id: "100" });
    expect(userById).toBeNull();
  });

  it("should not throw error creating user already exists", async () => {
    const res = sushiiSDK.sdk.createUser({ id: "1234" });
    return expect(res).rejects.toThrowError();
  });
});
