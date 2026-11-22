import { NextRequest } from "next/server";
import { withDatabase } from "../../../middlewares/database.middleware";
import { withAdministrator } from "../route.helpers";
import { BlogController } from "../../../controllers/blog.controller";

export const GET = withDatabase((request: NextRequest, db) =>
  BlogController.listPosts(request, db)
);

export const POST = withDatabase(
  withAdministrator((request: NextRequest, db) =>
    BlogController.publishPost(request, db)
  )
);