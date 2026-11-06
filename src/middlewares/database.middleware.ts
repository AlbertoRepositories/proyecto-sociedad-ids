import { NextRequest, NextResponse } from "next/server";
import { SupabaseClient } from "@supabase/supabase-js";
import database from "../lib/connect";
import { ApiError, handleApiError } from "./error.middleware";

type DatabaseHandler = (
  request: NextRequest,
  supabase: SupabaseClient
) => Promise<NextResponse>;

export function withDatabase(
  handler: DatabaseHandler
): (
  request: NextRequest
) => Promise<NextResponse> {
  return async (
    request: NextRequest
  ): Promise<NextResponse> => {
    try {
      const supabase = await database.connect();

      await database.checkConnection(supabase);

      return await handler(request, supabase);
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        return handleApiError(error);
      }

      return handleApiError(
        new ApiError(
          "La base de datos no está disponible.",
          503
        )
      );
    }
  };
}