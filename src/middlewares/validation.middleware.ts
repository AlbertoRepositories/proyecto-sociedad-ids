import { NextRequest, NextResponse } from "next/server";

export type ValidationResult<T> =
  | {
      valid: true;
      data: T;
    }
  | {
      valid: false;
      response: NextResponse;
    };

export type BodyValidator<T> = (
  body: unknown
) => {
  valid: boolean;
  data?: T;
  errors?: string[];
};

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
      response: NextResponse.json(
        {
          error: "Invalid request body",
          message:
            "El cuerpo de la solicitud debe contener JSON válido.",
        },
        { status: 400 }
      ),
    };
  }

  const validation = validator(body);

  if (!validation.valid) {
    return {
      valid: false,
      response: NextResponse.json(
        {
          error: "Validation failed",
          message: "Los datos enviados no son válidos.",
          errors: validation.errors ?? [],
        },
        { status: 400 }
      ),
    };
  }

  return {
    valid: true,
    data: validation.data as T,
  };
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
  if (typeof value !== "string" || value.trim() === "") {
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
  if (typeof value !== "string") {
    return false;
  }

  return !/[<>]/.test(value);
}