import { buildCustomID, parseCustomID } from "./roles/RoleMenuButtonHandler";

describe("RoleMenuButtonHandler", () => {
  it("should build and parse custom ID", () => {
    const roleId = "12345";
    const customID = buildCustomID(roleId);

    expect(parseCustomID(customID)).toBe(roleId);
  });
});
