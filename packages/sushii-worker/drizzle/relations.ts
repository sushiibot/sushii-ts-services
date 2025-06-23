import { relations } from "drizzle-orm/relations";
import {
  webUsersInAppPublic,
  sessionsInAppPrivate,
  userAuthenticationSecretsInAppPrivate,
  feedsInAppPublic,
  feedSubscriptionsInAppPublic,
  giveawaysInAppPublic,
  giveawayEntriesInAppPublic,
  modLogsInAppPublic,
  mutesInAppPublic,
  roleMenusInAppPublic,
  roleMenuRolesInAppPublic,
} from "./schema";

export const sessionsInAppPrivateRelations = relations(
  sessionsInAppPrivate,
  ({ one }) => ({
    webUsersInAppPublic: one(webUsersInAppPublic, {
      fields: [sessionsInAppPrivate.userId],
      references: [webUsersInAppPublic.id],
    }),
  }),
);

export const webUsersInAppPublicRelations = relations(
  webUsersInAppPublic,
  ({ many }) => ({
    sessionsInAppPrivates: many(sessionsInAppPrivate),
    userAuthenticationSecretsInAppPrivates: many(
      userAuthenticationSecretsInAppPrivate,
    ),
  }),
);

export const userAuthenticationSecretsInAppPrivateRelations = relations(
  userAuthenticationSecretsInAppPrivate,
  ({ one }) => ({
    webUsersInAppPublic: one(webUsersInAppPublic, {
      fields: [userAuthenticationSecretsInAppPrivate.userId],
      references: [webUsersInAppPublic.id],
    }),
  }),
);

export const feedSubscriptionsInAppPublicRelations = relations(
  feedSubscriptionsInAppPublic,
  ({ one }) => ({
    feedsInAppPublic: one(feedsInAppPublic, {
      fields: [feedSubscriptionsInAppPublic.feedId],
      references: [feedsInAppPublic.feedId],
    }),
  }),
);

export const feedsInAppPublicRelations = relations(
  feedsInAppPublic,
  ({ many }) => ({
    feedSubscriptionsInAppPublics: many(feedSubscriptionsInAppPublic),
  }),
);

export const giveawayEntriesInAppPublicRelations = relations(
  giveawayEntriesInAppPublic,
  ({ one }) => ({
    giveawaysInAppPublic: one(giveawaysInAppPublic, {
      fields: [giveawayEntriesInAppPublic.giveawayId],
      references: [giveawaysInAppPublic.id],
    }),
  }),
);

export const giveawaysInAppPublicRelations = relations(
  giveawaysInAppPublic,
  ({ many }) => ({
    giveawayEntriesInAppPublics: many(giveawayEntriesInAppPublic),
  }),
);

export const mutesInAppPublicRelations = relations(
  mutesInAppPublic,
  ({ one }) => ({
    modLogsInAppPublic: one(modLogsInAppPublic, {
      fields: [mutesInAppPublic.guildId],
      references: [modLogsInAppPublic.guildId],
    }),
  }),
);

export const modLogsInAppPublicRelations = relations(
  modLogsInAppPublic,
  ({ many }) => ({
    mutesInAppPublics: many(mutesInAppPublic),
  }),
);

export const roleMenuRolesInAppPublicRelations = relations(
  roleMenuRolesInAppPublic,
  ({ one }) => ({
    roleMenusInAppPublic: one(roleMenusInAppPublic, {
      fields: [roleMenuRolesInAppPublic.guildId],
      references: [roleMenusInAppPublic.guildId],
    }),
  }),
);

export const roleMenusInAppPublicRelations = relations(
  roleMenusInAppPublic,
  ({ many }) => ({
    roleMenuRolesInAppPublics: many(roleMenuRolesInAppPublic),
  }),
);
