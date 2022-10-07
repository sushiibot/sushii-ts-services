import { SlashCommandBuilder } from "@discordjs/builders";
import { isGuildInteraction } from "discord-api-types/utils/v10";
import { APIChatInputApplicationCommandInteraction } from "discord-api-types/v10";
import Context from "../../model/context";
import getInvokerUser from "../../utils/interactions";
import { SlashCommandHandler } from "../handlers";
import CommandInteractionOptionResolver from "../resolver";
import {
  interactionReplyErrorMessage,
  interactionReplyErrorPlainMessage,
} from "../responses/error";
import { getUserRank } from "./rank.service";

export default class RankCommand extends SlashCommandHandler {
  serverOnly = true;

  command = new SlashCommandBuilder()
    .setName("rank")
    .setDescription("View your or another user's rank.")
    .addUserOption((o) =>
      o.setName("user").setDescription("Whose rank to view.").setRequired(false)
    )
    .toJSON();

  // eslint-disable-next-line class-methods-use-this
  async handler(
    ctx: Context,
    interaction: APIChatInputApplicationCommandInteraction
  ): Promise<void> {
    if (!isGuildInteraction(interaction)) {
      throw new Error("Guild missing");
    }

    const ackRes = await ctx.REST.interactionReplyDeferred(interaction);
    if (ackRes.err) {
      await interactionReplyErrorMessage(ctx, interaction, ackRes.val.message);

      return;
    }

    const options = new CommandInteractionOptionResolver(
      interaction.data.options,
      interaction.data.resolved
    );

    const target = options.getUser("user") || getInvokerUser(interaction);

    const res = await getUserRank(
      ctx,
      interaction,
      target,
      interaction.guild_id
    );

    if (res.err) {
      await interactionReplyErrorPlainMessage(ctx, interaction, res.val);
      return;
    }

    await ctx.REST.interactionEditOriginal(
      interaction,
      {
        attachments: [
          {
            id: "0",
            filename: "rank.png",
            description: `${target.username}#${target.discriminator.padStart(
              4,
              "0"
            )}'s rank`,
          },
        ],
      },
      [
        {
          fileName: "rank.png",
          fileData: Buffer.from(res.safeUnwrap().rankBuffer),
        },
      ]
    );
  }
}
