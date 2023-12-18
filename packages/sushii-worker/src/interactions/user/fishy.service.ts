import dayjs from "dayjs";
import { User } from "discord.js";
import { AllSelection } from "kysely/dist/cjs/parser/select-parser";
import Context from "../../model/context";
import logger from "../../logger";
import db from "../../model/db";
import { DB } from "../../model/dbTypes";
import { upsertUser } from "../../db/User/User.repository";

/**
 * Get inclusive random number between min and max
 *
 * @param min
 * @param max
 * @returns
 */
function getRandomInt(min: number, max: number): number {
  const ceilMin = Math.ceil(min);
  const floorMax = Math.floor(max);
  return Math.floor(Math.random() * (floorMax - ceilMin + 1)) + ceilMin;
}

/**
 * Get a random number from a normal distribution
 * Derived from https://stackoverflow.com/a/49434653
 *
 * @param min Minimum value
 * @param max Maximum value
 * @param skew Skew of distribution, 1 for normal distribution, < 1 to skew
 * left, > 1 to skew right
 * @returns number
 */
function randDistNumber(min: number, max: number, skew: number): number {
  let u = 0;
  let v = 0;

  // Convert [0,1) to (0,1)
  while (u === 0) {
    u = Math.random();
  }
  while (v === 0) {
    v = Math.random();
  }

  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) {
    num = randDistNumber(min, max, skew);
  } else {
    // resample between 0 and 1 if out of range
    num **= skew; // Skew
    num *= max - min; // Stretch to fill range
    num += min; // offset to min
  }

  return num;
}

/**
 * Fishy types, lower index fishies are more common and should be worth less
 */
export enum CatchableType {
  Anchovy = "anchovy",
  Salmon = "salmon",
  AtlanticSalmon = "atlantic salmon",
  Tuna = "tuna",
  Halibut = "halibut",
  SeaBass = "sea bass",
  YellowfinTuna = "yellow tuna",
  PufferFish = "puffer fishy",
  WildKingSalmon = "wild king salmon",
  SwordFish = "swordfish fish", // fish appended to end of name
  BluefinTuna = "bluefin tuna",
  // Constant probability catchable types
  Seaweed = "seaweed",
  Algae = "algae",
  // Special fishy types with custom rarities
  Golden = "golden fishy <:goldenFishy:418504966337069057>",
  Rotten = "rotten 🦴",
  MrsPuff = "Mrs. Puff 🐡", // sorry Mrs. Puff
  RustySpoon = "rusty spoon 🥄",
  // Patreon Fishies
  Gunnie = "gunnie 🔫",
  Wawa = "wawa 🍉",
  Dan = "dan",
  Crazy = "crazy fishy 🤪",
  Jae = "jae fishy",
}

const scaledTypes = [
  CatchableType.Anchovy,
  CatchableType.Salmon,
  CatchableType.AtlanticSalmon,
  CatchableType.Tuna,
  CatchableType.Halibut,
  CatchableType.SeaBass,
  CatchableType.YellowfinTuna,
  CatchableType.PufferFish,
  CatchableType.WildKingSalmon,
  CatchableType.SwordFish,
  CatchableType.BluefinTuna,
  CatchableType.Gunnie,
  CatchableType.Wawa,
];

const scaledTypeWeights = [
  100, // CatchableType.Anchovy
  70, // CatchableType.Salmon
  60, // CatchableType.AtlanticSalmon
  50, // CatchableType.Tuna
  70, // CatchableType.Halibut
  30, // CatchableType.SeaBass
  40, // CatchableType.YellowfinTuna
  20, // CatchableType.PufferFish
  70, // CatchableType.WildKingSalmon
  20, // CatchableType.SwordFish
  40, // CatchableType.BluefinTuna
  40, // CatchableType.Gunnie,
  40, // CatchableType.Wawa,
];

const normalTypes = [CatchableType.Seaweed, CatchableType.Algae];

const rareTypes = [
  CatchableType.Golden,
  CatchableType.Rotten,
  CatchableType.MrsPuff,
  CatchableType.RustySpoon,
];

function weightedRandom<T>(items: T[], weights: number[]): T {
  let i;
  const weightsCopy = weights.slice();

  for (i = 0; i < weightsCopy.length; i += 1) {
    weightsCopy[i] += weightsCopy[i - 1] || 0;
  }

  const random = Math.random() * weightsCopy[weightsCopy.length - 1];

  for (i = 0; i < weightsCopy.length; i += 1) {
    if (weightsCopy[i] > random) {
      break;
    }
  }

  return items[i];
}

/**
 * Gets a random fishy type, skewed towards lower indexed types as common
 *
 * @returns random FishyType
 */
function getRandomCatchable(): CatchableType {
  // Check fixed probability types
  const randInt = getRandomInt(0, 100);
  if (randInt < rareTypes.length) {
    return rareTypes[randInt];
  }

  if (randInt < rareTypes.length + normalTypes.length * 2) {
    return normalTypes[randInt % normalTypes.length];
  }

  return weightedRandom(scaledTypes, scaledTypeWeights);
}

export interface FishyValueRange {
  min: number;
  max: number;
  skew: number;
}

function getFishyValueRange(catchable: CatchableType): FishyValueRange {
  // Exhaustive switch statement
  // eslint-disable-next-line default-case
  switch (catchable) {
    case CatchableType.Anchovy:
      return { min: 5, max: 10, skew: 3 };
    case CatchableType.Salmon:
      return { min: 15, max: 30, skew: 3 };
    case CatchableType.Halibut:
      return { min: 10, max: 30, skew: 3 };
    case CatchableType.AtlanticSalmon:
      return { min: 20, max: 25, skew: 3 };
    case CatchableType.Tuna:
      return { min: 30, max: 80, skew: 3 };
    case CatchableType.SeaBass:
      return { min: 40, max: 50, skew: 3 };
    case CatchableType.YellowfinTuna:
      return { min: 40, max: 50, skew: 3 };
    case CatchableType.PufferFish:
      return { min: 20, max: 50, skew: 3 };
    case CatchableType.WildKingSalmon:
      return { min: 20, max: 50, skew: 3 };
    case CatchableType.SwordFish:
      return { min: 40, max: 60, skew: 3 };
    case CatchableType.BluefinTuna:
      return { min: 40, max: 70, skew: 3 };
    case CatchableType.Seaweed:
      return { min: 8, max: 15, skew: 1 };
    case CatchableType.Algae:
      return { min: 1, max: 5, skew: 1 };
    case CatchableType.Golden:
      return { min: 100, max: 400, skew: 3 };
    case CatchableType.Rotten:
      return { min: 1, max: 5, skew: 3 };
    case CatchableType.MrsPuff:
      return { min: 50, max: 80, skew: 3 };
    case CatchableType.RustySpoon:
      return { min: 1, max: 2, skew: 1 };
    // Patreon
    case CatchableType.Gunnie:
    case CatchableType.Wawa:
    case CatchableType.Dan:
    case CatchableType.Crazy:
    case CatchableType.Jae:
      return { min: 20, max: 80, skew: 2 };
  }
}

/**
 * Response value of caught fishy
 */
export interface FishyResponse {
  caughtAmount: number;
  caughtType: CatchableType;
  oldAmount: string;
  newAmount: string;
}

export async function fishyForUser(
  ctx: Context,
  invoker: User,
  target: User,
): Promise<FishyResponse | dayjs.Dayjs> {
  const dbTargetUser = await db.getUser(target.id);

  let dbInvokerUser: AllSelection<DB, "app_public.users"> | null = null;
  if (invoker.id !== target.id) {
    dbInvokerUser = await db.getUser(invoker.id);
  }

  // Invoker same as target
  let lastFishies = dayjs.utc(dbTargetUser.last_fishies);

  // If invoker different target
  if (dbInvokerUser) {
    lastFishies = dayjs.utc(dbInvokerUser.last_fishies);
  }

  const nextFishies = lastFishies.add(dayjs.duration({ hours: 12 }));
  if (nextFishies.isAfter(dayjs.utc())) {
    // Time is still before nextfishies time
    // User has already caught fishies today
    return nextFishies;
  }

  logger.debug(dbTargetUser, "target before");
  logger.debug(dbInvokerUser, "invoker before");

  // Get new fishy count
  const caughtType = getRandomCatchable();
  const valueRange = getFishyValueRange(caughtType);
  const caughtNum = Math.floor(
    randDistNumber(valueRange.min, valueRange.max, valueRange.skew),
  );

  const oldAmount = dbTargetUser.fishies;

  const newFishies = BigInt(dbTargetUser.fishies) + BigInt(caughtNum);

  // Update fishies in data
  dbTargetUser.fishies = newFishies.toString();

  // Update lastFishy timestamp for invoker
  if (dbInvokerUser) {
    // If invoker different from target, update invoker
    dbInvokerUser.last_fishies = dayjs().utc().toDate();
    // Update invoker

    await upsertUser(db, dbInvokerUser);
  } else {
    // Invoker is target, update target
    dbTargetUser.last_fishies = dayjs().utc().toDate();
  }

  logger.debug(dbTargetUser, "target after");
  logger.debug(dbInvokerUser, "invoker after");

  // Update target
  await upsertUser(db, dbTargetUser);

  return {
    caughtAmount: caughtNum,
    oldAmount,
    newAmount: newFishies.toString(),
    caughtType,
  };
}
