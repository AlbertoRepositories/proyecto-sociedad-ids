import { NextRequest, NextResponse } from "next/server";

interface ValidationSuccess<T> {
  valid: true;
  data: T;
}

interface ValidationFailure {
  valid: false;
  response: NextResponse;
}

/**
 * Discriminated validation result.
 *
 * SOLID:
 * - ISP: consumers only depend on the validation result they need.
 */
export type ValidationResult<T> =
  | ValidationSuccess<T>
  | ValidationFailure;

export type BodyValidator<T> = (
  body: unknown
) =>
  | {
      valid: true;
      data: T;
    }
  | {
      valid: false;
      errors?: string[];
    };

/**
 * Parses and validates a JSON request body.
 *
 * - SRP: parses JSON and delegates business validation.
 * - DIP: depends on the BodyValidator abstraction.
 *
 * - Parameterize Method: validation rules are injected as a parameter.
 */
export async function validateRequestBody<T>(
  request: NextRequest,
  validator: BodyValidator<T>
): Promise<ValidationResult<T>> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return {
      valid: false,
      response: createValidationResponse(
        "El cuerpo de la solicitud debe contener JSON válido."
      ),
    };
  }

  const validation = validator(body);

  if (!validation.valid) {
    return {
      valid: false,
      response: createValidationResponse(
        "Los datos enviados no son válidos.",
        validation.errors
      ),
    };
  }

  return {
    valid: true,
    data: validation.data,
  };
}

function createValidationResponse(
  message: string,
  errors: string[] = []
): NextResponse {
  return NextResponse.json(
    {
      error: "Validation failed",
      message,
      errors,
    },
    { status: 400 }
  );
}

export function isNonEmptyString(
  value: unknown
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}

export function isValidDate(value: unknown): boolean {
  if (value instanceof Date) {
    return !Number.isNaN(value.getTime());
  }

  if (typeof value !== "string") {
    return false;
  }

  return !Number.isNaN(new Date(value).getTime());
}

export function isValidUrl(value: unknown): boolean {
  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    return false;
  }

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export function isPlainText(value: unknown): boolean {
  return (
    typeof value === "string" &&
    !/[<>]/.test(value)
  );
}