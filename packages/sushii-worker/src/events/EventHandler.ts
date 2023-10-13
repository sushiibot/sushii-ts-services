import { ClientEvents, Events, GatewayDispatchPayload } from "discord.js";
import Context from "../model/context";

export type RawEventHandlerFn<T extends Events> = (
  ctx: Context,
  eventType: T,
  payload: GatewayDispatchPayload,
) => Promise<void>;

export type EventHandlerFn<K extends keyof ClientEvents> = (
  ctx: Context,
  ...data: ClientEvents[K]
) => Promise<void>;
