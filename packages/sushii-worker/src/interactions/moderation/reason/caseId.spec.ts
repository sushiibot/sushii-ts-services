import { CaseSpec, parseCaseId } from "./caseId";

describe("parseCaseId", () => {
  describe.each<{
    giveStrValue: string;
    wantCaseSpec: CaseSpec | undefined;
  }>([
    {
      giveStrValue: "10-20",
      wantCaseSpec: {
        type: "range",
        startId: 10,
        endId: 20,
      },
    },
    {
      giveStrValue: "20-10",
      wantCaseSpec: {
        type: "range",
        startId: 10,
        endId: 20,
      },
    },
    {
      giveStrValue: "10-",
      wantCaseSpec: {
        type: "range",
        startId: 10,
        endId: undefined,
      },
    },
    {
      giveStrValue: "-10",
      wantCaseSpec: undefined,
    },
    {
      giveStrValue: "latest",
      wantCaseSpec: {
        type: "latest",
        count: 1,
      },
    },
    {
      giveStrValue: "latest~",
      wantCaseSpec: {
        type: "latest",
        count: 1,
      },
    },
    {
      giveStrValue: "latest~1",
      wantCaseSpec: {
        type: "latest",
        count: 1,
      },
    },
    {
      giveStrValue: "latest~10",
      wantCaseSpec: {
        type: "latest",
        count: 10,
      },
    },
    {
      giveStrValue: "70~",
      wantCaseSpec: {
        type: "single",
        id: 70,
      },
    },
    {
      giveStrValue: "80: ban username#1234 - reason",
      wantCaseSpec: {
        type: "single",
        id: 80,
      },
    },
    {
      giveStrValue: "80-85: ban username#1234 - reason",
      wantCaseSpec: {
        type: "range",
        startId: 80,
        endId: 85,
      },
    },
    {
      giveStrValue: "latest: ban username#1234 - reason",
      wantCaseSpec: {
        type: "latest",
        count: 1,
      },
    },
    {
      giveStrValue: "latest~5: ban username#1234 - reason",
      wantCaseSpec: {
        type: "latest",
        count: 5,
      },
    },
  ])("parseCaseId($giveStrValue)", ({ giveStrValue, wantCaseSpec }) => {
    test("should return the correct CaseSpec", () => {
      expect(parseCaseId(giveStrValue)).toEqual(wantCaseSpec);
    });
  });
});
