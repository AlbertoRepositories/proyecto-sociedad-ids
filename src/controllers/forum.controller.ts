import { NextRequest, NextResponse } from "next/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { ForumService } from "../services/forum.service";
import { CommentService } from "../services/comment.service";
import { parseCommentInput } from "../dtos/crud.dto";
import {
  badRequest,
  databaseError,
  readBody,
} from "./controller.helpers";

export class ForumController {
  static async displayComments(request: NextRequest, db: SupabaseClient) {
    const forumId = request.nextUrl.searchParams.get("forumId");
    if (!forumId) return badRequest("forumId is required.");
    const result = await ForumService.displayComments(db, forumId);
    if (result.error) return databaseError(result.error, "Could not find comments.");
    return NextResponse.json({ success: true, data: result.data });
  }

  static async addComment(request: NextRequest, db: SupabaseClient) {
    const body = await readBody<unknown>(request);
    const value =
      typeof body === "object" && body !== null && "comment" in body
        ? (body as { comment: unknown }).comment
        : body;
    const input = parseCommentInput(value);
    if (!input) return badRequest("Invalid comment data.");
    const result = await CommentService.publishComment(db, input);
    if (result.error) return databaseError(result.error, "Could not add comment.");
    return NextResponse.json({ success: true, data: result.data }, { status: 201 });
  }
}
