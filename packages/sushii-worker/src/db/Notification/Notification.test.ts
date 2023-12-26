import { describe, test, expect } from "bun:test";
import { stringToKeywords } from "./Notification.repository";

describe("Notification.repository", () => {
  test("stringToKeywords", () => {
    const keywords = stringToKeywords("hello   world  ");
    expect(keywords).toEqual(["hello", "world"]);
  });
});
