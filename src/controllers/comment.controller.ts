import { NextRequest, NextResponse } from "next/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { parseCommentInput } from "../dtos/crud.dto";
import { CommentService } from "../services/comment.service";
import {
  badRequest,
  databaseError,
  notFound,
  readBody,
} from "./controller.helpers";

export class CommentController {
  static async publishComment(request: NextRequest, db: SupabaseClient) {
    const body = await readBody<unknown>(request);
    const value =
      typeof body === "object" && body !== null && "comment" in body
        ? (body as { comment: unknown }).comment
        : body;
    const input = parseCommentInput(value);
    if (!input) return badRequest("Invalid comment data.");

    const result = await CommentService.publishComment(db, input);
    if (result.error) return databaseError(result.error, "Could not publish the comment.");
    return NextResponse.json({ success: true, data: result.data }, { status: 201 });
  }

  static async hideComment(request: NextRequest, db: SupabaseClient) {
    const body = await readBody<{ commentId?: string }>(request);
    if (!body?.commentId) return badRequest("commentId is required.");

    const result = await CommentService.hideComment(db, body.commentId);
    if (result.error) return databaseError(result.error, "Could not hide the comment.");
    if (!result.data) return notFound("Comment not found.");
    return NextResponse.json({ success: true, data: result.data });
  }

  static async displayComment(request: NextRequest, db: SupabaseClient) {
    const body = await readBody<{ commentId?: string }>(request);
    if (!body?.commentId) return badRequest("commentId is required.");

    const result = await CommentService.displayComment(db, body.commentId);
    if (result.error) return databaseError(result.error, "Could not find the comment.");
    if (!result.data) return notFound("Comment not found.");
    return NextResponse.json({ success: true, data: result.data });
  }

  static async deleteComment(request: NextRequest, db: SupabaseClient) {
    const body = await readBody<{ commentId?: string }>(request);
    if (!body?.commentId) return badRequest("commentId is required.");

    const result = await CommentService.deleteComment(db, body.commentId);
    if (result.error) return databaseError(result.error, "Could not delete the comment.");
    return NextResponse.json({ success: true });
  }

  static async addReply(request: NextRequest, db: SupabaseClient) {
    const body = await readBody<unknown>(request);
    const value =
      typeof body === "object" && body !== null && "reply" in body
        ? (body as { reply: unknown }).reply
        : body;
    const input = parseCommentInput(value);
    if (!input?.parentCommentId) {
      return badRequest("A parent comment is required.");
    }

    const result = await CommentService.addReply(db, input);
    if (result.error) return databaseError(result.error, "Could not add the reply.");
    return NextResponse.json({ success: true, data: result.data }, { status: 201 });
  }
}
