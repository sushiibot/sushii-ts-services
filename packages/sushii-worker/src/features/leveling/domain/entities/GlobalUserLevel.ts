import { BaseUserLevel } from "./BaseUserLevel";
import { XpAmount } from "../value-objects/XpAmount";

export class GlobalUserLevel extends BaseUserLevel {
  static create(userId: string, totalXp: bigint | number): GlobalUserLevel {
    return new GlobalUserLevel(userId, XpAmount.from(totalXp));
  }
}
