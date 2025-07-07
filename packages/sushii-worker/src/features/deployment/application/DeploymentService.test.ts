import { describe, test, expect, beforeEach } from "bun:test";
import { DeploymentService } from "./DeploymentService";
import { Deployment } from "../domain/entities/Deployment";
import { DeploymentRepository } from "../domain/repositories/DeploymentRepository";
import { DeploymentChanged } from "../domain/events/DeploymentChanged";
import pino from "pino";

// Mock repository for testing
class MockDeploymentRepository implements DeploymentRepository {
  private activeDeployment: Deployment = Deployment.create("blue");
  private shouldThrowOnStart = false;
  private shouldThrowOnSetActive = false;

  async getActive(): Promise<Deployment> {
    return this.activeDeployment;
  }

  async setActive(deployment: Deployment): Promise<void> {
    if (this.shouldThrowOnSetActive) {
      throw new Error("Failed to set active deployment");
    }
    this.activeDeployment = deployment;
  }

  async start(): Promise<void> {
    if (this.shouldThrowOnStart) {
      throw new Error("Failed to start repository");
    }
  }

  async stop(): Promise<void> {
    // No-op for mock
  }

  // Test helpers
  setActiveDeployment(deployment: Deployment): void {
    this.activeDeployment = deployment;
  }

  setShouldThrowOnStart(shouldThrow: boolean): void {
    this.shouldThrowOnStart = shouldThrow;
  }

  setShouldThrowOnSetActive(shouldThrow: boolean): void {
    this.shouldThrowOnSetActive = shouldThrow;
  }
}

// Silent logger for tests
const testLogger = pino({ level: "silent" });

describe("DeploymentService", () => {
  let deploymentService: DeploymentService;
  let mockRepository: MockDeploymentRepository;

  beforeEach(() => {
    mockRepository = new MockDeploymentRepository();
    deploymentService = new DeploymentService(
      mockRepository,
      testLogger,
      "blue",
    );
  });

  describe("lifecycle", () => {
    test("should start and initialize current deployment", async () => {
      const greenDeployment = Deployment.create("green");
      mockRepository.setActiveDeployment(greenDeployment);

      await deploymentService.start();

      expect(deploymentService.getCurrentDeployment()).toBe("green");
    });

    test("should handle start errors", async () => {
      mockRepository.setShouldThrowOnStart(true);

      await expect(deploymentService.start()).rejects.toThrow();
    });

    test("should stop gracefully", async () => {
      await deploymentService.start();

      // Should not throw when stopping
      await expect(async () => {
        await deploymentService.stop();
      }).not.toThrow();
    });
  });

  describe("deployment state", () => {
    test("should return current deployment when initialized", async () => {
      const greenDeployment = Deployment.create("green");
      mockRepository.setActiveDeployment(greenDeployment);

      await deploymentService.start();

      expect(deploymentService.getCurrentDeployment()).toBe("green");
    });

    test("should return default when not initialized", () => {
      expect(deploymentService.getCurrentDeployment()).toBe("blue");
    });

    test("should correctly identify if current deployment is active", async () => {
      const blueDeployment = Deployment.create("blue");
      mockRepository.setActiveDeployment(blueDeployment);

      await deploymentService.start();

      expect(deploymentService.isCurrentDeploymentActive()).toBe(true);
    });

    test("should correctly identify when deployment is not active", async () => {
      const greenDeployment = Deployment.create("green");
      mockRepository.setActiveDeployment(greenDeployment);

      await deploymentService.start();

      expect(deploymentService.isCurrentDeploymentActive()).toBe(false);
    });
  });

  describe("deployment toggling", () => {
    test("should toggle deployment successfully", async () => {
      const blueDeployment = Deployment.create("blue");
      mockRepository.setActiveDeployment(blueDeployment);

      await deploymentService.start();
      const result = await deploymentService.toggleActiveDeployment();

      expect(result).toBe("green");
      expect(deploymentService.getCurrentDeployment()).toBe("green");
    });

    test("should throw when not initialized", async () => {
      await expect(deploymentService.toggleActiveDeployment()).rejects.toThrow(
        "Deployment service not initialized",
      );
    });

    test("should handle repository errors during toggle", async () => {
      await deploymentService.start();
      mockRepository.setShouldThrowOnSetActive(true);

      await expect(
        deploymentService.toggleActiveDeployment(),
      ).rejects.toThrow();
    });
  });

  describe("deployment change handling", () => {
    test("should update deployment state from external changes", async () => {
      const blueDeployment = Deployment.create("blue");
      mockRepository.setActiveDeployment(blueDeployment);

      await deploymentService.start();

      const event = new DeploymentChanged("blue", "green");
      deploymentService.handleDeploymentChanged(event);

      expect(deploymentService.getCurrentDeployment()).toBe("green");
    });

    test("should handle changes when not initialized", () => {
      const event = new DeploymentChanged("blue", "green");

      expect(() =>
        deploymentService.handleDeploymentChanged(event),
      ).not.toThrow();

      expect(deploymentService.getCurrentDeployment()).toBe("green");
    });
  });

  describe("process variations", () => {
    test("should work with green process", async () => {
      const greenService = new DeploymentService(
        mockRepository,
        testLogger,
        "green",
      );

      const greenDeployment = Deployment.create("green");
      mockRepository.setActiveDeployment(greenDeployment);

      await greenService.start();

      expect(greenService.isCurrentDeploymentActive()).toBe(true);
    });
  });
});
