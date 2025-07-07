import "@/core/shared/dayjs";
import { describe, expect, test } from "bun:test";

import parseEmoji from "./parseEmoji";

describe("parseEmoji", () => {
  describe.each([
    {
      emojiStr: "    <a:ajenniechew:395937281279787028>     ",
      expectedEmoji: {
        emoji: {
          animated: true,
          id: "395937281279787028",
          name: "ajenniechew",
        },
        string: "<a:ajenniechew:395937281279787028>",
      },
    },
    {
      emojiStr: "asdfasdf <:JennieRawr:816418604140199976> mewow",
      expectedEmoji: {
        emoji: {
          animated: false,
          id: "816418604140199976",
          name: "JennieRawr",
        },
        string: "<:JennieRawr:816418604140199976>",
      },
    },
    {
      emojiStr: "🐱",
      expectedEmoji: {
        emoji: {
          animated: undefined,
          id: null,
          name: "🐱",
        },
        string: "🐱",
      },
    },
  ])("parseDuration($emojiStr)", ({ emojiStr, expectedEmoji }) => {
    test(`parses emoji ${emojiStr}`, () => {
      const emoji = parseEmoji(emojiStr);

      expect(emoji).toEqual(expectedEmoji);
    });
  });
});
