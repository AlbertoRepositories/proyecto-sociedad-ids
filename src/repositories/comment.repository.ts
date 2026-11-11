import { SupabaseClient } from "@supabase/supabase-js";
import {
  CommentInput,
  CommentUpdateInput,
} from "../types/crud.types";

export class CommentRepository {
  static async create(
    db: SupabaseClient,
    comment: Required<CommentInput>
  ) {
    return db
      .from("Comment")
      .insert(comment)
      .select()
      .single();
  }

  static async findById(
    db: SupabaseClient,
    commentId: string
  ) {
    return db
      .from("Comment")
      .select("*")
      .eq("id", commentId)
      .maybeSingle();
  }

  static async findByForum(
    db: SupabaseClient,
    forumId: string
  ) {
    return db
      .from("Comment")
      .select("*")
      .eq("forumId", forumId)
      .eq("isHiddenByAuthor", false)
      .order("creationDate", {
        ascending: true,
      });
  }

  static async update(
    db: SupabaseClient,
    commentId: string,
    changes: CommentUpdateInput
  ) {
    return db
      .from("Comment")
      .update(changes)
      .eq("id", commentId)
      .select()
      .single();
  }

  static async delete(
    db: SupabaseClient,
    commentId: string
  ) {
    return db
      .from("Comment")
      .delete()
      .eq("id", commentId);
  }
}