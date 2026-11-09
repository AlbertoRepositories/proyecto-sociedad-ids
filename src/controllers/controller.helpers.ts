import { NextResponse } from "next/server";

interface SupabaseError {
  message?: string;
  code?: string;
}

export async function readBody<T>(
  request: Request
): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

export function badRequest(
  message: string
): NextResponse {
  return NextResponse.json(
    { success: false, message },
    { status: 400 }
  );
}

export function notFound(
  message: string
): NextResponse {
  return NextResponse.json(
    { success: false, message },
    { status: 404 }
  );
}

export function databaseError(
  error: SupabaseError,
  message = "Error al consultar la base de datos."
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message,
      details: error.message,
      code: error.code,
    },
    { status: 500 }
  );
}