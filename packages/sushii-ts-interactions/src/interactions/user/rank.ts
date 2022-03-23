import { SlashCommandBuilder } from "@discordjs/builders";
import { APIChatInputApplicationCommandInteraction } from "discord-api-types/v9";
import Context from "../../context";
import getInvokerUser from "../../utils/interactions";
import { SlashCommandHandler } from "../handlers";
import CommandInteractionOptionResolver from "../resolver";
import { getUserRank } from "./rank.service";

export default class RankCommand extends SlashCommandHandler {
  serverOnly = true;

  command = new SlashCommandBuilder()
    .setName("rank")
    .setDescription("View your or another user's rank.")
    .addUserOption((o) =>
      o.setName("user").setDescription("Who's rank to view.").setRequired(false)
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

    const target = options.getUser("user") || getInvokerUser(interaction);

    const res = await getUserRank(ctx, interaction, target);

    await ctx.REST.interactionReply(
      interaction,
      {
        attachments: [
          {
            id: "0",
            filename: "rank.png",
          },
        ],
      },
      [
        {
          fileName: "rank.png",
          fileData: Buffer.from(res.rankBuffer),
        },
      ]
    );
  }
}
