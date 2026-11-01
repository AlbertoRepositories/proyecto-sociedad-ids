import { User } from "./User";

/**
 * Data required to create a notification.
 */
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
 * SOLID:
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

  /**
   * Sends the notification to a recipient.
   */
  public abstract notify(
    recipient: User
  ): Promise<boolean>;
}

/**
 * Notification displayed inside the application.
 */
export class SystemNotification
  extends Notification
{
  /**
   * Displays the notification when the recipient is valid.
   */
  public displayInSystem(
    recipient: User
  ): boolean {
    return recipient.id.trim().length > 0;
  }

  /**
   * Sends the system notification.
   *
   * The real persistence or delivery operation belongs to a service.
   */
  public async notify(
    recipient: User
  ): Promise<boolean> {
    return this.displayInSystem(recipient);
  }
}