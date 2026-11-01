import {
  createServerClient,
  type CookieOptions,
} from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

/**
 * Refreshes the Supabase session and synchronizes authentication cookies.
 *
 * SOLID:
 * - SRP: this module only manages Supabase session cookies.
 * - DIP: it depends on Supabase's cookie abstraction.
 *
 * Refactoring:
 * - Extract Method: session handling was extracted from middleware.ts.
 */

export async function updateSupabaseSession(
  request: NextRequest
): Promise<NextResponse> {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  /**
   * Continue without Supabase session handling when configuration
   * is incomplete. This prevents unrelated routes from crashing.
   */
  if (!supabaseUrl || !supabaseKey) {
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        /**
         * Returns all cookies received in the request.
         */
        getAll(): { name: string; value: string }[] {
          return request.cookies.getAll();
        },

        /**
         * Updates cookies in both the request and response.
         */
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options: CookieOptions;
          }[]
        ): void {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({ request });

          cookiesToSet.forEach(
            ({ name, value, options }) => {
              response.cookies.set(name, value, options);
            }
          );
        },
      },
    }
  );

  /**
   * getUser validates the session against Supabase.
   * It is safer than trusting session data stored only in cookies.
   */
  await supabase.auth.getUser();

  return response;
}