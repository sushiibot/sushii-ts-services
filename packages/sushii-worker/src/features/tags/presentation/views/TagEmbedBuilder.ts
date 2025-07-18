import { EmbedBuilder, APIEmbedField, AttachmentBuilder } from "discord.js";
import { Tag } from "../../domain/entities/Tag";
import dayjs from "@/shared/domain/dayjs";
import Color from "@/utils/colors";
import { t } from "i18next";

export interface TagUpdateData {
  fields: APIEmbedField[];
  files: AttachmentBuilder[];
}

export function createTagInfoEmbed(tag: Tag): EmbedBuilder {
  const tagData = tag.toData();
  
  return new EmbedBuilder()
    .setTitle(t("tag.info.success.title", { ns: "commands", tagName: tagData.name }))
    .setColor(Color.Info)
    .setFields([
      {
        name: t("tag.info.success.content", { ns: "commands" }),
        value: tagData.content || "No content",
      },
      {
        name: t("tag.info.success.attachment", { ns: "commands" }),
        value: tagData.attachment || "No attachment",
      },
      {
        name: t("tag.info.success.owner", { ns: "commands" }),
        value: `<@${tagData.ownerId}>`,
      },
      {
        name: t("tag.info.success.use_count", { ns: "commands" }),
        value: tagData.useCount.toString(),
      },
    ])
    .setImage(tagData.attachment || null)
    .setTimestamp(dayjs.utc(tagData.created).toDate());
}

export function createTagSuccessEmbed(
  title: string,
  fields: APIEmbedField[],
  attachment?: string | null,
): EmbedBuilder {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setFields(fields)
    .setColor(Color.Success);

  if (attachment) {
    embed.setImage(attachment);
  }

  return embed;
}

export function createTagDeleteSuccessEmbed(tag: Tag): EmbedBuilder {
  const tagData = tag.toData();
  
  return new EmbedBuilder()
    .setTitle(t("tag.delete.success.title", { ns: "commands", tagName: tagData.name }))
    .setFields([
      {
        name: t("tag.delete.success.content", { ns: "commands" }),
        value: tagData.content || "No content",
      },
      {
        name: t("tag.delete.success.owner", { ns: "commands" }),
        value: `<@${tagData.ownerId}>`,
      },
      {
        name: t("tag.delete.success.use_count", { ns: "commands" }),
        value: tagData.useCount.toString(),
      },
    ])
    .setTimestamp(dayjs(tagData.created).toDate())
    .setColor(Color.Success);
}

export function createTagErrorEmbed(title: string, description: string): EmbedBuilder {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(Color.Error);
}

export function createTagNotFoundEmbed(tagName: string): EmbedBuilder {
  return new EmbedBuilder()
    .setDescription(t("tag.get.not_found", { ns: "commands", tagName }))
    .setColor(Color.Error);
}

export async function processTagAttachment(
  newContent: string | null,
  newAttachment: { url: string; name: string } | null,
): Promise<
  | { success: true; data: TagUpdateData }
  | { success: false; error: string }
> {
  const fields: APIEmbedField[] = [];
  const files: AttachmentBuilder[] = [];

  if (newContent) {
    fields.push({
      name: t("tag.edit.success.content", { ns: "commands" }),
      value: newContent,
    });
  }

  if (newAttachment) {
    fields.push({
      name: t("tag.edit.success.attachment", { ns: "commands" }),
      value: newAttachment.url,
    });

    try {
      const file = await fetch(newAttachment.url);
      const buf = await file.arrayBuffer();

      const attachment = new AttachmentBuilder(Buffer.from(buf)).setName(
        newAttachment.name,
      );

      files.push(attachment);
    } catch {
      return { success: false, error: "Failed to fetch attachment from Discord." };
    }
  }

  return { success: true, data: { fields, files } };
}