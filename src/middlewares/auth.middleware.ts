import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "../utils/jwt_generator";

export interface AuthenticatedUser {
  id: string | number;
  email: string;
  name: string;
  role: string;
}

interface AuthenticationSuccess {
  authenticated: true;
  user: AuthenticatedUser;
}

interface AuthenticationFailure {
  authenticated: false;
  response: NextResponse;
}

export type AuthenticationResult =
  | AuthenticationSuccess
  | AuthenticationFailure;

const ADMINISTRATOR_ROLES = [
  "admin",
  "administrator",
  "administrador",
];

function getTokenFromRequest(request: NextRequest): string | null {
  const authorizationHeader = request.headers.get("authorization");

  if (authorizationHeader?.startsWith("Bearer ")) {
    return authorizationHeader.substring("Bearer ".length).trim();
  }

  const cookieToken = request.cookies.get("token")?.value;

  return cookieToken ?? null;
}

function createUnauthorizedResponse(
  message: string
): NextResponse {
  return NextResponse.json(
    {
      error: "Unauthorized",
      message,
    },
    { status: 401 }
  );
}

function createForbiddenResponse(
  message: string
): NextResponse {
  return NextResponse.json(
    {
      error: "Forbidden",
      message,
    },
    { status: 403 }
  );
}

export function authenticateRequest(
  request: NextRequest
): AuthenticationResult {
  const token = getTokenFromRequest(request);

  if (!token) {
    return {
      authenticated: false,
      response: createUnauthorizedResponse(
        "Debes iniciar sesión para realizar esta acción."
      ),
    };
  }

  const verifiedUser = verifyToken(token);

  if (!verifiedUser) {
    return {
      authenticated: false,
      response: createUnauthorizedResponse(
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

export function requireAdministrator(
  request: NextRequest
): AuthenticationResult {
  const authenticationResult =
    authenticateRequest(request);

  if (!authenticationResult.authenticated) {
    return authenticationResult;
  }

  const normalizedRole =
    authenticationResult.user.role.trim().toLowerCase();

  const isAdministrator =
    ADMINISTRATOR_ROLES.includes(normalizedRole);

  if (!isAdministrator) {
    return {
      authenticated: false,
      response: createForbiddenResponse(
        "No tienes permisos de administrador para realizar esta acción."
      ),
    };
  }

  return authenticationResult;
}

export function isAdministratorRole(role: string): boolean {
  return ADMINISTRATOR_ROLES.includes(
    role.trim().toLowerCase()
  );
}