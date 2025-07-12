import { ContainerBuilder, MessageFlags, TextDisplayBuilder } from "discord.js";
import { UserRankData } from "../../application/GetUserRankService";
import { InteractionReplyOptions } from "discord.js";

export function formatRankCard(data: UserRankData): InteractionReplyOptions {
  const { user, profile, guildLevel, globalLevel, rankings } = data;

  const guildProgressBar = guildLevel.getProgressBar().render();
  const globalProgressBar = globalLevel.getProgressBar().render();

  const content = `**${user.username}**
💗 **Rep**: ${profile.getReputation().toLocaleString()}   🐟 **Fishies**: ${profile.getFishies().toLocaleString()}  

**🌟 Server Level ${guildLevel.getCurrentLevel()}**
${guildProgressBar}
-# ${guildLevel.getXpDisplayText()}

🏆 **Server Rankings**
> **All Time**: 
> \` ${rankings.getAllTimeRank().getFormattedPosition()}\`
> **Day**: 
> \` ${rankings.getDayRank().getFormattedPosition()}\`
> **Week**: 
> \` ${rankings.getWeekRank().getFormattedPosition()}\`
> **Month**: 
> \` ${rankings.getMonthRank().getFormattedPosition()}\`

**🌏 Global Level ${globalLevel.getCurrentLevel()}**  
${globalProgressBar}
-# ${globalLevel.getXpDisplayText()}
`;

  const textContent = new TextDisplayBuilder().setContent(content);

  const container = new ContainerBuilder();
  container.addTextDisplayComponents(textContent);

  return {
    components: [container],
    flags: MessageFlags.IsComponentsV2,
    allowedMentions: { parse: [] },
  };
}
