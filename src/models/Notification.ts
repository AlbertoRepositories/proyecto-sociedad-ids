import { User } from './User';

// This must be filled before being sent
export abstract class Notification {
  id: string = '';
  notificationTime: Date = new Date();
  title: string = 'Default title';
  content: string = 'Default notification content';
  isRead: boolean = false;

  abstract notify(recipient: User): Promise<boolean>;
}

export class SystemNotification extends Notification {
  displayInSystem(recipient: User): boolean {
    // Logic for displaying in system
    return true;
  }

  async notify(recipient: User): Promise<boolean> {
    // Logic for notification
    return true;
  }
}