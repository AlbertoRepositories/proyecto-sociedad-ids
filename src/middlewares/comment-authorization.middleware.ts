import { NextResponse } from "next/server";
import {
  AuthenticatedUser,
  isAdministratorRole,
} from "./auth.middleware";

export function authorizeCommentOwner(
  authenticatedUser: AuthenticatedUser,
  commentAuthorId: string | number
): NextResponse | null {
  const authenticatedUserId =
    String(authenticatedUser.id);

  const ownerId = String(commentAuthorId);

  if (authenticatedUserId !== ownerId) {
    return NextResponse.json(
      {
        error: "Forbidden",
        message:
          "Solo puedes ocultar tus propios comentarios.",
      },
      { status: 403 }
    );
  }

  return null;
}

export function authorizeCommentDeletion(
  authenticatedUser: AuthenticatedUser
): NextResponse | null {
  if (!isAdministratorRole(authenticatedUser.role)) {
    return NextResponse.json(
      {
        error: "Forbidden",
        message:
          "Solo un administrador puede eliminar comentarios.",
      },
      { status: 403 }
    );
  }

  return null;
}