import { beforeEach, describe, expect, test } from "bun:test";
import { GuildMember, User } from "discord.js";

import { GuildConfig } from "@/features/guild-settings/domain/entities/GuildConfig";

import {
  BanAction,
  KickAction,
  NoteAction,
  TimeoutAction,
  UnbanAction,
  WarnAction,
} from "../domain/entities/ModerationAction";
import { ModerationTarget } from "../domain/entities/ModerationTarget";
import { GuildConfigRepository } from "../domain/repositories/GuildConfigRepository";
import { Duration } from "../domain/value-objects/Duration";
import { Reason } from "../domain/value-objects/Reason";
import { DMPolicyService } from "./DMPolicyService";

// Mock implementations
class MockGuildConfigRepository implements GuildConfigRepository {
  private banDmEnabled = true;
  private timeoutCommandDmEnabled = true;

  async findByGuildId(guildId: string): Promise<GuildConfig> {
    const config = GuildConfig.createDefault(guildId);
    config.moderationSettings.banDmEnabled = this.banDmEnabled;
    config.moderationSettings.timeoutCommandDmEnabled =
      this.timeoutCommandDmEnabled;
    return config;
  }

  setBanDmEnabled(enabled: boolean): void {
    this.banDmEnabled = enabled;
  }

  setTimeoutCommandDmEnabled(enabled: boolean): void {
    this.timeoutCommandDmEnabled = enabled;
  }
}

// Mock factories
function createMockUser(): User {
  return {
    id: "123456789",
    tag: "TestUser#1234",
  } as User;
}

function createMockMember(): GuildMember {
  return {
    id: "123456789",
    user: createMockUser(),
  } as GuildMember;
}

function createMockTarget(hasMember: boolean = true): ModerationTarget {
  return new ModerationTarget(
    createMockUser(),
    hasMember ? createMockMember() : null,
  );
}

function createMockReason(): Reason {
  const result = Reason.create("Test reason");
  if (!result.ok) {
    throw new Error("Failed to create reason");
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return result.val!;
}

function createMockDuration(): Duration {
  const result = Duration.create("1d");
  if (!result.ok) {
    throw new Error("Failed to create duration");
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return result.val!;
}

describe("DMPolicyService", () => {
  const mockGuildId = "123456789";
  let dmPolicyService: DMPolicyService;
  let mockGuildConfigRepository: MockGuildConfigRepository;

  beforeEach(() => {
    mockGuildConfigRepository = new MockGuildConfigRepository();
    dmPolicyService = new DMPolicyService(mockGuildConfigRepository);
  });

  describe("basic eligibility checks", () => {
    test("returns false when target has no member", async () => {
      const target = createMockTarget(false); // No member
      const action = new KickAction(
        mockGuildId,
        createMockUser(),
        createMockReason(),
        "unspecified",
      );

      const result = await dmPolicyService.shouldSendDM(
        "after",
        action,
        target,
        "guild123",
      );

      expect(result).toBe(false);
    });

    test("returns false for unsupported action types", async () => {
      const target = createMockTarget(true);
      const action = new NoteAction(
        mockGuildId,
        createMockUser(),
        createMockReason(),
        "unspecified",
      );

      const result = await dmPolicyService.shouldSendDM(
        "after",
        action,
        target,
        "guild123",
      );

      expect(result).toBe(false);
    });
  });

  describe("timing rules", () => {
    test("returns false for non-ban actions with 'before' timing", async () => {
      const target = createMockTarget(true);
      const action = new KickAction(
        mockGuildId,
        createMockUser(),
        createMockReason(),
        "unspecified",
      );

      const result = await dmPolicyService.shouldSendDM(
        "before",
        action,
        target,
        "guild123",
      );

      expect(result).toBe(false);
    });

    test("returns false for ban actions with 'after' timing", async () => {
      const target = createMockTarget(true);
      const action = new BanAction(
        mockGuildId,
        createMockUser(),
        createMockReason(),
        "unspecified",
      );

      const result = await dmPolicyService.shouldSendDM(
        "after",
        action,
        target,
        "guild123",
      );

      expect(result).toBe(false);
    });

    test("returns true for ban actions with 'before' timing", async () => {
      const target = createMockTarget(true);
      const action = new BanAction(
        mockGuildId,
        createMockUser(),
        createMockReason(),
        "unspecified",
      );

      const result = await dmPolicyService.shouldSendDM(
        "before",
        action,
        target,
        "guild123",
      );

      expect(result).toBe(true);
    });
  });

  describe("reason requirement", () => {
    test("returns false when no reason provided", async () => {
      const target = createMockTarget(true);
      const action = new KickAction(
        mockGuildId,
        createMockUser(),
        null,
        "unspecified",
      );

      const result = await dmPolicyService.shouldSendDM(
        "after",
        action,
        target,
        "guild123",
      );

      expect(result).toBe(false);
    });
  });

  describe("warn action special case", () => {
    test("returns true for warn actions regardless of other settings", async () => {
      const target = createMockTarget(true);
      const action = new WarnAction(
        mockGuildId,
        createMockUser(),
        createMockReason(),
        "unspecified",
      );

      const result = await dmPolicyService.shouldSendDM(
        "after",
        action,
        target,
        "guild123",
      );

      expect(result).toBe(true);
    });
  });

  describe("DM choice override", () => {
    test("returns true when dmChoice is 'yes_dm'", async () => {
      const target = createMockTarget(true);
      const action = new KickAction(
        mockGuildId,
        createMockUser(),
        createMockReason(),
        "yes_dm",
      );

      const result = await dmPolicyService.shouldSendDM(
        "after",
        action,
        target,
        "guild123",
      );

      expect(result).toBe(true);
    });

    test("returns false when dmChoice is 'no_dm'", async () => {
      const target = createMockTarget(true);
      const action = new KickAction(
        mockGuildId,
        createMockUser(),
        createMockReason(),
        "no_dm",
      );

      const result = await dmPolicyService.shouldSendDM(
        "after",
        action,
        target,
        "guild123",
      );

      expect(result).toBe(false);
    });
  });

  describe("UnbanAction special case", () => {
    test("returns false for UnbanAction actions", async () => {
      const target = createMockTarget(true);
      const action = new UnbanAction(
        mockGuildId,
        createMockUser(),
        createMockReason(),
        "unspecified",
      );

      const result = await dmPolicyService.shouldSendDM(
        "after",
        action,
        target,
        "guild123",
      );

      expect(result).toBe(false);
    });
  });

  describe("guild settings fallback", () => {
    test("uses guild ban DM setting for ban actions", async () => {
      const target = createMockTarget(true);
      const action = new BanAction(
        mockGuildId,
        createMockUser(),
        createMockReason(),
        "unspecified",
      );

      // Test with ban DM enabled
      mockGuildConfigRepository.setBanDmEnabled(true);
      let result = await dmPolicyService.shouldSendDM(
        "before",
        action,
        target,
        "guild123",
      );
      expect(result).toBe(true);

      // Test with ban DM disabled
      mockGuildConfigRepository.setBanDmEnabled(false);
      result = await dmPolicyService.shouldSendDM(
        "before",
        action,
        target,
        "guild123",
      );
      expect(result).toBe(false);
    });

    test("uses guild timeout DM setting for timeout actions", async () => {
      const target = createMockTarget(true);
      const action = new TimeoutAction(
        mockGuildId,
        createMockUser(),
        createMockReason(),
        "unspecified",
        null,
        createMockDuration(),
      );

      // Test with timeout DM enabled
      mockGuildConfigRepository.setTimeoutCommandDmEnabled(true);
      let result = await dmPolicyService.shouldSendDM(
        "after",
        action,
        target,
        "guild123",
      );
      expect(result).toBe(true);

      // Test with timeout DM disabled
      mockGuildConfigRepository.setTimeoutCommandDmEnabled(false);
      result = await dmPolicyService.shouldSendDM(
        "after",
        action,
        target,
        "guild123",
      );
      expect(result).toBe(false);
    });

    test("defaults to true for other action types", async () => {
      const target = createMockTarget(true);
      const action = new KickAction(
        mockGuildId,
        createMockUser(),
        createMockReason(),
        "unspecified",
      );

      const result = await dmPolicyService.shouldSendDM(
        "after",
        action,
        target,
        "guild123",
      );

      expect(result).toBe(true);
    });
  });
});
