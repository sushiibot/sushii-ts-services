import { getRoleMenuID, parseRoleMenuID } from "./ids";

describe("rolemenu ids", () => {
  describe.each([
    { customID: "rolemenu:", menuIDData: { requiredRoleID: undefined } },
    { customID: "rolemenu:123", menuIDData: { requiredRoleID: "123" } },
    { customID: "rolemenu:123:", menuIDData: { requiredRoleID: "123" } },
  ])("parseRoleMenuID($customID)", ({ customID, menuIDData }) => {
    test(`parses custom ID ${customID}`, () => {
      expect(parseRoleMenuID(customID)).toEqual(menuIDData);
    });
  });

  describe.each([
    { requiredRoleID: "123", customID: "rolemenu:123" },
    { requiredRoleID: "", customID: "rolemenu:" },
    { requiredRoleID: undefined, customID: "rolemenu:" },
  ])("getRoleMenuID($customID)", ({ customID, requiredRoleID }) => {
    test(`parses custom ID ${customID}`, () => {
      expect(getRoleMenuID(requiredRoleID)).toEqual(customID);
    });
  });
});
