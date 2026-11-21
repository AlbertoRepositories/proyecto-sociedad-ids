import { NextRequest, NextResponse } from "next/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { UserService } from "../services/user.service";
import {
  badRequest,
  databaseError,
  notFound,
  readBody,
} from "./controller.helpers";

export class UserController {
  static async getProfile(db: SupabaseClient, userId: string) {
    const { data, error } = await db
      .from("User")
      .select("id, name, username, email, type, seed")
      .eq("id", userId)
      .single();

    if (error) return databaseError(error, "Could not fetch user profile.");
    if (!data) return notFound("User not found.");

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        name: data.name,
        username: data.username,
        email: data.email,
        role: data.type,
        seed: data.seed,
      },
    });
  }

  static async changeUsername(
    request: NextRequest,
    db: SupabaseClient,
    userId: string
  ) {
    const body = await readBody<{ newUsername?: string }>(request);
    if (!body?.newUsername?.trim()) return badRequest("Username is required.");
    const result = await UserService.update(db, userId, {
      username: body.newUsername.trim(),
    });
    if (result.error)
      return databaseError(result.error, "Could not change username.");
    if (!result.data) return notFound("User not found.");
    return NextResponse.json({ success: true, data: result.data });
  }

  static async changeSeed(
    request: NextRequest,
    db: SupabaseClient,
    userId: string
  ) {
    const body = await readBody<{ seed?: string }>(request);
    if (!body?.seed?.trim()) return badRequest("Seed is required.");
    const result = await UserService.update(db, userId, {
      seed: body.seed.trim(),
    });
    if (result.error)
      return databaseError(result.error, "Could not change seed.");
    if (!result.data) return notFound("User not found.");
    return NextResponse.json({ success: true, data: result.data });
  }

  static async updateNotificationPreference(
    request: NextRequest,
    db: SupabaseClient,
    userId: string
  ) {
    const body = await readBody<{ enabled?: boolean }>(request);
    if (typeof body?.enabled !== "boolean")
      return badRequest("enabled must be boolean.");
    const result = await UserService.update(db, userId, {
      notificationsEnabled: body.enabled,
    });
    if (result.error)
      return databaseError(
        result.error,
        "Could not update notification preference."
      );
    if (!result.data) return notFound("User not found.");
    return NextResponse.json({ success: true, data: result.data });
  }
}
