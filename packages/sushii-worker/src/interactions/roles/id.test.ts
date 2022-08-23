import { buildCustomID, parseCustomID } from "./ids";

describe("rolemenu ids", () => {
  describe.each([
    { customID: "rolemenu:", menuIDData: { requiredRoleID: undefined } },
    { customID: "rolemenu:123", menuIDData: { requiredRoleID: "123" } },
    { customID: "rolemenu:123:", menuIDData: { requiredRoleID: "123" } },
  ])("parseRoleMenuID($customID)", ({ customID, menuIDData }) => {
    test(`parses custom ID ${customID}`, () => {
      expect(parseCustomID(customID)).toEqual(menuIDData);
    });
  });

  describe.each([{ requiredRoleID: "123", customID: "rolemenu:123" }])(
    "getRoleMenuID($customID)",
    ({ customID, requiredRoleID }) => {
      test(`parses custom ID ${customID}`, () => {
        expect(buildCustomID(requiredRoleID)).toEqual(customID);
      });
    }
  );
});
