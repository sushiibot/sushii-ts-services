import SushiiEmoji from "../../../constants/SushiiEmoji";
import { getRadioButton } from "./settings";

type TestSelection = "option1" | "option2" | "option3";

describe("getRadioButton", () => {
  it("returns the correct emoji for the selected radio button", () => {
    const selectedValue: TestSelection = "option1";
    const choiceValue: TestSelection = "option1";

    const expectedEmoji = SushiiEmoji.RadioOn;

    const result = getRadioButton(selectedValue, choiceValue);

    expect(result).toEqual(expectedEmoji);
  });

  it("returns the correct emoji for an unselected radio button", () => {
    const selectedValue: TestSelection = "option1";
    const choiceValue: TestSelection = "option2";

    const expectedEmoji = SushiiEmoji.RadioOff;

    const result = getRadioButton(selectedValue, choiceValue);

    expect(result).toEqual(expectedEmoji);
  });
});
