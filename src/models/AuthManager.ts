import { User } from "./User";
import { UserType } from "../types/enums";

/**
 * Represents the access-control domain entity.
  
 * - SRP: manages whitelist and domain permission rules.

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

  public removeEmail(email: string): boolean {
    return this.emails.delete(
      AuthManager.normalizeEmail(email)
    );
  }

  public isEmailWhitelisted(
    email: string
  ): boolean {
    return this.emails.has(
      AuthManager.normalizeEmail(email)
    );
  }

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

  private static normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  
   // Performs basic email validation.
  private static isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
    );
  }
}