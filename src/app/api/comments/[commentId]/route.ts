import { NextRequest } from "next/server";
import { withDatabase } from "../../../../middlewares/database.middleware";
import { withAuthenticatedUser, withAdministrator } from "../../route.helpers";
import { CommentController } from "../../../../controllers/comment.controller";

interface Context {
  params: Promise<{ commentId: string }>;
}

export async function GET(request: NextRequest, context: Context) {
  const { commentId } = await context.params;
  return withDatabase(
    withAuthenticatedUser(async (currentRequest, db) => {
      const body = new Request(currentRequest.url, {
        method: "POST",
        body: JSON.stringify({ commentId }),
      });
      return CommentController.displayComment(
        new NextRequest(body),
        db
      );
    })
  )(request);
}

export async function DELETE(request: NextRequest, context: Context) {
  const { commentId } = await context.params;
  return withDatabase(
    withAdministrator(async (currentRequest, db) => {
      const body = new NextRequest(
        new Request(currentRequest.url, {
          method: "POST",
          body: JSON.stringify({ commentId }),
        })
      );
      return CommentController.deleteComment(body, db);
    })
  )(request);
}
