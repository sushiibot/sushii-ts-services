import client from "prom-client";

const { collectDefaultMetrics } = client;
const { Registry } = client;

export default function getMetricsRegistry(): client.Registry {
  const register = new Registry();
  const prefix = "sushii_ts_worker";

  collectDefaultMetrics({
    register,
    prefix,
  });

  register.metrics();

  return register;
}
