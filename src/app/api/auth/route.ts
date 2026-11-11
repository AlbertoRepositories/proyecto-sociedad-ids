import { NextRequest } from "next/server";
import { withAuthenticatedUser } from "../route.helpers";
import { AuthController } from "../../../controllers/auth.controller";
import { authenticateRequest } from "../../../middlewares/auth.middleware";

export const GET = withAuthenticatedUser(
  async (request: NextRequest) => {
    const result = authenticateRequest(request);

    if (!result.authenticated) {
      return result.response;
    }

    return AuthController.checkPermission(result.user);
  }
);
