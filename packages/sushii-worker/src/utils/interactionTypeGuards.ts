import {
  APIApplicationCommandInteraction,
  APIChatInputApplicationCommandDMInteraction,
  APIChatInputApplicationCommandGuildInteraction,
  APIChatInputApplicationCommandInteraction,
  APIInteraction,
  GatewayDispatchEvents,
  GatewayInteractionCreateDispatch,
  GatewayOpcodes,
  InteractionType,
} from "discord-api-types/v10";
import { GatewayDispatchPayloadWithOld } from "../model/GatewayDispatchPayloadWithOld";

export function isGuildInteraction(
  interaction: APIChatInputApplicationCommandInteraction
): interaction is APIChatInputApplicationCommandGuildInteraction {
  return (
    interaction.user === undefined &&
    interaction.guild_id !== undefined &&
    interaction.member !== undefined
  );
}

export function isDMInteraction(
  interaction: APIChatInputApplicationCommandInteraction
): interaction is APIChatInputApplicationCommandDMInteraction {
  return (
    interaction.user !== undefined &&
    interaction.guild_id === undefined &&
    interaction.member === undefined
  );
}

export function isGatewayDispatchEvent(
  msg: any
): msg is GatewayDispatchPayloadWithOld {
  return msg && msg.op === GatewayOpcodes.Dispatch;
}

export function isGatewayInteractionCreateDispatch(
  msg: any
): msg is GatewayInteractionCreateDispatch {
  return (
    msg &&
    msg.op === GatewayOpcodes.Dispatch &&
    msg.t === GatewayDispatchEvents.InteractionCreate
  );
}

export function isAPIApplicationCommandInteraction(
  interaction: APIInteraction
): interaction is APIApplicationCommandInteraction {
  return interaction.type === InteractionType.ApplicationCommand;
}
