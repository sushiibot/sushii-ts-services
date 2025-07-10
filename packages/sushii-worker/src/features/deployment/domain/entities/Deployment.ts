export type DeploymentName = "blue" | "green";

export class Deployment {
  private constructor(
    private readonly _name: DeploymentName,
    private readonly _updatedAt: Date,
  ) {}

  static create(name: DeploymentName): Deployment {
    return new Deployment(name, new Date());
  }

  static fromPersistence(name: DeploymentName, updatedAt: Date): Deployment {
    return new Deployment(name, updatedAt);
  }

  get name(): DeploymentName {
    return this._name;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  setTo(targetName: DeploymentName): Deployment {
    return new Deployment(targetName, new Date());
  }

  isActive(processName: DeploymentName): boolean {
    return this._name === processName;
  }
}
