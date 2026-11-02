import { NextResponse } from "next/server";
import { Logger } from "../logger/logger";

/**
 * Represents a controlled application error.
 *
 * - SRP: this class only represents known application errors.
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    details?: unknown
  ) {
    super(message);

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Converts application errors into consistent HTTP responses.
 *
 * - SRP: centralizes error-to-response conversion.
 * - OCP: new controlled error types can be added without modifying
 *   existing controllers.
 *
 * - Consolidate Conditional Expression: error handling is centralized.
 */
export function handleApiError(
  error: unknown
): NextResponse {
  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.name,
        message: error.message,
        details: error.details,
      },
      {
        status: error.statusCode,
      }
    );
  }

  const errorMessage =
    error instanceof Error
      ? error.message
      : String(error);

  Logger.error(
    `Unexpected API error: ${errorMessage}`
  );

  return NextResponse.json(
    {
      error: "Internal Server Error",
      message:
        "Ocurrió un error inesperado en el servidor.",
    },
    { status: 500 }
  );
}