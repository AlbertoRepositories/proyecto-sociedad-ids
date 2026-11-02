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
 * - SRP: contains user state and user-specific behavior only.
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

  public changeUsername(newUsername: string): boolean {
    const normalizedUsername = newUsername.trim();

    if (normalizedUsername.length === 0) {
      return false;
    }

    this.username = normalizedUsername;
    return true;
  }

  public updateNotificationPreference(
    enabled: boolean
  ): void {
    this.notificationsEnabled = enabled;
  }
}

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