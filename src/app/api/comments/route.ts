import { NextRequest } from "next/server";
import { withDatabase } from "../../../middlewares/database.middleware";
import { withAuthenticatedUser } from "../route.helpers";
import { CommentController } from "../../../controllers/comment.controller";
import { authenticateRequest } from "../../../middlewares/auth.middleware";

export const POST = withDatabase(
  withAuthenticatedUser(async (request: NextRequest, db) => {
    const body = await request.json().catch(() => null);
    const authentication = authenticateRequest(request);
    if (!authentication.authenticated) {
      return authentication.response;
    }

    const user = String(authentication.user.id);
    const comment =
      typeof body === "object" && body !== null && "comment" in body
        ? (body as { comment: Record<string, unknown> }).comment
        : (body as Record<string, unknown> | null);

    if (user && comment) {
      comment.authorId = user;
    }

    return CommentController.publishComment(
      new NextRequest(request.url, {
        method: "POST",
        headers: request.headers,
        body: JSON.stringify(
          typeof body === "object" && body !== null && "comment" in body
            ? { ...body, comment }
            : comment
        ),
      }),
      db
    );
  })
);
