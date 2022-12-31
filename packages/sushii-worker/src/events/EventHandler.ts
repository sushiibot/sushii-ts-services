import { GatewayDispatchEvents } from "discord-api-types/v10";
import Context from "../model/context";

export default abstract class EventHandler {
  abstract readonly eventTypes: GatewayDispatchEvents[];

  /**
   * Event handler
   */
  abstract handler(
    ctx: Context,
    eventType: GatewayDispatchEvents,
    data: unknown,
    old: unknown | undefined
  ): Promise<void>;
}
