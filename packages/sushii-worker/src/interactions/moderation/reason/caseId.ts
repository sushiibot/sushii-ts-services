import Context from "../../../model/context";
import db from "../../../model/db";

type CaseRange = {
  type: "range";
  startId: number;
  // This can be undefined when the user is still typing it in autocomplete.
  // It is useful to determine which cases to show in autocomplete.
  endId: number | undefined;
};

type CaseSingle = {
  type: "single";
  id: number;
};

type CaseLatest = {
  type: "latest";
  count: number;
};

export type CaseSpec = CaseRange | CaseSingle | CaseLatest;

export function caseSpecCount(cs: CaseSpec): number | undefined {
  switch (cs.type) {
    case "latest": {
      return cs.count;
    }
    case "range": {
      if (!cs.endId) {
        return;
      }

      return cs.endId - cs.startId;
    }
    case "single": {
      return 1;
    }
  }
}

export function parseCaseId(
  rawValue: string,
  ignoreRangeOrder: boolean = false,
): CaseSpec | undefined {
  // Get the case range from the autocomplete value, otherwise it's just
  // the current value
  const value = rawValue.split(":")[0];

  // 10-15 range, must require both start and end
  const rangeSplit = value.split("-");
  if (rangeSplit.length >= 2) {
    const [start, end] = rangeSplit;

    // If first value is empty, second one is fine to be empty.
    // "100-" == ["100", ""]
    if (!start) {
      return;
    }

    let startId = parseInt(start, 10);

    // If start is NaN, invalid range
    if (Number.isNaN(startId)) {
      return;
    }

    // No end value, and startId is correct return range with endId as undefined
    if (!end) {
      return {
        type: "range",
        startId,
        endId: undefined,
      };
    }

    // Now endId is non-empty, so we make sure this is a valid number
    let endId = parseInt(end, 10);
    if (Number.isNaN(endId)) {
      return;
    }

    // Make sure start is less than end, swap values if not
    // Only do this if ensureRangeOrder is false, since we might not want to
    // actually swap them when the user is still typing it in autocomplete
    if (!ignoreRangeOrder && startId > endId) {
      [startId, endId] = [endId, startId];
    }

    return {
      type: "range",
      startId,
      endId,
    };
  }

  // Parse it afterwards to make sure it's a valid number and without - at the start or end
  const caseId = parseInt(value, 10);
  if (!Number.isNaN(caseId) && caseId >= 0) {
    return {
      type: "single",
      id: caseId,
    };
  }

  // Latest only single case, default to 1 even if ~ is provided
  if (value === "latest" || value === "latest~") {
    return {
      type: "latest",
      count: 1,
    };
  }

  // Latest with count
  if (value.startsWith("latest~")) {
    const count = parseInt(value.slice(7), 10);

    if (Number.isNaN(count)) {
      return;
    }

    return {
      type: "latest",
      count,
    };
  }
}

export async function getCaseRange(
  ctx: Context,
  guildId: string,
  caseSpec: CaseSpec,
  validate: boolean = true,
): Promise<[number, number] | undefined> {
  switch (caseSpec.type) {
    case "single": {
      if (validate) {
        const { modLogByGuildIdAndCaseId } = await ctx.sushiiAPI.sdk.getModLog({
          guildId,
          caseId: caseSpec.id.toString(),
        });

        // Early pre-check for single case updates
        if (!modLogByGuildIdAndCaseId) {
          return;
        }
      }

      return [caseSpec.id, caseSpec.id];
    }
    case "range": {
      if (!caseSpec.endId) {
        return;
      }

      return [caseSpec.startId, caseSpec.endId];
    }
    case "latest": {
      const nextCaseId = await db.getNextCaseId(guildId);

      const latestCaseId = nextCaseId - 1;
      const caseStartId = latestCaseId - caseSpec.count + 1;

      return [caseStartId, latestCaseId];
    }
  }
}
