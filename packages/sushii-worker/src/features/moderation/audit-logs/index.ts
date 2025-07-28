export * from "./domain";
export * from "./application";
export * from "./infrastructure";
export * from "./presentation";

// Legacy compatibility functions
import { ActionType } from "@/features/moderation/shared/domain/value-objects/ActionType";
import { ModerationCase } from "@/features/moderation/shared/domain/entities/ModerationCase";
import { ModLogComponents } from "./domain/entities/ModLogComponents";

/**
 * Legacy compatibility function for buildModLogComponents.
 * @deprecated Use ModLogComponents class directly instead.
 */
export function buildModLogComponents(
  actionType: ActionType,
  modCase: ModerationCase,
  dmDeleted: boolean = false,
) {
  return new ModLogComponents(actionType, modCase, dmDeleted).build();
}