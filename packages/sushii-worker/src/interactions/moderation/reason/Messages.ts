import { EmbedBuilder } from "discord.js";
import SushiiEmoji from "../../../constants/SushiiEmoji";
import Color from "../../../utils/colors";

// eslint-disable-next-line import/prefer-default-export
export const invalidCaseRangeEmbed = new EmbedBuilder()
  .setTitle("Invalid case range")
  .setDescription(
    `The cases you provided was invalid. Here are some examples to update cases:\n\n\
${SushiiEmoji.BlueDot}A single case: \`120\` - Updates case 120\n\
${SushiiEmoji.BlueDot}A range of cases: \`120-130\` - Updates all cases including and between 120 to 130\n\
${SushiiEmoji.BlueDot}The latest case: \`latest\` - Updates the latest case\n\
${SushiiEmoji.BlueDot}Multiple latest cases: \`latest~3\` - Updates the latest 3 cases\n\n\
Note that if you are updating multiple cases, you can only update up to 25 cases at a time.\n\
If you're only updating 1 case, it may be easier to use the button in your mod log to set reasons.`
  )
  .setColor(Color.Error)
  .toJSON();
