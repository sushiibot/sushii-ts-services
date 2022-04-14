-- CreateTable
CREATE TABLE "RoleMenu" (
    "messageId" BIGINT NOT NULL,
    "guildId" BIGINT NOT NULL,
    "channelId" BIGINT NOT NULL,
    "editorId" BIGINT,

    CONSTRAINT "RoleMenu_pkey" PRIMARY KEY ("messageId")
);

-- CreateIndex
CREATE INDEX "RoleMenu_guildId_idx" ON "RoleMenu"("guildId");
