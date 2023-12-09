import { User } from "discord.js";
import { TypedEmitter } from "./TypedEmitter";

type BanPoolEventMap = {
  poolAdd: {
    poolName: string;
    ownerGuildId: string;
    sourceGuildId: string;
    user: User;
  };
  poolRemove: {
    poolName: string;
    ownerGuildId: string;
    sourceGuildId: string;
    user: User;
  };
};

export const banPoolEmitter = new TypedEmitter<BanPoolEventMap>();
