import { ClientError } from "graphql-request";

const NO_VALUES_DELETED_MSG = "No values were deleted in collection";

export function isGraphQLError(err: unknown): err is ClientError {
  return err instanceof ClientError;
}

export function isNoValuesDeletedError(err: unknown): boolean {
  if (!isGraphQLError(err)) {
    return false;
  }

  return !!err.response.errors?.at(0)?.message.includes(NO_VALUES_DELETED_MSG);
}

export function isUniqueViolation(err: unknown): boolean {
  if (!isGraphQLError(err)) {
    return false;
  }

  const exception = err.response.errors?.at(0)?.extensions?.exception;

  if (!exception) {
    return false;
  }

  if (typeof exception !== "object") {
    return false;
  }

  return (exception as any).errcode === "23505";
}
