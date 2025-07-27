import { describe, expect, test } from "bun:test";

import { MessageParser } from "./MessageParser";

describe("MessageParser", () => {
  test("extracts keywords from message", () => {
    const keywords = MessageParser.extractKeywords("Hello world test");

    expect(keywords).toContain("hello");
    expect(keywords).toContain("world");
    expect(keywords).toContain("test");
  });

  test("filters empty words", () => {
    const keywords = MessageParser.extractKeywords("hello   world");

    expect(keywords).not.toContain("");
    expect(keywords).toContain("hello");
    expect(keywords).toContain("world");
  });

  test("detects keyword in message", () => {
    const contains = MessageParser.containsKeyword("Hello world", "world");

    expect(contains).toBe(true);
  });

  test("does not detect missing keyword", () => {
    const contains = MessageParser.containsKeyword("Hello world", "test");

    expect(contains).toBe(false);
  });
});
