import { Client, GatewayDispatchEvents } from "discord.js";
import { Counter, Gauge } from "prom-client";
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

// -----------------------------------------------------------------------------
// Shards

const shardStatusGauge = new Gauge({
  name: prefixedName("shard_status"),
  help: "Discord shard status",
  labelNames: ["shard_id"],
});

const shardLatencyGauge = new Gauge({
  name: prefixedName("shard_latency_ms"),
  help: "Discord shard latency",
  labelNames: ["shard_id"],
});

const shardLastPingTimestampGauge = new Gauge({
  name: prefixedName("shard_last_ping_timestamp"),
  help: "Discord shard last ping timestamp",
  labelNames: ["shard_id"],
});

export function updateShardMetrics(client: Client<boolean>): void {
  for (const shard of client.ws.shards.values()) {
    const labels = {
      shard_id: shard.id,
    };

    shardStatusGauge.set(labels, shard.status);
    shardLatencyGauge.set(labels, shard.ping);
    shardLastPingTimestampGauge.set(labels, shard.lastPingTimestamp);
  }
}
