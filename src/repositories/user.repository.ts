import { SupabaseClient } from "@supabase/supabase-js";
import {
  UserInput,
  UserUpdateInput,
} from "../types/crud.types";

export class UserRepository {
  static async create(
    db: SupabaseClient,
    user: Required<UserInput>
  ) {
    return db
      .from("User")
      .insert(user)
      .select()
      .single();
  }

  static async findById(
    db: SupabaseClient,
    userId: string
  ) {
    return db
      .from("User")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
  }

  static async update(
    db: SupabaseClient,
    userId: string,
    changes: UserUpdateInput
  ) {
    return db
      .from("User")
      .update(changes)
      .eq("id", userId)
      .select()
      .single();
  }

  static async delete(
    db: SupabaseClient,
    userId: string
  ) {
    return db
      .from("User")
      .delete()
      .eq("id", userId);
  }
}