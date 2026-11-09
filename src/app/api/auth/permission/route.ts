import { NextRequest } from "next/server";
import { withAuthenticatedUser } from "../../route.helpers";
import { AuthController } from "../../../../controllers/auth.controller";

export const GET = withAuthenticatedUser(async (request: NextRequest) => {
  const result = await import("../../../../middlewares/auth.middleware").then(
    ({ authenticateRequest }) => authenticateRequest(request)
  );

  if (!result.authenticated) {
    return result.response;
  }

  return AuthController.checkPermission(result.user);
});
