import { NextRequest } from "next/server";
import { withDatabase } from "../../../../middlewares/database.middleware";
import { withAuthenticatedUser } from "../../route.helpers";
import { UserController } from "../../../../controllers/user.controller";
import { authenticateRequest } from "../../../../middlewares/auth.middleware";

export const GET = withDatabase(
  withAuthenticatedUser(async (request: NextRequest, db) => {
    const result = authenticateRequest(request);
    if (!result.authenticated) return result.response;
    return UserController.getProfile(db, String(result.user.id));
  })
);