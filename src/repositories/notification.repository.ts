import { SupabaseClient } from "@supabase/supabase-js";
import { NotificationInput } from "../types/crud.types";

export class NotificationRepository {
  static async create(
    db: SupabaseClient,
    notification: Required<NotificationInput>
  ) {
    return db
      .from("Notification")
      .insert(notification)
      .select()
      .single();
  }

  static async createMany(
    db: SupabaseClient,
    notifications: Required<NotificationInput>[]
  ) {
    return db
      .from("Notification")
      .insert(notifications)
      .select();
  }

  static async findUnreadByRecipient(
    db: SupabaseClient,
    recipientId: string
  ) {
    return db
      .from("Notification")
      .select("*")
      .eq("recipientId", recipientId)
      .eq("isRead", false)
      .order("notificationTime", {
        ascending: false,
      });
  }

  static async markAsRead(
    db: SupabaseClient,
    notificationId: string
  ) {
    return db
      .from("Notification")
      .update({ isRead: true })
      .eq("id", notificationId)
      .select()
      .single();
  }

  static async delete(
    db: SupabaseClient,
    notificationId: string
  ) {
    return db
      .from("Notification")
      .delete()
      .eq("id", notificationId);
  }
}