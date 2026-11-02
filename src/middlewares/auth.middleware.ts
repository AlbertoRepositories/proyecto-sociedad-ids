import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../utils/jwt_generator";
import { UserType } from "../types/enums";

export interface AuthenticatedUser {
  id: string | number;
  email: string;
  name: string;
  role: UserType;
}

interface AuthenticationSuccess {
  authenticated: true;
  user: AuthenticatedUser;
}

interface AuthenticationFailure {
  authenticated: false;
  response: NextResponse;
}

/**
 * Discriminated authentication result.
 *
 * - ISP: consumers only depend on the authentication state they need.
 */
export type AuthenticationResult =
  | AuthenticationSuccess
  | AuthenticationFailure;

/**
 * Extracts a JWT from the Authorization header or token cookie.
 *
 * - Extract Method: token extraction is isolated and reusable.
 */
function getTokenFromRequest(
  request: NextRequest
): string | null {
  const authorizationHeader =
    request.headers.get("authorization");

  if (authorizationHeader?.startsWith("Bearer ")) {
    return authorizationHeader
      .slice("Bearer ".length)
      .trim();
  }

  return request.cookies.get("token")?.value ?? null;
}

function createAuthenticationResponse(
  status: 401 | 403,
  message: string
): NextResponse {
  return NextResponse.json(
    {
      error: status === 401 ? "Unauthorized" : "Forbidden",
      message,
    },
    { status }
  );
}

export function authenticateRequest(
  request: NextRequest
): AuthenticationResult {
  const token = getTokenFromRequest(request);

  if (!token) {
    return {
      authenticated: false,
      response: createAuthenticationResponse(
        401,
        "Debes iniciar sesión para realizar esta acción."
      ),
    };
  }

  const verifiedUser = verifyToken(token);

  if (!verifiedUser) {
    return {
      authenticated: false,
      response: createAuthenticationResponse(
        401,
        "La sesión no es válida o ya expiró."
      ),
    };
  }

  return {
    authenticated: true,
    user: {
      id: verifiedUser.id,
      email: verifiedUser.email,
      name: verifiedUser.name,
      role: verifiedUser.role,
    },
  };
}

/**
 * Requires an authenticated administrator.
 *
 * - OCP: role policy is isolated in isAdministratorRole().
 */
export function requireAdministrator(
  request: NextRequest
): AuthenticationResult {
  const authenticationResult =
    authenticateRequest(request);

  if (!authenticationResult.authenticated) {
    return authenticationResult;
  }

  if (!isAdministratorRole(authenticationResult.user.role)) {
    return {
      authenticated: false,
      response: createAuthenticationResponse(
        403,
        "No tienes permisos de administrador para realizar esta acción."
      ),
    };
  }

  return authenticationResult;
}

export function isAdministratorRole(
  role: UserType
): boolean {
  return role === UserType.ADMINISTRATOR;
}