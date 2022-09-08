export enum ActionType {
  Ban = "ban",
  BanRemove = "unban",
  Kick = "kick",
  Timeout = "timeout",
  TimeoutRemove = "remove timeout",
  TimeoutAdjust = "adjust timeout",
  Warn = "warn",
  Note = "note",
  History = "history",
  Lookup = "lookup",
}

export namespace ActionType {
  export function toModLogString(action: ActionType): string {
    switch (action) {
      case ActionType.Ban:
        return "ban";
      case ActionType.BanRemove:
        return "unban";
      case ActionType.Kick:
        return "kick";
      case ActionType.Timeout:
        return "timeout";
      case ActionType.TimeoutRemove:
        return "timeout_remove";
      case ActionType.TimeoutAdjust:
        return "timeout_adjust";
      case ActionType.Warn:
        return "warn";
      case ActionType.Note:
        return "note";
      default:
        throw new Error("Action type not supported for mod log");
    }
  }

  export function fromString(s: string): ActionType {
    switch (s) {
      case "ban":
        return ActionType.Ban;
      case "unban":
        return ActionType.BanRemove;
      case "kick":
        return ActionType.Kick;
      case "warn":
        return ActionType.Warn;
      case "timeout":
      case "mute": // Legacy name
        return ActionType.Timeout;
      case "timeout_remove":
      case "unmute": // Legacy name
        return ActionType.TimeoutRemove;
      case "timeout_adjust":
        return ActionType.TimeoutAdjust;
      case "history":
        return ActionType.History;
      case "lookup":
        return ActionType.Lookup;
      case "note":
        return ActionType.Note;
      default:
        throw new Error(`Invalid action ${s}`);
    }
  }

  export function toPresentTense(action: ActionType): string {
    switch (action) {
      case ActionType.Ban:
        return "banning";
      case ActionType.BanRemove:
        return "unbanning";
      case ActionType.Kick:
        return "kicking";
      case ActionType.Timeout:
        return "timing out";
      case ActionType.TimeoutRemove:
        return "removing time out for";
      case ActionType.TimeoutAdjust:
        return "changing timeout duration for";
      case ActionType.Warn:
        return "warning";
      case ActionType.Note:
        return "adding note for";
      case ActionType.History:
        return "getting history for";
      case ActionType.Lookup:
        return "looking up";
    }
  }

  export function toPastTense(action: ActionType): string {
    switch (action) {
      case ActionType.Ban:
        return "banned"; // banned user
      case ActionType.BanRemove:
        return "unbanned";
      case ActionType.Kick:
        return "kicked"; // kicked user
      case ActionType.Timeout:
        return "timed out"; // timed out user
      case ActionType.TimeoutRemove:
        return "timeout removed for"; // timeout removed for user
      case ActionType.TimeoutAdjust:
        return "changed timeout duration for"; // timeout duration changed for user
      case ActionType.Warn:
        return "warned";
      case ActionType.Note:
        return "added note for";
      case ActionType.History:
        return "got history for";
      case ActionType.Lookup:
        return "looked up";
    }
  }

  export function toEmoji(action: ActionType): string {
    switch (action) {
      case ActionType.Ban:
        return "🔨";
      case ActionType.BanRemove:
        return "🔓";
      case ActionType.Kick:
        return "👢";
      case ActionType.Timeout:
        return "🔇";
      case ActionType.TimeoutRemove:
        return "🔉";
      case ActionType.TimeoutAdjust:
        return "⏲️";
      case ActionType.Warn:
        return "⚠️";
      case ActionType.Note:
        return "📝";
      case ActionType.History:
        return "📜";
      case ActionType.Lookup:
        return "🔍";
    }
  }
}
