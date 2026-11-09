import { SupabaseClient } from "@supabase/supabase-js";
import { NotificationInput } from "../types/crud.types";
import { NotificationRepository } from "../repositories/notification.repository";

export class NotificationService {
  static async notify(
    db: SupabaseClient,
    input: NotificationInput
  ) {
    if (
      !input.title.trim() ||
      !input.content.trim() ||
      !input.recipientId
    ) {
      throw new Error(
        "Title, content and recipientId are required."
      );
    }

    return NotificationRepository.create(db, {
      id: input.id ?? crypto.randomUUID(),
      title: input.title.trim(),
      content: input.content.trim(),
      recipientId: input.recipientId,
      notificationType:
        input.notificationType || "SYSTEM",
      isRead: input.isRead ?? false,
    });
  }

  static async displayInSystem(
    db: SupabaseClient,
    recipientId: string
  ) {
    return NotificationRepository.findUnreadByRecipient(
      db,
      recipientId
    );
  }

  static async markAsRead(
    db: SupabaseClient,
    notificationId: string
  ) {
    return NotificationRepository.markAsRead(
      db,
      notificationId
    );
  }
}