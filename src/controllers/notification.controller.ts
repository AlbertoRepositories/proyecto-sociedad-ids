import { NextRequest, NextResponse } from "next/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { NotificationService } from "../services/notification.service";
import {
  badRequest,
  databaseError,
  readBody,
} from "./controller.helpers";

export class NotificationController {
  static async notify(request: NextRequest, db: SupabaseClient) {
    const body = await readBody<{
      recipientId?: string;
      title?: string;
      content?: string;
      notificationType?: string;
    }>(request);
    if (!body?.recipientId || !body.title || !body.content) {
      return badRequest("recipientId, title and content are required.");
    }
    const result = await NotificationService.notify(db, {
      recipientId: body.recipientId,
      title: body.title,
      content: body.content,
      notificationType: body.notificationType ?? "SYSTEM",
    });
    if (result.error) return databaseError(result.error, "Could not create notification.");
    return NextResponse.json({ success: true, data: result.data }, { status: 201 });
  }

  static async displayInSystem(request: NextRequest, db: SupabaseClient) {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) return badRequest("userId is required.");
    const result = await NotificationService.displayInSystem(db, userId);
    if (result.error) return databaseError(result.error, "Could not find notifications.");
    return NextResponse.json({ success: true, data: result.data });
  }
}
