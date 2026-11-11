import { SupabaseClient } from "@supabase/supabase-js";
import {
  CommentInput,
  CommentUpdateInput,
} from "../types/crud.types";
import { CommentRepository } from "../repositories/comment.repository";

export class CommentService {
  static async publishComment(
    db: SupabaseClient,
    input: CommentInput
  ) {
    if (
      !input.content.trim() ||
      !input.authorId ||
      !input.forumId
    ) {
      throw new Error(
        "Content, authorId and forumId are required."
      );
    }

    return CommentRepository.create(db, {
      id: input.id ?? crypto.randomUUID(),
      content: input.content.trim(),
      authorId: input.authorId,
      forumId: input.forumId,
      parentCommentId:
        input.parentCommentId ?? null,
    });
  }

  static async addReply(
    db: SupabaseClient,
    input: CommentInput
  ) {
    if (!input.parentCommentId) {
      throw new Error(
        "parentCommentId is required for replies."
      );
    }

    return CommentService.publishComment(db, input);
  }

  static async findByForum(
    db: SupabaseClient,
    forumId: string
  ) {
    return CommentRepository.findByForum(db, forumId);
  }

  static async hideComment(
    db: SupabaseClient,
    commentId: string
  ) {
    return CommentRepository.update(
      db,
      commentId,
      { isHiddenByAuthor: true }
    );
  }

  static async displayComment(
    db: SupabaseClient,
    commentId: string
  ) {
    const result = await CommentRepository.findById(
      db,
      commentId
    );

    if (
      result.error ||
      !result.data ||
      result.data.isHiddenByAuthor
    ) {
      return {
        data: null,
        error: result.error,
      };
    }

    return result;
  }

  static async deleteComment(
    db: SupabaseClient,
    commentId: string
  ) {
    return CommentRepository.delete(db, commentId);
  }

  static async update(
    db: SupabaseClient,
    commentId: string,
    changes: CommentUpdateInput
  ) {
    return CommentRepository.update(
      db,
      commentId,
      changes
    );
  }
}