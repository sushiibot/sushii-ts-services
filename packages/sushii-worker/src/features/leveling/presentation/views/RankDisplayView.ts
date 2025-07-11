import { ContainerBuilder, MessageFlags, TextDisplayBuilder } from "discord.js";
import { UserRankData } from "../../application/GetUserRankService";
import { InteractionReplyOptions } from "discord.js";

export function formatRankCard(data: UserRankData): InteractionReplyOptions {
  const { user, profile, guildLevel, globalLevel, rankings } = data;

  const username =
    user.discriminator === "0"
      ? user.username
      : `${user.username}#${user.discriminator.padStart(4, "0")}`;

  const guildProgressBar = guildLevel.getProgressBar().render();
  const globalProgressBar = globalLevel.getProgressBar().render();

  const allTimeRank = rankings.getAllTimeRank();

  const content = `**${username}**  
🦾 **Rep**: ${profile.getReputation()} 🐟 **Fishies**: ${profile.getFishies()}  

**Server ${guildLevel.getLevelDisplayText()}**  
${guildProgressBar}  

**Global ${globalLevel.getLevelDisplayText()}**  
${globalProgressBar}  

🏆 **Rank**: #${allTimeRank.getDisplayRank()}  
📅 **Day**: ${rankings.getDayRank().getFormattedPosition()}   **Week**: ${rankings.getWeekRank().getFormattedPosition()}   **Month**: ${rankings.getMonthRank().getFormattedPosition()}`;

  const textContent = new TextDisplayBuilder().setContent(content);

  const container = new ContainerBuilder();
  container.addTextDisplayComponents(textContent);

  return {
    components: [container],
    flags: MessageFlags.IsComponentsV2,
    allowedMentions: { parse: [] },
  };
}
