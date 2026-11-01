import { Blog } from "./Blog";
import { User } from "./User";

/**
 * Data required to create a Calendar entity.
 */
export interface CalendarProperties {
  id: string;
  semesterStartDate: Date;
  semesterEndDate: Date;
  events?: Blog[];
}

/**
 * Represents the academic event calendar.
 *
 * SOLID:
 * - SRP: manages calendar boundaries and event membership.
 * - DIP: stores Blog abstractions instead of concrete event classes.
 *
 * Refactoring:
 * - Encapsulate Collection: event collection changes through
 *   calendar methods.
 */
export class Calendar {
  public id: string;
  public semesterStartDate: Date;
  public semesterEndDate: Date;
  public events: Blog[];

  /**
   * Temporarily stores notification requests until a service
   * is introduced to deliver them through Supabase.
   */
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

  /**
   * Registers an event that belongs to the semester.
   */
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

  /**
   * Replaces an existing event with its updated version.
   */
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

  /**
   * Hides an event without removing it from the calendar.
   */
  public hideEvent(event: Blog): boolean {
    const existingEvent = this.findEvent(event.id);

    return existingEvent
      ? existingEvent.hidePost()
      : false;
  }

  /**
   * Removes an event from the in-memory calendar collection.
   */
  public deleteEvent(event: Blog): boolean {
    const originalLength = this.events.length;

    this.events = this.events.filter(
      (existingEvent) =>
        existingEvent.id !== event.id
    );

    return this.events.length < originalLength;
  }

  /**
   * Returns visible events ordered by their start date.
   */
  public displayEvents(): Blog[] {
    return this.events
      .filter((event) => event.isVisible)
      .sort(
        (first, second) =>
          first.eventStartDate.getTime() -
          second.eventStartDate.getTime()
      );
  }

  /**
   * Stores a notification request for later service processing.
   */
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

  /**
   * Checks whether an event belongs to the semester.
   */
  private isWithinSemester(event: Blog): boolean {
    return (
      event.eventStartDate >=
        this.semesterStartDate &&
      event.eventEndDate <= this.semesterEndDate
    );
  }

  /**
   * Finds an event by identifier.
   */
  private findEvent(
    eventId: string
  ): Blog | undefined {
    return this.events.find(
      (event) => event.id === eventId
    );
  }
}