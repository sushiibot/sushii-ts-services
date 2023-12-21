import config from "../../model/config";
import db from "../../model/db";
import { AppPrivateDeploymentName } from "../../model/dbTypes";

// Deployment is set to this value when no deployment is active.
const defaultDeployment: AppPrivateDeploymentName = "blue";

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
  const activeName = await getActiveDeployment();
  return activeName === config.DEPLOYMENT_NAME;
}

/**
 * Toggles the active deployment name between blue and green.
 */
export async function toggleActiveDeployment(): Promise<void> {
  const activeName = await getActiveDeployment();

  // Only two deployments are supported, switching between for blue/green deployments
  // to simplify rollback process.
  const newDeploymentName = activeName === "blue" ? "green" : "blue";

  await db
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
    .execute();
}
