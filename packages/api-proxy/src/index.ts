import process from "node:process";
import { REST } from "@discordjs/rest";
import { proxyRequests } from "./handlers/proxyRequests";

process.on("SIGINT", () => process.exit(0));

// We want to let upstream handle retrying
const api = new REST({ rejectOnRateLimit: () => true, retries: 0 });

const port = Number.parseInt(process.env.PORT ?? "8080", 10);
Bun.serve({
  port,
  fetch: proxyRequests(api),
});

console.log(`Listening on port ${port}`);
