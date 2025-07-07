import { describe, test, expect } from "bun:test";
import { DeploymentChanged } from "./DeploymentChanged";

describe("DeploymentChanged", () => {
  test("should create event with deployment change data", () => {
    const event = new DeploymentChanged("blue", "green");

    expect(event.previousDeployment).toBe("blue");
    expect(event.newDeployment).toBe("green");
    expect(event.eventName).toBe("DeploymentChanged");
    expect(event.occurredAt).toBeInstanceOf(Date);
  });

  test("should work with different deployment combinations", () => {
    const blueToGreen = new DeploymentChanged("blue", "green");
    const greenToBlue = new DeploymentChanged("green", "blue");

    expect(blueToGreen.previousDeployment).toBe("blue");
    expect(blueToGreen.newDeployment).toBe("green");
    expect(greenToBlue.previousDeployment).toBe("green");
    expect(greenToBlue.newDeployment).toBe("blue");
  });
});