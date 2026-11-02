import { NextRequest, NextResponse } from "next/server";
import { updateSupabaseSession } from "./middlewares/supabase.middleware";

/*
  Official Next.js middleware entry point.
  - SRP: this file only coordinates the global middleware.
 */

export async function middleware(
  request: NextRequest
): Promise<NextResponse> {
  return updateSupabaseSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
