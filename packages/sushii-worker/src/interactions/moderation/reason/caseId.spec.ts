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
  ])("parseCaseId($giveStrValue)", ({ giveStrValue, wantCaseSpec }) => {
    test("should return the correct CaseSpec", () => {
      expect(parseCaseId(giveStrValue)).toEqual(wantCaseSpec);
    });
  });
});
