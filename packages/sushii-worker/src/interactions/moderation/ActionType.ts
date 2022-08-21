export enum ActionType {
  Ban,
  BanRemove,
  Kick,
  Timeout,
  TimeoutRemove,
  TimeoutAdjust,
  Warn,
}

export namespace ActionType {
  export function toString(action: ActionType): string {
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
    }
  }
}
