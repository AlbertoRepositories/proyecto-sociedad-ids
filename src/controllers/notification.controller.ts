import {
  NextRequest,
  NextResponse,
} from "next/server";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  badRequest,
  databaseError,
  readBody,
} from "./controller.helpers";

export class NotificationController {
  static async notify(
    request: NextRequest,
    db: SupabaseClient
  ): Promise<NextResponse> {
    const body = await readBody<{
      recipientId?: string;
      title?: string;
      content?: string;
      notificationType?: string;
    }>(request);

    if (
      !body?.recipientId ||
      !body.title ||
      !body.content
    ) {
      return badRequest(
        "recipientId, title y content son requeridos."
      );
    }

    const { data, error } = await db
      .from("Notification")
      .insert({
        title: body.title,
        content: body.content,
        recipientId: body.recipientId,
        notificationType:
          body.notificationType ?? "SYSTEM",
        isRead: false,
      })
      .select()
      .single();

    if (error) {
      return databaseError(
        error,
        "No se pudo crear la notificación."
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Notification sent",
        data,
      },
      { status: 201 }
    );
  }

  static async displayInSystem(
    request: NextRequest,
    db: SupabaseClient
  ): Promise<NextResponse> {
    const userId =
      request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return badRequest("userId es requerido.");
    }

    const { data, error } = await db
      .from("Notification")
      .select("*")
      .eq("recipientId", userId)
      .eq("isRead", false)
      .order("notificationTime", {
        ascending: false,
      });

    if (error) {
      return databaseError(
        error,
        "No se pudieron consultar las notificaciones."
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  }
}
