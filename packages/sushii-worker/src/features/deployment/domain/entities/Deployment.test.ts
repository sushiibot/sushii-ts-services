import { describe, test, expect } from "bun:test";
import { Deployment } from "./Deployment";

describe("Deployment", () => {
  describe("creation", () => {
    test("should create deployment with specified name", () => {
      const blue = Deployment.create("blue");
      const green = Deployment.create("green");

      expect(blue.name).toBe("blue");
      expect(green.name).toBe("green");
      expect(blue.updatedAt).toBeInstanceOf(Date);
      expect(green.updatedAt).toBeInstanceOf(Date);
    });

    test("should create deployment from persistence", () => {
      const updatedAt = new Date("2023-01-01T00:00:00Z");
      const deployment = Deployment.fromPersistence("green", updatedAt);

      expect(deployment.name).toBe("green");
      expect(deployment.updatedAt).toBe(updatedAt);
    });
  });

  describe("toggle behavior", () => {
    test("should toggle between blue and green", () => {
      const blue = Deployment.create("blue");
      const green = blue.toggle();
      const backToBlue = green.toggle();

      expect(blue.name).toBe("blue");
      expect(green.name).toBe("green");
      expect(backToBlue.name).toBe("blue");
    });

    test("should create new instances when toggling", () => {
      const original = Deployment.create("blue");
      const toggled = original.toggle();

      expect(toggled).not.toBe(original);
      expect(original.name).toBe("blue"); // Original unchanged
      expect(toggled.name).toBe("green");
    });
  });

  describe("active status", () => {
    test("should correctly identify active deployments", () => {
      const blueDeployment = Deployment.create("blue");
      const greenDeployment = Deployment.create("green");

      expect(blueDeployment.isActive("blue")).toBe(true);
      expect(blueDeployment.isActive("green")).toBe(false);
      expect(greenDeployment.isActive("green")).toBe(true);
      expect(greenDeployment.isActive("blue")).toBe(false);
    });
  });
});
