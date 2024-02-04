import { Env, Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { Status, StatusType } from "./model/status";
import { getStatus, setStatus } from "./kv/status";

type Bindings = {
  // Key required to push status events
  API_KEY: string;
  // Webhook URL to push status events to
  WEBHOOK_URL: string;
  // KV namespace to store status events in
  KV_NAMESPACE: KVNamespace;
};

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => c.text("meow"));

// Require API key for all API routes
app.use("/api/*", (c, next) => bearerAuth({ token: c.env.API_KEY })(c, next));

app.get("/api/status", async (c) => {
  const { KV_NAMESPACE } = c.env;

  try {
    const status = await getStatus(KV_NAMESPACE);
    console.log("raw status", JSON.stringify(status));

    if (!status) {
      c.status(404);
      return c.text("Not found");
    }

    return c.json(status);
  } catch (err) {
    c.status(500);
    return c.json(err);
  }
});

app.put("/api/status", async (c) => {
  const { WEBHOOK_URL, KV_NAMESPACE } = c.env;

  const rawStatus = await c.req.json();

  const status = Status.safeParse(rawStatus);
  if (!status.success) {
    c.status(400);
    return c.json(status.error);
  }

  await setStatus(KV_NAMESPACE, status.data);

  return c.text("OK");
});

async function scheduled(
  event: ScheduledEvent,
  env: Bindings,
  ctx: EventContext<Env, any, any>
) {
  const status = await getStatus(env.KV_NAMESPACE);
  if (!status) {
    return;
  }

  console.log("status", JSON.stringify(status));

  return;

  const res = await fetch(env.WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(status),
  });

  if (!res.ok) {
    throw new Error(
      `Failed to send status webhook: ${res.status} ${res.statusText}`
    );
  }
}

export default {
  fetch: app.fetch,
  scheduled,
};
