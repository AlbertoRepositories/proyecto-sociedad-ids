import { SupabaseClient } from "@supabase/supabase-js";
import { ForumInput } from "../types/crud.types";
import { ForumRepository } from "../repositories/forum.repository";
import { CommentService } from "./comment.service";

export class ForumService {
  static async create(
    db: SupabaseClient,
    input: ForumInput
  ) {
    if (!input.blogId) {
      throw new Error("blogId is required.");
    }

    return ForumRepository.create(db, {
      blogId: input.blogId,
      lastActivityDate:
        input.lastActivityDate ?? null,
    });
  }

  static async findByBlogId(
    db: SupabaseClient,
    blogId: string
  ) {
    return ForumRepository.findByBlogId(db, blogId);
  }

  static async displayComments(
    db: SupabaseClient,
    forumId: string
  ) {
    return CommentService.findByForum(db, forumId);
  }

  static async updateActivity(
    db: SupabaseClient,
    blogId: string
  ) {
    return ForumRepository.updateActivity(
      db,
      blogId,
      new Date().toISOString()
    );
  }

  static async delete(
    db: SupabaseClient,
    blogId: string
  ) {
    return ForumRepository.delete(db, blogId);
  }
}