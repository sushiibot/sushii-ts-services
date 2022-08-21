import { SlashCommandBuilder, EmbedBuilder } from "@discordjs/builders";
import { isDayjs } from "dayjs";
import { APIChatInputApplicationCommandInteraction } from "discord-api-types/v10";
import i18next from "i18next";
import Context from "../../model/context";
import Color from "../../utils/colors";
import getInvokerUser from "../../utils/interactions";
import { SlashCommandHandler } from "../handlers";
import CommandInteractionOptionResolver from "../resolver";
import { fishyForUser } from "./fishy.service";

export default class FishyCommand extends SlashCommandHandler {
  serverOnly = true;

  command = new SlashCommandBuilder()
    .setName("fishy")
    .setDescription("Catch some fish!")
    .addUserOption((o) =>
      o
        .setName("user")
        .setDescription("Who to fishy for or yourself if you have no friends")
        .setRequired(true)
    )
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandInteraction
  ): Promise<void> {
    const options = new CommandInteractionOptionResolver(
      interaction.data.options,
      interaction.data.resolved
    );

    const invoker = getInvokerUser(interaction);

    const target = options.getUser("user");
    if (!target) {
      throw new Error("fishy missing user");
    }

    const res = await fishyForUser(ctx, interaction, invoker, target);

    let embed = new EmbedBuilder();
    if (isDayjs(res)) {
      embed = embed.setColor(Color.Error).setDescription(
        i18next.t("fishy.cooldown", {
          ns: "commands",
          nextFishyTimestamp: res.unix(),
        })
      );
    } else {
      embed = embed.setColor(Color.Success).setDescription(
        i18next.t("fishy.success", {
          ns: "commands",
          caughtType: res.caughtType,
          username: target.username,
          count: res.caughtAmount,
          oldAmount: res.oldAmount,
          newAmount: res.newAmount,
        })
      );
    }

    await ctx.REST.interactionReply(interaction, {
      embeds: [embed.toJSON()],
    });
  }
}
