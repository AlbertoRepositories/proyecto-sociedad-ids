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
 * - Extract Method: session handling was extracted from middleware.ts into this, more appropriate, module.
 */

export async function updateSupabaseSession(
  request: NextRequest
): Promise<NextResponse> {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return response;
  }

  
  // Creates a server-side Supabase client for the current request to validate it using the user's cookies.


  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
         // Returns all cookies received in the request.
        getAll(): { name: string; value: string }[] {
          return request.cookies.getAll();
        },

        // Updates the renovated cookies into the response to the client.
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


   // getUser validates the session against Supabase.
   
  await supabase.auth.getUser();

  return response;
}