import {
  NextRequest,
  NextResponse,
} from "next/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { ContentType } from "../types/enums";
import {
  badRequest,
  databaseError,
  readBody,
} from "./controller.helpers";

interface EventRequest {
  title?: string;
  content?: string;
  creationDate?: string;
  expirationDate?: string | null;
  isVisible?: boolean;
  eventStartDate?: string;
  eventEndDate?: string;
  location?: string | null;
  registrationUrl?: string | null;
  imageUrls?: string[];
  calendarId?: string | null;
  administratorId?: string | null;
}

export class CalendarController {
  static async registerEvent(
    request: NextRequest,
    db: SupabaseClient
  ): Promise<NextResponse> {
    const body = await readBody<{
      eventData?: EventRequest;
    }>(request);

    const eventData = body?.eventData;

    if (
      !eventData?.title ||
      !eventData.content ||
      !eventData.eventStartDate ||
      !eventData.eventEndDate
    ) {
      return badRequest(
        "title, content, eventStartDate y eventEndDate son requeridos."
      );
    }

    const { data, error } = await db
      .from("Blog")
      .insert({
        title: eventData.title.trim(),
        content: eventData.content.trim(),
        creationDate:
          eventData.creationDate ?? new Date().toISOString(),
        expirationDate:
          eventData.expirationDate ?? null,
        isVisible: eventData.isVisible ?? true,
        viewCount: 0,
        likeCount: 0,
        publicationType: ContentType.EVENT,
        eventStartDate: eventData.eventStartDate,
        eventEndDate: eventData.eventEndDate,
        location: eventData.location ?? null,
        registrationUrl:
          eventData.registrationUrl ?? null,
        imageUrls: eventData.imageUrls ?? [],
        calendarId: eventData.calendarId ?? null,
        administratorId:
          eventData.administratorId ?? null,
      })
      .select()
      .single();

    if (error) {
      return databaseError(
        error,
        "No se pudo registrar el evento."
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Event registered",
        data,
      },
      { status: 201 }
    );
  }

  static async editEvent(
    request: NextRequest,
    db: SupabaseClient,
    eventId: string
  ): Promise<NextResponse> {
    const body = await readBody<{
      eventData?: EventRequest;
    }>(request);

    const eventData = body?.eventData;

    if (!eventId || !eventData) {
      return badRequest(
        "eventId y eventData son requeridos."
      );
    }

    const { data, error } = await db
      .from("Blog")
      .update({
        title: eventData.title,
        content: eventData.content,
        eventStartDate: eventData.eventStartDate,
        eventEndDate: eventData.eventEndDate,
        location: eventData.location,
        registrationUrl: eventData.registrationUrl,
      })
      .eq("id", eventId)
      .eq("publicationType", ContentType.EVENT)
      .select()
      .single();

    if (error) {
      return databaseError(
        error,
        "No se pudo editar el evento."
      );
    }

    return NextResponse.json({
      success: true,
      message: "Event edited",
      data,
    });
  }

  static async hideEvent(
    request: NextRequest,
    db: SupabaseClient
  ): Promise<NextResponse> {
    const body = await readBody<{ eventId?: string }>(
      request
    );

    if (!body?.eventId) {
      return badRequest("eventId es requerido.");
    }

    const { error } = await db
      .from("Blog")
      .update({ isVisible: false })
      .eq("id", body.eventId)
      .eq("publicationType", ContentType.EVENT);

    if (error) {
      return databaseError(
        error,
        "No se pudo ocultar el evento."
      );
    }

    return NextResponse.json({
      success: true,
      message: "Event hidden",
    });
  }

  static async deleteEvent(
    request: NextRequest,
    db: SupabaseClient
  ): Promise<NextResponse> {
    const body = await readBody<{ eventId?: string }>(
      request
    );

    if (!body?.eventId) {
      return badRequest("eventId es requerido.");
    }

    const { error } = await db
      .from("Blog")
      .delete()
      .eq("id", body.eventId)
      .eq("publicationType", ContentType.EVENT);

    if (error) {
      return databaseError(
        error,
        "No se pudo eliminar el evento."
      );
    }

    return NextResponse.json({
      success: true,
      message: "Event deleted",
    });
  }

  static async displayEvents(
    _request: NextRequest,
    db: SupabaseClient
  ): Promise<NextResponse> {
    const { data, error } = await db
      .from("Blog")
      .select("*")
      .eq("publicationType", ContentType.EVENT)
      .eq("isVisible", true)
      .order("eventStartDate", {
        ascending: true,
      });

    if (error) {
      return databaseError(
        error,
        "No se pudieron consultar los eventos."
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  }

  static async requestEventNotification(
    request: NextRequest,
    db: SupabaseClient
  ): Promise<NextResponse> {
    const body = await readBody<{
      event?: {
        title?: string;
        content?: string;
      };
      recipients?: string[];
    }>(request);

    if (
      !body?.event?.title ||
      !body.event.content ||
      !body.recipients?.length
    ) {
      return badRequest(
        "event y recipients son requeridos."
      );
    }

    const notifications = body.recipients.map(
      (recipientId) => ({
        title: body.event?.title,
        content: body.event?.content,
        isRead: false,
        recipientId,
        notificationType: "EVENT_NOTIFICATION",
      })
    );

    const { data, error } = await db
      .from("Notification")
      .insert(notifications)
      .select();

    if (error) {
      return databaseError(
        error,
        "No se pudieron crear las notificaciones."
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Event notification requested",
        data,
      },
      { status: 201 }
    );
  }
}