import { BaseError, CombinedPropertyError } from "@sapphire/shapeshift";

interface ValidationError {
  name: string;
  message: string;
  stack?: string;
  errors?: string;
}

export default function validationErrorToString(
  err: unknown
): ValidationError | undefined {
  // Validation errors from @sapphire/shapeshift
  if (err instanceof BaseError) {
    return {
      name: err.name,
      message: err.message,
      stack: err.stack,
    };
  }

  if (err instanceof CombinedPropertyError) {
    return {
      name: err.name,
      message: err.message,
      stack: err.stack,
      errors: err.errors.join(", "),
    };
  }
}
