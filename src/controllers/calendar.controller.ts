import { NextRequest, NextResponse } from "next/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { parseBlogInput } from "../dtos/crud.dto";
import { CalendarService } from "../services/calendar.service";
import { BlogService } from "../services/blog.service";
import { ContentType } from "../types/enums";
import {
  badRequest,
  databaseError,
  notFound,
  readBody,
} from "./controller.helpers";

export class CalendarController {
  static async registerEvent(request: NextRequest, db: SupabaseClient) {
    const body = await readBody<unknown>(request);
    const value =
      typeof body === "object" && body !== null && "eventData" in body
        ? (body as { eventData: unknown }).eventData
        : body;
    const input = parseBlogInput(value);
    if (!input || input.publicationType !== ContentType.EVENT) {
      return badRequest("Invalid event data.");
    }

    const result = await BlogService.publishPost(db, input);
    if (result.error) return databaseError(result.error, "Could not register the event.");
    return NextResponse.json({ success: true, data: result.data }, { status: 201 });
  }

  static async editEvent(
    request: NextRequest,
    db: SupabaseClient,
    eventId: string
  ) {
    const body = await readBody<unknown>(request);
    const input = parseBlogInput(body);
    if (!input || input.publicationType !== ContentType.EVENT) {
      return badRequest("Invalid event data.");
    }

    const result = await BlogService.editPost(db, eventId, input);
    if (result.error) return databaseError(result.error, "Could not edit the event.");
    if (!result.data) return notFound("Event not found.");
    return NextResponse.json({ success: true, data: result.data });
  }

  static async hideEvent(request: NextRequest, db: SupabaseClient) {
    const body = await readBody<{ eventId?: string }>(request);
    if (!body?.eventId) return badRequest("eventId is required.");
    const result = await BlogService.hidePost(db, body.eventId);
    if (result.error) return databaseError(result.error, "Could not hide the event.");
    return NextResponse.json({ success: true, data: result.data });
  }

  static async deleteEvent(request: NextRequest, db: SupabaseClient) {
    const body = await readBody<{ eventId?: string }>(request);
    if (!body?.eventId) return badRequest("eventId is required.");
    const result = await BlogService.deletePost(db, body.eventId);
    if (result.error) return databaseError(result.error, "Could not delete the event.");
    return NextResponse.json({ success: true });
  }

  static async displayEvents(_request: NextRequest, db: SupabaseClient) {
    const result = await CalendarService.displayEvents(db);
    if (result.error) return databaseError(result.error, "Could not find events.");
    return NextResponse.json({ success: true, data: result.data });
  }

  static async requestEventNotification(request: NextRequest, db: SupabaseClient) {
    const body = await readBody<{
      event?: { title?: string; content?: string };
      recipients?: string[];
    }>(request);
    if (!body?.event?.title || !body.event.content || !body.recipients?.length) {
      return badRequest("event and recipients are required.");
    }

    const result = await Promise.all(
      body.recipients.map((recipientId) =>
        import("../services/notification.service").then(({ NotificationService }) =>
          NotificationService.notify(db, {
            title: body.event?.title ?? "",
            content: body.event?.content ?? "",
            recipientId,
            notificationType: "EVENT_NOTIFICATION",
          })
        )
      )
    );
    const failed = result.find((item) => item.error);
    if (failed?.error) return databaseError(failed.error, "Could not create notifications.");
    return NextResponse.json({ success: true, data: result.map((item) => item.data) }, { status: 201 });
  }
}
