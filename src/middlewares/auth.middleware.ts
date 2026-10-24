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

function getTokenFromRequest(
  request: NextRequest
): string | null {
  const authorizationHeader =
    request.headers.get("authorization");

  if (authorizationHeader?.startsWith("Bearer ")) {
    return authorizationHeader.substring("Bearer ".length);
  }

  const cookieToken = request.cookies.get("token")?.value;

  return cookieToken ?? null;
}

export function authenticateRequest(
  request: NextRequest
): AuthenticationResult {
  const token = getTokenFromRequest(request);

  if (!token) {
    return {
      authenticated: false,
      response: NextResponse.json(
        {
          error: "No autenticado.",
          message:
            "Debes iniciar sesión para realizar esta acción.",
        },
        { status: 401 }
      ),
    };
  }

  const verifiedUser = verifyToken(token);

  if (!verifiedUser) {
    return {
      authenticated: false,
      response: NextResponse.json(
        {
          error: "Token inválido.",
          message: "La sesión no es válida o ya expiró.",
        },
        { status: 401 }
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

  const administratorRoles = [
    "admin",
    "administrator",
    "administrador",
  ];

  if (!administratorRoles.includes(normalizedRole)) {
    return {
      authenticated: false,
      response: NextResponse.json(
        {
          error: "Acceso denegado.",
          message:
            "No tienes permisos de administrador para realizar esta acción.",
        },
        { status: 403 }
      ),
    };
  }

  return authenticationResult;
}