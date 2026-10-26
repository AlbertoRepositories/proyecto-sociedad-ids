import { NextResponse } from "next/server";
import { Logger } from "../logger/logger";

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

  if (error instanceof Error) {
    Logger.error(
      `Unexpected API error: ${error.message}`
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

  Logger.error(
    `Unknown API error: ${String(error)}`
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