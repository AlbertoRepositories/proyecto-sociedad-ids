import { NextResponse } from "next/server";
import { AuthenticatedUser } from "../middlewares/auth.middleware";
import { UserType } from "../types/enums";

export class AuthController {
  /**
 * Checks permissions using the authenticated identity
 * previously validated by auth.middleware.ts.
 */
  static checkPermission(
    user: AuthenticatedUser | null
  ): NextResponse {
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "El usuario no está autenticado.",
        },
        { status: 401 }
      );
    }

    const hasPermission =
      user.role === UserType.ADMINISTRATOR;

    return NextResponse.json({
      success: true,
      hasPermission,
    });
  }
}
