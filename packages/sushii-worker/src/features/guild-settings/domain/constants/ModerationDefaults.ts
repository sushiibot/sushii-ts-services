/**
 * Default DM text messages for moderation actions.
 * These are used when guild-specific custom messages are not configured.
 */
export const MODERATION_DM_DEFAULTS = {
  TIMEOUT_DM_TEXT: "You have been timed out.",
  WARN_DM_TEXT: "You have received a warning.",
  BAN_DM_TEXT: "You have been banned.",
} as const;
