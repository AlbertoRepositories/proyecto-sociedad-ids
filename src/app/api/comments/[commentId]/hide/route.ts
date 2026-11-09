import { NextRequest } from "next/server";
import { withDatabase } from "../../../../../middlewares/database.middleware";
import { withAuthenticatedUser } from "../../../route.helpers";
import { CommentController } from "../../../../../controllers/comment.controller";
import {
  authenticateRequest,
  isAdministratorRole,
} from "../../../../../middlewares/auth.middleware";
import { CommentRepository } from "../../../../../repositories/comment.repository";
import { NextResponse } from "next/server";

interface Context {
  params: Promise<{ commentId: string }>;
}

export async function POST(request: NextRequest, context: Context) {
  const { commentId } = await context.params;
  return withDatabase(
    withAuthenticatedUser(async (currentRequest, db) => {
      const authentication = authenticateRequest(currentRequest);
      if (!authentication.authenticated) {
        return authentication.response;
      }

      const comment = await CommentRepository.findById(
        db,
        commentId
      );

      if (comment.error) {
        return NextResponse.json(
          { success: false, message: comment.error.message },
          { status: 500 }
        );
      }

      if (!comment.data) {
        return NextResponse.json(
          { success: false, message: "Comment not found." },
          { status: 404 }
        );
      }

      const isOwner =
        String(authentication.user.id) ===
        String(comment.data.authorId);

      if (
        !isOwner &&
        !isAdministratorRole(authentication.user.role)
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Only the comment author or an administrator can hide it.",
          },
          { status: 403 }
        );
      }

      const body = new NextRequest(
        new Request(currentRequest.url, {
          method: "POST",
          body: JSON.stringify({ commentId }),
        })
      );
      return CommentController.hideComment(body, db);
    })
  )(request);
}
