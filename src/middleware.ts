import { NextRequest, NextResponse } from "next/server";
import { updateSupabaseSession } from "./middlewares/supabase.middleware";

/*
  Official Next.js middleware entry point.
  SOLID:
  - SRP: this file only coordinates the global middleware.
 
  Refactoring:
  - Extract Method: Supabase session logic lives in a dedicated module.
 */
export async function middleware(
  request: NextRequest
): Promise<NextResponse> {
  return updateSupabaseSession(request);
}

/*
 * Applies the middleware to application routes while excluding
 * Next.js internal assets and static files.
 *
 * This allows Supabase session handling to run for normal requests
 * without running unnecessarily for files such as images, SVGs,
 * favicon.ico, or files under "_next".
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
