// Search option names
export const NAME_STARTS_WITH = "name_starts_with";
export const NAME_CONTAINS = "name_contains";

// Timeout configurations (in milliseconds)
export const EDIT_INTERFACE_TIMEOUT = 2 * 60 * 1000; // 2 minutes
export const DELETE_CONFIRMATION_TIMEOUT = 1 * 60 * 1000; // 1 minute
export const MODAL_SUBMISSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes

// Component custom IDs
export const CUSTOM_IDS = {
  EDIT_CONTENT: "edit_content",
  RENAME: "rename",
  DELETE: "delete",
  CONFIRM_DELETE: "confirm_delete",
  CANCEL_DELETE: "cancel_delete",
} as const;

// Modal custom IDs
export const MODAL_IDS = {
  EDIT_CONTENT: "edit_content_modal",
  RENAME: "rename_modal",
} as const;

// Modal field custom IDs
export const MODAL_FIELDS = {
  CONTENT: "content",
  NEW_NAME: "new_name",
} as const;
