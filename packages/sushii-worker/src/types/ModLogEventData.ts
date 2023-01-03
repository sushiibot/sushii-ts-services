import {
  GatewayGuildBanAddDispatchData,
  GatewayGuildBanRemoveDispatchData,
  GatewayGuildMemberUpdateDispatchData,
} from "discord-api-types/v10";

export type EventData =
  | GatewayGuildBanAddDispatchData
  | GatewayGuildMemberUpdateDispatchData
  | GatewayGuildBanRemoveDispatchData;
