import { SupabaseClient } from "@supabase/supabase-js";
import { CalendarInput } from "../types/crud.types";

export class CalendarRepository {
  static async create(
    db: SupabaseClient,
    calendar: Required<CalendarInput>
  ) {
    return db
      .from("Calendar")
      .insert(calendar)
      .select()
      .single();
  }

  static async findById(
    db: SupabaseClient,
    calendarId: string
  ) {
    return db
      .from("Calendar")
      .select("*")
      .eq("id", calendarId)
      .maybeSingle();
  }

  static async update(
    db: SupabaseClient,
    calendarId: string,
    changes: Partial<CalendarInput>
  ) {
    return db
      .from("Calendar")
      .update(changes)
      .eq("id", calendarId)
      .select()
      .single();
  }

  static async delete(
    db: SupabaseClient,
    calendarId: string
  ) {
    return db
      .from("Calendar")
      .delete()
      .eq("id", calendarId);
  }
}