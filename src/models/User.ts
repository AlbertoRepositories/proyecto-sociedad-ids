import { UserType } from "../types/enums";

/**
 * Data required to create a User entity.
 */
export interface UserProperties {
  id: string;
  name: string;
  username: string;
  email: string;
  type: UserType;
  externalAuthProvider: string;
  notificationsEnabled?: boolean;
}

/**
 * Represents a platform user.
 *
 * SOLID:
 * - SRP: contains user state and user-specific behavior only.
 *
 * Refactoring:
 * - Replace Primitive Data Holder: behavior was moved from a
 *   plain interface into the domain entity.
 */
export class User {
  public id: string;
  public name: string;
  public username: string;
  public email: string;
  public type: UserType;
  public externalAuthProvider: string;
  public notificationsEnabled: boolean;

  constructor(properties: UserProperties) {
    this.id = properties.id;
    this.name = properties.name;
    this.username = properties.username;
    this.email = properties.email;
    this.type = properties.type;
    this.externalAuthProvider =
      properties.externalAuthProvider;
    this.notificationsEnabled =
      properties.notificationsEnabled ?? false;
  }

  /**
   * Changes the username when the new value is valid.
   *
   * Uniqueness must be checked by a repository or service because
   * the entity does not access the database.
   */
  public changeUsername(newUsername: string): boolean {
    const normalizedUsername = newUsername.trim();

    if (normalizedUsername.length === 0) {
      return false;
    }

    this.username = normalizedUsername;
    return true;
  }

  /**
   * Updates the user's notification preference.
   */
  public updateNotificationPreference(
    enabled: boolean
  ): void {
    this.notificationsEnabled = enabled;
  }
}

/**
 * Represents an administrator user.
 */
export class Administrator extends User {
  public administratorTitle: string;

  constructor(
    properties: UserProperties & {
      administratorTitle: string;
    }
  ) {
    super({
      ...properties,
      type: UserType.ADMINISTRATOR,
    });

    this.administratorTitle =
      properties.administratorTitle;
  }
}