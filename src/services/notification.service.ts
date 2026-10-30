import { User } from '../models/User';
import { Notification } from '../models/Notification';

export class NotificationService {
  static async notify(userId: string, content: string): Promise<boolean> {
    console.log(`Sending notification to user ${userId}...`);
    return true;
  }

  static async displayInSystem(userId: string, content: string): Promise<boolean> {
    console.log(`Displaying system notification for user ${userId}...`);
    return true;
  }
}
