import "../dayjs";

import dayjs from "dayjs";
import parseDuration from "./parseDuration";

describe("parseDuration", () => {
  describe.each([
    {
      durationString: "1s",
      expectedDuration: dayjs.duration({ seconds: 1 }),
    },
    {
      durationString: "5 seconds",
      expectedDuration: dayjs.duration({ seconds: 5 }),
    },
    {
      durationString: "3 hours 20 minutes",
      expectedDuration: dayjs.duration({ hours: 3, minutes: 20 }),
    },
    {
      durationString: "not a valid duration",
      expectedDuration: dayjs.duration({ milliseconds: 0 }),
    },
  ])(
    "parseDuration($durationString)",
    ({ durationString, expectedDuration }) => {
      test(`parses custom ID ${durationString}`, () => {
        const dur = parseDuration(durationString);

        if (dur === null) {
          expect(dur).toEqual(expectedDuration);
        } else {
          expect(dur.milliseconds()).toEqual(expectedDuration.milliseconds());
        }
      });
    }
  );
});
