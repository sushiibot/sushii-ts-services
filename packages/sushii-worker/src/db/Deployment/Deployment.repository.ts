import opentelemetry from "@opentelemetry/api";
import config from "../../model/config";
import db from "../../infrastructure/database/db";
import { AppPrivateDeploymentName } from "../../infrastructure/database/dbTypes";
import { DeploymentRow } from "./Deployment.table";

// Deployment is set to this value when no deployment is active.
const defaultDeployment: AppPrivateDeploymentName = "blue";

const tracer = opentelemetry.trace.getTracer("Deployment.Repository");

/**
 * Gets the name of the active deployment.
 */
export async function getActiveDeployment(): Promise<AppPrivateDeploymentName> {
  const res = await db
    .selectFrom("app_private.active_deployment")
    .select("name")
    .executeTakeFirst();

  if (!res) {
    return defaultDeployment;
  }

  return res.name;
}

/**
 * Checks if the current deployment is active. If false, no handlers or commands
 * should be responded to.
 *
 * @returns {Promise<boolean>} Whether the current deployment is active.
 */
export async function isCurrentDeploymentActive(): Promise<boolean> {
  return tracer.startActiveSpan("isCurrentDeploymentActive", async (span) => {
    try {
      const activeName = await getActiveDeployment();
      return activeName === config.DEPLOYMENT_NAME;
    } finally {
      span.end();
    }
  });
}

/**
 * Toggles the active deployment name between blue and green.
 */
export async function toggleActiveDeployment(): Promise<
  DeploymentRow | undefined
> {
  const activeName = await getActiveDeployment();

  // Only two deployments are supported, switching between for blue/green deployments
  // to simplify rollback process.
  const newDeploymentName = activeName === "blue" ? "green" : "blue";

  return (
    db
      .insertInto("app_private.active_deployment")
      .values({
        name: newDeploymentName,
      })
      // Only a single row that is enforced by ID
      .onConflict((oc) =>
        oc.column("id").doUpdateSet({
          name: newDeploymentName,
        }),
      )
      .returningAll()
      .executeTakeFirst()
  );
}
