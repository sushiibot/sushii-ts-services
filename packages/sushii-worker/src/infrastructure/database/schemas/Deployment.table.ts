import { Insertable, Selectable, Updateable } from "kysely";
import { AppPrivateActiveDeployment } from "../../infrastructure/database/config/dbTypes";

export type DeploymentRow = Selectable<AppPrivateActiveDeployment>;
export type InsertableDeploymentRow = Insertable<AppPrivateActiveDeployment>;
export type UpdateableDeploymentRow = Updateable<AppPrivateActiveDeployment>;
