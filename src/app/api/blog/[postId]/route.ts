import { NextRequest } from "next/server";
import { withDatabase } from "../../../../middlewares/database.middleware";
import { withAdministrator, withAuthenticatedUser } from "../../route.helpers";
import { BlogController } from "../../../../controllers/blog.controller";

interface Context {
  params: Promise<{ postId: string }>;
}

export async function GET(request: NextRequest, context: Context) {
  const { postId } = await context.params;
  return withDatabase(
    withAuthenticatedUser((currentRequest, db) =>
      BlogController.displayPost(currentRequest, db, postId)
    )
  )(request);
}

export async function PATCH(request: NextRequest, context: Context) {
  const { postId } = await context.params;
  return withDatabase(
    withAdministrator((currentRequest, db) =>
      BlogController.editPost(currentRequest, db, postId)
    )
  )(request);
}

export async function DELETE(request: NextRequest, context: Context) {
  const { postId } = await context.params;
  return withDatabase(
    withAdministrator((currentRequest, db) =>
      BlogController.deletePost(currentRequest, db, postId)
    )
  )(request);
}
