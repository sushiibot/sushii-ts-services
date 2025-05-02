import { parseCommand } from "./TextCommand";

describe("parseCommand", () => {
  it("should return null if command is empty", () => {
    const prefix = "!";
    const content = "!";

    const result = parseCommand(prefix, content);

    expect(result).toBeNull();
  });

  it("should parse command and arguments correctly", () => {
    const prefix = "!";
    const content = "!command arg1 arg2";

    const result = parseCommand(prefix, content);

    expect(result).toEqual({
      command: "command",
      args: ["arg1", "arg2"],
    });
  });

  it("should match prefix", () => {
    const prefix = "!";
    const content = "?command arg1 arg2";

    const result = parseCommand(prefix, content);

    expect(result).toBeNull();
  });

  it("should trim the command and arguments", () => {
    const prefix = "!";
    const content = "   !command   arg1   arg2   ";

    const result = parseCommand(prefix, content);

    expect(result).toEqual({
      command: "command",
      args: ["arg1", "arg2"],
    });
  });
});
