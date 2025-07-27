export type DMChoice = "yes_dm" | "no_dm" | "unspecified";

export function dmChoiceFromString(value: string | null): DMChoice {
  if (!value) {
    return "unspecified";
  }

  switch (value.toLowerCase()) {
    case "yes_dm":
      return "yes_dm";
    case "no_dm":
      return "no_dm";
    default:
      throw new Error(`Invalid DM choice: ${value}`);
  }
}
