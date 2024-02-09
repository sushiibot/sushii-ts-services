import { GatewayDispatchEvents } from "discord.js";
import { Counter } from "prom-client";
import { prefixedName } from "./metrics";

// -----------------------------------------------------------------------------
// Events
const gatewayEventsCounter = new Counter({
  name: prefixedName("discord_events"),
  help: "Discord gateway events",
  labelNames: ["event_name"],
});

export function updateGatewayDispatchEventMetrics(
  event: GatewayDispatchEvents,
): void {
  gatewayEventsCounter.inc({ event_name: event });
}
