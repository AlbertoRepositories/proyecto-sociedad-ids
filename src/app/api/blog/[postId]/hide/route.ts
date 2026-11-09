import { NextRequest } from "next/server";
import { withDatabase } from "../../../../../middlewares/database.middleware";
import { withAdministrator } from "../../../route.helpers";
import { BlogController } from "../../../../../controllers/blog.controller";

interface Context {
  params: Promise<{ postId: string }>;
}

export async function POST(request: NextRequest, context: Context) {
  const { postId } = await context.params;
  return withDatabase(
    withAdministrator((currentRequest, db) =>
      BlogController.hidePost(currentRequest, db, postId)
    )
  )(request);
}
