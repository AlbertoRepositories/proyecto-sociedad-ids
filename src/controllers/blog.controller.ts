import {
  NextRequest,
  NextResponse,
} from "next/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { ContentType } from "../types/enums";
import {
  badRequest,
  databaseError,
  notFound,
  readBody,
} from "./controller.helpers";

interface BlogRequest {
  title?: string;
  content?: string;
  creationDate?: string;
  expirationDate?: string | null;
  isVisible?: boolean;
  eventStartDate?: string;
  eventEndDate?: string;
  location?: string | null;
  registrationUrl?: string | null;
  imageUrls?: string[];
  calendarId?: string | null;
  administratorId?: string | null;
}

export class BlogController {
  static async publishPost(
    request: NextRequest,
    db: SupabaseClient
  ): Promise<NextResponse> {
    const body = await readBody<{
      blogData?: BlogRequest;
    }>(request);

    const blogData = body?.blogData;

    if (
      !blogData?.title ||
      !blogData.content ||
      !blogData.eventStartDate ||
      !blogData.eventEndDate
    ) {
      return badRequest(
        "title, content, eventStartDate y eventEndDate son requeridos."
      );
    }

    const { data, error } = await db
      .from("Blog")
      .insert({
        title: blogData.title.trim(),
        content: blogData.content.trim(),
        creationDate:
          blogData.creationDate ?? new Date().toISOString(),
        expirationDate:
          blogData.expirationDate ?? null,
        isVisible: blogData.isVisible ?? true,
        viewCount: 0,
        likeCount: 0,
        publicationType: ContentType.BLOG,
        eventStartDate: blogData.eventStartDate,
        eventEndDate: blogData.eventEndDate,
        location: blogData.location ?? null,
        registrationUrl:
          blogData.registrationUrl ?? null,
        imageUrls: blogData.imageUrls ?? [],
        calendarId: blogData.calendarId ?? null,
        administratorId:
          blogData.administratorId ?? null,
      })
      .select()
      .single();

    if (error) {
      return databaseError(error, "No se pudo publicar el post.");
    }

    return NextResponse.json(
      {
        success: true,
        message: "Post published",
        data,
      },
      { status: 201 }
    );
  }

  static async editPost(
    request: NextRequest,
    db: SupabaseClient,
    postId: string
  ): Promise<NextResponse> {
    const body = await readBody<BlogRequest>(request);

    if (!postId || !body?.title || !body.content) {
      return badRequest(
        "postId, title y content son requeridos."
      );
    }

    const { data, error } = await db
      .from("Blog")
      .update({
        title: body.title.trim(),
        content: body.content.trim(),
      })
      .eq("id", postId)
      .select()
      .single();

    if (error) {
      return databaseError(error, "No se pudo editar el post.");
    }

    if (!data) {
      return notFound("Post no encontrado.");
    }

    return NextResponse.json({
      success: true,
      message: "Post edited",
      data,
    });
  }

  static async displayPost(
    _request: NextRequest,
    db: SupabaseClient,
    postId: string
  ): Promise<NextResponse> {
    const { data, error } = await db
      .from("Blog")
      .select("*")
      .eq("id", postId)
      .eq("isVisible", true)
      .single();

    if (error) {
      return databaseError(error, "No se pudo consultar el post.");
    }

    if (!data) {
      return notFound("Post no encontrado.");
    }

    return NextResponse.json({
      success: true,
      data,
    });
  }

  static async deletePost(
    _request: NextRequest,
    db: SupabaseClient,
    postId: string
  ): Promise<NextResponse> {
    if (!postId) {
      return badRequest("postId es requerido.");
    }

    const { error } = await db
      .from("Blog")
      .delete()
      .eq("id", postId);

    if (error) {
      return databaseError(error, "No se pudo eliminar el post.");
    }

    return NextResponse.json({
      success: true,
      message: "Post deleted",
    });
  }

  static async hidePost(
    _request: NextRequest,
    db: SupabaseClient,
    postId: string
  ): Promise<NextResponse> {
    const { data, error } = await db
      .from("Blog")
      .update({ isVisible: false })
      .eq("id", postId)
      .select()
      .single();

    if (error) {
      return databaseError(error, "No se pudo ocultar el post.");
    }

    if (!data) {
      return notFound("Post no encontrado.");
    }

    return NextResponse.json({
      success: true,
      message: "Post hidden",
      data,
    });
  }

  static async registerView(
    _request: NextRequest,
    db: SupabaseClient,
    postId: string
  ): Promise<NextResponse> {
    const { data, error } = await db
      .from("Blog")
      .select("viewCount")
      .eq("id", postId)
      .single();

    if (error || !data) {
      return notFound("Blog no encontrado.");
    }

    const { error: updateError } = await db
      .from("Blog")
      .update({
        viewCount: data.viewCount + 1,
      })
      .eq("id", postId);

    if (updateError) {
      return databaseError(
        updateError,
        "No se pudo registrar la vista."
      );
    }

    return NextResponse.json({
      success: true,
      message: "View registered",
    });
  }

  static async registerLike(
    _request: NextRequest,
    db: SupabaseClient,
    postId: string
  ): Promise<NextResponse> {
    const { data, error } = await db
      .from("Blog")
      .select("likeCount")
      .eq("id", postId)
      .single();

    if (error || !data) {
      return notFound("Blog no encontrado.");
    }

    const { error: updateError } = await db
      .from("Blog")
      .update({
        likeCount: data.likeCount + 1,
      })
      .eq("id", postId);

    if (updateError) {
      return databaseError(
        updateError,
        "No se pudo registrar el like."
      );
    }

    return NextResponse.json({
      success: true,
      message: "Like registered",
    });
  }
}