import { NextRequest } from "next/server";
import { withDatabase } from "../../../../../middlewares/database.middleware";
import { withAuthenticatedUser } from "../../../route.helpers";
import { BlogController } from "../../../../../controllers/blog.controller";

interface Context {
  params: Promise<{ postId: string }>;
}

export async function POST(request: NextRequest, context: Context) {
  const { postId } = await context.params;
  return withDatabase(
    withAuthenticatedUser((currentRequest, db) =>
      BlogController.registerView(currentRequest, db, postId)
    )
  )(request);
}
