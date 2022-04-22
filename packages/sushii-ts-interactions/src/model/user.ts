import { User } from "../generated/graphql";

export default function newDefaultUser(id: string): User {
  return {
    id,
    fishies: "0",
    isPatron: false,
    lastFishies: undefined,
    lastRep: undefined,
    lastfmUsername: undefined,
    nodeId: id,
    patronEmoji: undefined,
    profileData: {},
    rep: "0",
  };
}
