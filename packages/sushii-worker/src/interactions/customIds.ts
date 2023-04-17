import {
  match,
  compile,
  MatchFunction,
  PathFunction,
  MatchResult,
} from "path-to-regexp";
import { ActionType } from "./moderation/ActionType";

enum Paths {
  RoleMenuButton = "/rolemenu/button/:roleId",
  RoleMenuSelect = "/rolemenu/select",
  RoleMenuAddRolesSelect = "/rolemenu/addRoles/select",
  ModerationAction = "/moderation/action/:actionType/:targetId",
  ModLogReason = "/modlog/reason/:caseId",
  ReasonConfirmButton = "reason_confirm/:userId/:buttonId/:action",
}

type PathParams<T extends Paths> = T extends Paths.RoleMenuButton
  ? {
      roleId: string;
    }
  : T extends Paths.RoleMenuSelect
  ? {
      // No params
    }
  : T extends Paths.RoleMenuAddRolesSelect
  ? {
      // /rolemenu addroles - No params since it is select menu
    }
  : T extends Paths.ModerationAction
  ? {
      actionType: ActionType;
      targetId: string;
    }
  : T extends Paths.ModLogReason
  ? {
      caseId: string;
    }
  : T extends Paths.ReasonConfirmButton
  ? {
      userId: string;
      buttonId: string;
      action: "override" | "empty" | "cancel";
    }
  : never;

/**
 * Returns a function that returns null if the match fails or the params.
 *
 * @param fn
 * @returns
 */
function paramsOrNull<T extends object>(
  fn: MatchFunction<T>
): (path: string) => MatchResult<T>["params"] | null {
  return (path: string) => {
    const result = fn(path);

    if (!result) {
      return null;
    }

    return result.params;
  };
}

interface CustomIDPath<T extends object> {
  path: string;
  match: MatchFunction<T>;
  matchParams: (path: string) => MatchResult<T>["params"] | null;
  compile: PathFunction<T>;
}

function createCustomID<T extends Paths>(path: T): CustomIDPath<PathParams<T>> {
  const m = match<PathParams<T>>(path);

  return {
    path,
    match: m,
    matchParams: paramsOrNull<PathParams<T>>(m),
    compile: compile<PathParams<T>>(path),
  };
}

const customIds = {
  roleMenuButton: createCustomID(Paths.RoleMenuButton),
  roleMenuSelect: createCustomID(Paths.RoleMenuSelect),
  roleMenuAddRolesSelect: createCustomID(Paths.RoleMenuAddRolesSelect),
  lookupButton: createCustomID(Paths.ModerationAction),
  modLogReason: createCustomID(Paths.ModLogReason),
  reasonConfirmButton: createCustomID(Paths.ReasonConfirmButton),
};

export default customIds;
