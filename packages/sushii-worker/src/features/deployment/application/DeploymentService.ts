import { Deployment, DeploymentName } from "../domain/entities/Deployment";
import { DeploymentRepository } from "../domain/repositories/DeploymentRepository";
import { DeploymentChanged } from "../domain/events/DeploymentChanged";
import { Logger } from "pino";

export class DeploymentService {
  private currentDeployment: Deployment | null = null;
  private readonly processName: DeploymentName;
  private isStarted = false;
  private lastInactiveLogTime = 0;

  constructor(
    private readonly repository: DeploymentRepository,
    private readonly logger: Logger,
    processName: DeploymentName,
  ) {
    this.processName = processName;
  }

  async start(): Promise<void> {
    if (this.isStarted) {
      this.logger.warn("Deployment service already started");
      return;
    }

    try {
      await this.repository.start();
      this.currentDeployment = await this.repository.getActive();
      this.isStarted = true;

      this.logger.info(
        {
          active: this.currentDeployment.name,
          process: this.processName,
          isActive: this.isCurrentDeploymentActive(),
        },
        "Deployment service started",
      );
    } catch (error) {
      this.logger.error({ error }, "Failed to start deployment service");
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (!this.isStarted) {
      return;
    }

    try {
      await this.repository.stop();
      this.isStarted = false;
      this.currentDeployment = null;
      this.logger.info("Deployment service stopped");
    } catch (error) {
      this.logger.error({ error }, "Error stopping deployment service");
    }
  }

  getCurrentDeployment(): DeploymentName {
    if (!this.currentDeployment) {
      this.logger.warn("Deployment service not initialized, returning default");
      return "blue"; // Default fallback
    }
    return this.currentDeployment.name;
  }

  isCurrentDeploymentActive(): boolean {
    if (!this.currentDeployment) {
      return false;
    }

    const isActive = this.currentDeployment.isActive(this.processName);

    if (!isActive) {
      // Only log max once per 30 seconds to reduce noise
      const now = Date.now();

      if (now - this.lastInactiveLogTime > 30000) {
        this.lastInactiveLogTime = now;
        this.logger.warn(
          {
            activeDeployment: this.currentDeployment.name,
            processDeployment: this.processName,
          },
          "Current process is NOT active deployment, will not process events",
        );
      }
    }

    return isActive;
  }

  async toggleActiveDeployment(): Promise<DeploymentName> {
    if (!this.currentDeployment) {
      throw new Error("Deployment service not initialized");
    }

    const previousName = this.currentDeployment.name;
    const newDeployment = this.currentDeployment.toggle();

    try {
      // Repository will handle database update and PostgreSQL NOTIFY
      await this.repository.setActive(newDeployment);
      this.currentDeployment = newDeployment;

      this.logger.info(
        {
          from: previousName,
          to: newDeployment.name,
          isNowActive: this.isCurrentDeploymentActive(),
        },
        "Deployment toggled successfully",
      );

      return newDeployment.name;
    } catch (error) {
      this.logger.error({ error }, "Failed to toggle deployment");
      throw error;
    }
  }

  handleDeploymentChanged(event: DeploymentChanged): void {
    const previousDeployment = this.currentDeployment?.name;
    this.currentDeployment = Deployment.create(event.newDeployment);

    const wasActive = previousDeployment === this.processName;
    const isNowActive = this.isCurrentDeploymentActive();

    this.logger.info(
      {
        previousDeployment,
        newDeployment: event.newDeployment,
        wasActive,
        isNowActive,
        processDeployment: this.processName,
      },
      "Deployment state updated from notification",
    );

    if (wasActive && !isNowActive) {
      this.logger.warn(
        "This deployment is no longer active - will stop processing events",
      );
    } else if (!wasActive && isNowActive) {
      this.logger.info(
        "This deployment is now active - will start processing events",
      );
    }
  }
}
