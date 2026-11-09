import {
  NextRequest,
  NextResponse,
} from "next/server";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  badRequest,
  databaseError,
} from "./controller.helpers";

export class ForumController {
  static async displayComments(
    request: NextRequest,
    db: SupabaseClient
  ): Promise<NextResponse> {
    const forumId =
      request.nextUrl.searchParams.get("forumId");

    if (!forumId) {
      return badRequest("forumId es requerido.");
    }

    const { data, error } = await db
      .from("Comment")
      .select("*")
      .eq("forumId", forumId)
      .eq("isHiddenByAuthor", false)
      .order("creationDate", {
        ascending: true,
      });

    if (error) {
      return databaseError(
        error,
        "No se pudieron consultar los comentarios."
      );
    }

    return NextResponse.json({
      success: true,
      data,
    });
  }

  static async addComment(
    request: NextRequest,
    db: SupabaseClient
  ): Promise<NextResponse> {
    const body = await request.json().catch(() => null);
    const comment = body?.comment;

    if (
      !comment?.content ||
      !comment.authorId ||
      !comment.forumId
    ) {
      return badRequest(
        "content, authorId y forumId son requeridos."
      );
    }

    const { data, error } = await db
      .from("Comment")
      .insert({
        content: comment.content.trim(),
        authorId: comment.authorId,
        forumId: comment.forumId,
        parentCommentId:
          comment.parentCommentId ?? null,
        likeCount: 0,
        isHiddenByAuthor: false,
      })
      .select()
      .single();

    if (error) {
      return databaseError(
        error,
        "No se pudo agregar el comentario."
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Comment added",
        data,
      },
      { status: 201 }
    );
  }
}
