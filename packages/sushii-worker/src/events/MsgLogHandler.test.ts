import { GatewayDispatchEvents } from "discord.js";
import { isChannelIgnored } from "./msglog/MsgLogHandler";

describe("MsgLogHandler", () => {
  describe.each<{
    blockType: "all" | "deletes" | "edits";
    eventType: GatewayDispatchEvents;
    wantBlocked: boolean;
  }>([
    // All
    {
      blockType: "all",
      eventType: GatewayDispatchEvents.MessageDelete,
      wantBlocked: true,
    },
    {
      blockType: "all",
      eventType: GatewayDispatchEvents.MessageUpdate,
      wantBlocked: true,
    },
    {
      blockType: "all",
      eventType: GatewayDispatchEvents.MessageDeleteBulk,
      wantBlocked: true,
    },
    // Deletes
    {
      blockType: "deletes",
      eventType: GatewayDispatchEvents.MessageDelete,
      wantBlocked: true,
    },
    {
      blockType: "deletes",
      eventType: GatewayDispatchEvents.MessageDeleteBulk,
      wantBlocked: true,
    },
    {
      blockType: "deletes",
      eventType: GatewayDispatchEvents.MessageUpdate,
      wantBlocked: false,
    },
    // Edits
    {
      blockType: "edits",
      eventType: GatewayDispatchEvents.MessageDelete,
      wantBlocked: false,
    },
    {
      blockType: "edits",
      eventType: GatewayDispatchEvents.MessageDeleteBulk,
      wantBlocked: false,
    },
    {
      blockType: "edits",
      eventType: GatewayDispatchEvents.MessageUpdate,
      wantBlocked: true,
    },
  ])("isChannelIgnored", ({ eventType, blockType, wantBlocked }) => {
    test("should return true if channel is blocked", () => {
      const isBlocked = isChannelIgnored(eventType, blockType);

      expect(isBlocked).toBe(wantBlocked);
    });
  });
});
