import { Blog } from "./Blog";
import { User } from "./User";

export interface CalendarProperties {
  id: string;
  semesterStartDate: Date;
  semesterEndDate: Date;
  events?: Blog[];
}

/**
 * Represents the academic event calendar.
 *
 * - SRP: manages calendar boundaries and event membership.
 * - DIP: stores Blog abstractions instead of concrete event classes.
 *
 * - Encapsulate Collection: event collection changes through
 *   calendar methods.
 */
export class Calendar {
  public id: string;
  public semesterStartDate: Date;
  public semesterEndDate: Date;
  public events: Blog[];

  private notificationRequests: Map<
    string,
    User[]
  > = new Map();

  constructor(properties: CalendarProperties) {
    this.id = properties.id;
    this.semesterStartDate =
      properties.semesterStartDate;
    this.semesterEndDate =
      properties.semesterEndDate;
    this.events = [...(properties.events ?? [])];
  }

  public registerEvent(event: Blog): boolean {
    if (
      !this.isWithinSemester(event) ||
      this.events.some(
        (existingEvent) =>
          existingEvent.id === event.id
      )
    ) {
      return false;
    }

    this.events.push(event);
    return true;
  }

  public editEvent(event: Blog): boolean {
    const eventIndex = this.events.findIndex(
      (existingEvent) =>
        existingEvent.id === event.id
    );

    if (
      eventIndex === -1 ||
      !this.isWithinSemester(event)
    ) {
      return false;
    }

    this.events[eventIndex] = event;
    return true;
  }

  public hideEvent(event: Blog): boolean {
    const existingEvent = this.findEvent(event.id);

    return existingEvent
      ? existingEvent.hidePost()
      : false;
  }

  public deleteEvent(event: Blog): boolean {
    const originalLength = this.events.length;

    this.events = this.events.filter(
      (existingEvent) =>
        existingEvent.id !== event.id
    );

    return this.events.length < originalLength;
  }

  public displayEvents(): Blog[] {
    return this.events
      .filter((event) => event.isVisible)
      .sort(
        (first, second) =>
          first.eventStartDate.getTime() -
          second.eventStartDate.getTime()
      );
  }

  public requestEventNotification(
    event: Blog,
    recipients: User[]
  ): void {
    if (!this.findEvent(event.id)) {
      return;
    }

    this.notificationRequests.set(
      event.id,
      [...recipients]
    );
  }

  private isWithinSemester(event: Blog): boolean {
    return (
      event.eventStartDate >=
        this.semesterStartDate &&
      event.eventEndDate <= this.semesterEndDate
    );
  }

  private findEvent(
    eventId: string
  ): Blog | undefined {
    return this.events.find(
      (event) => event.id === eventId
    );
  }
}