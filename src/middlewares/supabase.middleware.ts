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

  /**
   * Creates a server-side Supabase client for the current request.
   *
   * The client uses the public Supabase URL and publishable key, and
   * receives an adapter for reading and writing authentication cookies.
   * Supabase uses these cookies to identify and refresh the user's
   * authentication session.
   *
   * The cookie adapter keeps the request cookies synchronized with the
   * response cookies, so refreshed session tokens are sent back to the
   * browser.
   */

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
         * Writes refreshed authentication cookies to both the request
         * and the response. The request must be updated so subsequent
         * server-side operations see the refreshed session, while the
         * response must be updated so the browser stores the new cookies.
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