import { XpAmount } from "../value-objects/XpAmount";
import { BaseUserLevel } from "./BaseUserLevel";

export class GlobalUserLevel extends BaseUserLevel {
  static create(userId: string, totalXp: bigint | number): GlobalUserLevel {
    return new GlobalUserLevel(userId, XpAmount.from(totalXp));
  }
}
