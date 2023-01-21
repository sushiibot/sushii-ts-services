import buildChunks from "./buildChunks";

describe("buildChunks", () => {
  describe.each([
    {
      name: "single chunk",
      strings: ["a", "b", "c"],
      joiner: " ",
      maxChunkLength: 5,
      wantChunks: ["a b c"],
    },
    {
      name: "multiple chunks",
      strings: ["a", "b", "cccc"],
      joiner: " ",
      maxChunkLength: 5,
      wantChunks: ["a b", "cccc"],
    },
    {
      name: "large single chunk",
      strings: [
        "aaaaaaaaaa",
        "bbbbbbbbbb",
        "cccccccccc",
        "dddddddddd",
        "eeeeeeeeee",
      ],
      joiner: " ",
      maxChunkLength: 60,
      wantChunks: ["aaaaaaaaaa bbbbbbbbbb cccccccccc dddddddddd eeeeeeeeee"],
    },
    {
      name: "large multiple chunks",
      strings: [
        "aaaaaaaaaa",
        "bbbbbbbbbb",
        "cccccccccc",
        "dddddddddd",
        "eeeeeeeeee",
      ],
      joiner: " ",
      maxChunkLength: 25,
      wantChunks: [
        "aaaaaaaaaa bbbbbbbbbb",
        "cccccccccc dddddddddd",
        "eeeeeeeeee",
      ],
    },
  ])("buildChunks", ({ name, strings, joiner, maxChunkLength, wantChunks }) => {
    test(name, () => {
      const chunks = buildChunks(strings, joiner, maxChunkLength);

      expect(chunks).toEqual(wantChunks);
    });
  });
});
