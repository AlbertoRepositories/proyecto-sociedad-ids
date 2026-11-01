import { User } from "./User";
import { UserType } from "../types/enums";

/**
 * Represents the access-control domain entity.
 *
 * SOLID:
 * - SRP: manages whitelist and domain permission rules.
 *
 * Refactoring:
 * - Encapsulate Collection: email collection changes through methods.
 */
export class AuthManager {
  private readonly emails: Set<string>;

  private static readonly PUBLIC_ACTIONS = new Set([
    "read",
    "view",
    "display",
    "comment",
  ]);

  constructor(emails: string[] = []) {
    this.emails = new Set(
      emails
        .map((email) =>
          AuthManager.normalizeEmail(email)
        )
        .filter((email) => email.length > 0)
    );
  }

    /**
   * Adds a valid email to the administrator whitelist.
   *
   * This method only changes the domain collection. Authorization
   * for who may call it belongs to the service or middleware layer.
   */
  public addEmail(email: string): boolean {
    const normalizedEmail =
      AuthManager.normalizeEmail(email);

    if (!AuthManager.isValidEmail(normalizedEmail)) {
      return false;
    }

    const previousSize = this.emails.size;
    this.emails.add(normalizedEmail);

    return this.emails.size > previousSize;
  }

    /**
   * Removes an email from the administrator whitelist.
   *
   * Authorization for this operation belongs to the service or
   * middleware layer because only authorized administrators may
   * manage the whitelist.
   */
  public removeEmail(email: string): boolean {
    return this.emails.delete(
      AuthManager.normalizeEmail(email)
    );
  }

  /**
   * Checks whether an email belongs to the whitelist.
   */
  public isEmailWhitelisted(
    email: string
  ): boolean {
    return this.emails.has(
      AuthManager.normalizeEmail(email)
    );
  }

  /**
   * Checks whether a user can execute an action.
   *
   * Regular users may perform public actions such as reading content
   * and participating in the forum. Administrative actions are only
   * available to administrator users.
   *
   * The whitelist is intentionally not used here as a general access
   * mechanism. It is used to control administrator authorization and
   * role management, which will be enforced by the service layer.
   */
  public checkPermission(
    user: User,
    action: string
  ): boolean {
    const normalizedAction = action
      .trim()
      .toLowerCase();

    if (
      AuthManager.PUBLIC_ACTIONS.has(
        normalizedAction
      )
    ) {
      return true;
    }

    return user.type === UserType.ADMINISTRATOR;
  }

  /**
   * Normalizes email values consistently.
   */
  private static normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  /**
   * Performs basic email validation.
   *
   * Full validation and database uniqueness belong to a service
   * or repository.
   */
  private static isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
    );
  }
}