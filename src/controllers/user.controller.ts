import {
  NextRequest,
  NextResponse,
} from "next/server";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  badRequest,
  databaseError,
  notFound,
  readBody,
} from "./controller.helpers";

export class UserController {
  static async changeUsername(
    request: NextRequest,
    db: SupabaseClient,
    userId: string
  ): Promise<NextResponse> {
    const body = await readBody<{
      newUsername?: string;
    }>(request);

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "El usuario no está autenticado.",
        },
        { status: 401 }
      );
    }

    if (!body?.newUsername?.trim()) {
      return badRequest("Username is required");
    }

    const { data, error } = await db
      .from("User")
      .update({
        username: body.newUsername.trim(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      return databaseError(
        error,
        "No se pudo cambiar el username."
      );
    }

    if (!data) {
      return notFound("Usuario no encontrado.");
    }

    return NextResponse.json({
      success: true,
      message: "Username changed successfully",
      data,
    });
  }

  static async updateNotificationPreference(
    request: NextRequest,
    db: SupabaseClient,
    userId: string
  ): Promise<NextResponse> {
    const body = await readBody<{
      enabled?: boolean;
    }>(request);

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "El usuario no está autenticado.",
        },
        { status: 401 }
      );
    }

    if (typeof body?.enabled !== "boolean") {
      return badRequest(
        "enabled debe ser boolean."
      );
    }

    const { data, error } = await db
      .from("User")
      .update({
        notificationsEnabled: body.enabled,
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      return databaseError(
        error,
        "No se pudo actualizar la preferencia."
      );
    }

    if (!data) {
      return notFound("Usuario no encontrado.");
    }

    return NextResponse.json({
      success: true,
      message: "Notification preference updated",
      data,
    });
  }
}
