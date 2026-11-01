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
  Runs the middleware for application routes while excluding
  static files and internal Next.js assets.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};