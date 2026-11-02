import { User } from "./User";

export interface NotificationProperties {
  id: string;
  notificationTime?: Date;
  title: string;
  content: string;
  isRead?: boolean;
}

/**
 * Base notification abstraction.
 *
 * - OCP: new notification types can extend this abstraction.
 * - DIP: consumers depend on Notification rather than a concrete
 *   notification implementation.
 */

export abstract class Notification {
  public id: string;
  public notificationTime: Date;
  public title: string;
  public content: string;
  public isRead: boolean;

  protected constructor(
    properties: NotificationProperties
  ) {
    this.id = properties.id;
    this.notificationTime =
      properties.notificationTime ?? new Date();
    this.title = properties.title;
    this.content = properties.content;
    this.isRead = properties.isRead ?? false;
  }

  public abstract notify(
    recipient: User
  ): Promise<boolean>;
}


 // Notification displayed inside the application.
export class SystemNotification
  extends Notification
{

  public displayInSystem(
    recipient: User
  ): boolean {
    return recipient.id.trim().length > 0;
  }

  public async notify(
    recipient: User
  ): Promise<boolean> {
    return this.displayInSystem(recipient);
  }
}