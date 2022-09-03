import "../dayjs";

import parseEmoji from "./parseEmoji";

describe("parseEmoji", () => {
  describe.each([
    {
      emojiStr: "<a:ajenniechew:395937281279787028>",
      expectedEmoji: {
        animated: true,
        id: "395937281279787028",
        name: "ajenniechew",
      },
    },
    {
      emojiStr: "<:JennieRawr:816418604140199976>",
      expectedEmoji: {
        animated: false,
        id: "816418604140199976",
        name: "JennieRawr",
      },
    },
    {
      emojiStr: "🐱",
      expectedEmoji: {
        animated: undefined,
        id: null,
        name: "🐱",
      },
    },
  ])("parseDuration($emojiStr)", ({ emojiStr, expectedEmoji }) => {
    test(`parses emoji ${emojiStr}`, () => {
      const emoji = parseEmoji(emojiStr);

      expect(emoji).toEqual(expectedEmoji);
    });
  });
});
