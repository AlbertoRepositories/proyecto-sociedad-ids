import { User } from '../models/User';

export class UserService {
  static async changeUsername(userId: string, newUsername: string): Promise<User> {
    console.log(`Changing username for user ${userId} to ${newUsername}...`);
    return { id: userId, username: newUsername } as User;
  }

  static async updateNotificationPreference(userId: string, enabled: boolean): Promise<User> {
    console.log(`Updating notifications for user ${userId} to ${enabled}...`);
    return { id: userId, notificationsEnabled: enabled } as User;
  }
}
