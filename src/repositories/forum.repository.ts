import { SupabaseClient } from "@supabase/supabase-js";
import { ForumInput } from "../types/crud.types";

export class ForumRepository {
  static async create(
    db: SupabaseClient,
    forum: Required<ForumInput>
  ) {
    return db
      .from("Forum")
      .insert({
        blogId: forum.blogId,
        lastActivityDate:
          forum.lastActivityDate ?? null,
      })
      .select()
      .single();
  }

  static async findByBlogId(
    db: SupabaseClient,
    blogId: string
  ) {
    return db
      .from("Forum")
      .select("*")
      .eq("blogId", blogId)
      .maybeSingle();
  }

  static async updateActivity(
    db: SupabaseClient,
    blogId: string,
    lastActivityDate: string
  ) {
    return db
      .from("Forum")
      .update({ lastActivityDate })
      .eq("blogId", blogId)
      .select()
      .single();
  }

  static async delete(
    db: SupabaseClient,
    blogId: string
  ) {
    return db
      .from("Forum")
      .delete()
      .eq("blogId", blogId);
  }
}