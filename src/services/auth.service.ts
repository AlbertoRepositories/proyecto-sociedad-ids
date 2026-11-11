import { AuthenticatedUser } from "../middlewares/auth.middleware";
import { UserType } from "../types/enums";

export class AuthService {
  static checkPermission(
    user: AuthenticatedUser | null
  ): boolean {
    return (
      user !== null &&
      user.role === UserType.ADMINISTRATOR
    );
  }
}