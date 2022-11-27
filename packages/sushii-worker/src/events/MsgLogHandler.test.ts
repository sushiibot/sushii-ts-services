import { GatewayDispatchEvents } from "discord.js";
import { MsgLogBlockType } from "../generated/graphql";
import { isChannelIgnored } from "./MsgLogHandler";

describe("MsgLogHandler", () => {
  describe.each([
    // All
    {
      blockType: MsgLogBlockType.All,
      eventType: GatewayDispatchEvents.MessageDelete,
      wantBlocked: true,
    },
    {
      blockType: MsgLogBlockType.All,
      eventType: GatewayDispatchEvents.MessageUpdate,
      wantBlocked: true,
    },
    {
      blockType: MsgLogBlockType.All,
      eventType: GatewayDispatchEvents.MessageDeleteBulk,
      wantBlocked: true,
    },
    // Deletes
    {
      blockType: MsgLogBlockType.Deletes,
      eventType: GatewayDispatchEvents.MessageDelete,
      wantBlocked: true,
    },
    {
      blockType: MsgLogBlockType.Deletes,
      eventType: GatewayDispatchEvents.MessageDeleteBulk,
      wantBlocked: true,
    },
    {
      blockType: MsgLogBlockType.Deletes,
      eventType: GatewayDispatchEvents.MessageUpdate,
      wantBlocked: false,
    },
    // Edits
    {
      blockType: MsgLogBlockType.Edits,
      eventType: GatewayDispatchEvents.MessageDelete,
      wantBlocked: false,
    },
    {
      blockType: MsgLogBlockType.Edits,
      eventType: GatewayDispatchEvents.MessageDeleteBulk,
      wantBlocked: false,
    },
    {
      blockType: MsgLogBlockType.Edits,
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
