import {
  NextRequest,
  NextResponse,
} from "next/server";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  badRequest,
  databaseError,
  notFound,
  readBody,
} from "./controller.helpers";

interface CommentRequest {
  content?: string;
  creationDate?: string;
  authorId?: string;
  author?: {
    id?: string;
  };
  forumId?: string;
  parentCommentId?: string | null;
}

function getAuthorId(
  comment: CommentRequest
): string | undefined {
  return comment.authorId ?? comment.author?.id;
}

export class CommentController {
  static async publishComment(
    request: NextRequest,
    db: SupabaseClient
  ): Promise<NextResponse> {
    const body = await readBody<{
      comment?: CommentRequest;
    }>(request);

    const comment = body?.comment;
    const authorId = comment
      ? getAuthorId(comment)
      : undefined;

    if (
      !comment?.content ||
      !authorId ||
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
        creationDate:
          comment.creationDate ?? new Date().toISOString(),
        likeCount: 0,
        isHiddenByAuthor: false,
        authorId,
        forumId: comment.forumId,
        parentCommentId: null,
      })
      .select()
      .single();

    if (error) {
      return databaseError(
        error,
        "No se pudo publicar el comentario."
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Comment published",
        data,
      },
      { status: 201 }
    );
  }

  static async hideComment(
    request: NextRequest,
    db: SupabaseClient
  ): Promise<NextResponse> {
    const body = await readBody<{ commentId?: string }>(
      request
    );

    if (!body?.commentId) {
      return badRequest("commentId es requerido.");
    }

    const { data, error } = await db
      .from("Comment")
      .update({ isHiddenByAuthor: true })
      .eq("id", body.commentId)
      .select()
      .single();

    if (error) {
      return databaseError(
        error,
        "No se pudo ocultar el comentario."
      );
    }

    if (!data) {
      return notFound("Comentario no encontrado.");
    }

    return NextResponse.json({
      success: true,
      message: "Comment hidden",
      data,
    });
  }

  static async displayComment(
    request: NextRequest,
    db: SupabaseClient
  ): Promise<NextResponse> {
    const body = await readBody<{ commentId?: string }>(
      request
    );

    if (!body?.commentId) {
      return badRequest("commentId es requerido.");
    }

    const { data, error } = await db
      .from("Comment")
      .select("*")
      .eq("id", body.commentId)
      .eq("isHiddenByAuthor", false)
      .single();

    if (error) {
      return databaseError(
        error,
        "No se pudo consultar el comentario."
      );
    }

    if (!data) {
      return notFound("Comentario no encontrado.");
    }

    return NextResponse.json({
      success: true,
      data,
    });
  }

  static async deleteComment(
    request: NextRequest,
    db: SupabaseClient
  ): Promise<NextResponse> {
    const body = await readBody<{ commentId?: string }>(
      request
    );

    if (!body?.commentId) {
      return badRequest("commentId es requerido.");
    }

    const { error } = await db
      .from("Comment")
      .delete()
      .eq("id", body.commentId);

    if (error) {
      return databaseError(
        error,
        "No se pudo eliminar el comentario."
      );
    }

    return NextResponse.json({
      success: true,
      message: "Comment deleted",
    });
  }

  static async addReply(
    request: NextRequest,
    db: SupabaseClient
  ): Promise<NextResponse> {
    const body = await readBody<{
      reply?: CommentRequest;
    }>(request);

    const reply = body?.reply;
    const authorId = reply
      ? getAuthorId(reply)
      : undefined;

    if (
      !reply?.content ||
      !authorId ||
      !reply.forumId ||
      !reply.parentCommentId
    ) {
      return badRequest(
        "content, authorId, forumId y parentCommentId son requeridos."
      );
    }

    const { data, error } = await db
      .from("Comment")
      .insert({
        content: reply.content.trim(),
        creationDate:
          reply.creationDate ?? new Date().toISOString(),
        likeCount: 0,
        isHiddenByAuthor: false,
        authorId,
        forumId: reply.forumId,
        parentCommentId: reply.parentCommentId,
      })
      .select()
      .single();

    if (error) {
      return databaseError(
        error,
        "No se pudo agregar la respuesta."
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Reply added",
        data,
      },
      { status: 201 }
    );
  }
}
