import { NextResponse } from "next/server";
import {
  AuthenticatedUser,
  isAdministratorRole,
} from "./auth.middleware";

/**
 * Authorizes a user to hide their own comment.
 *
 * SOLID:
 * - SRP: this function only checks comment ownership.
 *
 * Refactoring:
 * - Extract Method: ownership and administrator authorization
 *   are represented by separate functions.
 */
export function authorizeCommentOwner(
  authenticatedUser: AuthenticatedUser,
  commentAuthorId: string | number
): NextResponse | null {
  const authenticatedUserId = String(
    authenticatedUser.id
  );

  const ownerId = String(commentAuthorId);

  if (authenticatedUserId === ownerId) {
    return null;
  }

  return NextResponse.json(
    {
      error: "Forbidden",
      message:
        "Solo puedes ocultar tus propios comentarios.",
    },
    { status: 403 }
  );
}

/**
 * Authorizes an administrator to delete a comment.
 */
export function authorizeCommentDeletion(
  authenticatedUser: AuthenticatedUser
): NextResponse | null {
  if (isAdministratorRole(authenticatedUser.role)) {
    return null;
  }

  return NextResponse.json(
    {
      error: "Forbidden",
      message:
        "Solo un administrador puede eliminar comentarios.",
    },
    { status: 403 }
  );
}