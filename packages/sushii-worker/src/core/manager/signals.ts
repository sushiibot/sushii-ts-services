export function registerShutdownSignals(fn: () => void): void {
  process.on("SIGTERM", () => fn());
  process.on("SIGINT", () => fn());

  process.on("exit", () => console.log("byeeee"));
  process.on("SIGHUP", () => process.exit(128 + 1));
}
