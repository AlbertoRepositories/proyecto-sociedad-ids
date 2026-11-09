import { SupabaseClient } from "@supabase/supabase-js";
import { CalendarInput } from "../types/crud.types";
import { CalendarRepository } from "../repositories/calendar.repository";
import { BlogService } from "./blog.service";

export class CalendarService {
  static async create(
    db: SupabaseClient,
    input: CalendarInput
  ) {
    if (
      !input.semesterStartDate ||
      !input.semesterEndDate
    ) {
      throw new Error(
        "Semester dates are required."
      );
    }

    return CalendarRepository.create(db, {
      id: input.id ?? crypto.randomUUID(),
      semesterStartDate: input.semesterStartDate,
      semesterEndDate: input.semesterEndDate,
    });
  }

  static async findById(
    db: SupabaseClient,
    calendarId: string
  ) {
    return CalendarRepository.findById(db, calendarId);
  }

  static async update(
    db: SupabaseClient,
    calendarId: string,
    changes: Partial<CalendarInput>
  ) {
    return CalendarRepository.update(
      db,
      calendarId,
      changes
    );
  }

  static async delete(
    db: SupabaseClient,
    calendarId: string
  ) {
    return CalendarRepository.delete(db, calendarId);
  }

  static async displayEvents(
    db: SupabaseClient
  ) {
    return BlogService.displayEvents(db);
  }
}