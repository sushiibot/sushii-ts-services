import { Permissions } from "discord-api-types/v10";

export function hasPermission(permissions: string, has: bigint): boolean {
  return (BigInt(permissions) & has) === has;
}

export function addPermission(
  permissions: Permissions,
  add: bigint
): Permissions {
  return (BigInt(permissions) | add).toString();
}
