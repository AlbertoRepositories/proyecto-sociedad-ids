import { NextRequest, NextResponse } from "next/server";
import { withDatabase } from "../../../../middlewares/database.middleware";
import { generateJWT } from "../../../../utils/jwt_generator";

export const POST = withDatabase(async (request: NextRequest, db) => {
  try {
    const body = await request.json();
    const identifier = body?.email?.trim();

    if (!identifier) {
      return NextResponse.json(
        { success: false, error: "El correo electrónico es obligatorio." },
        { status: 400 }
      );
    }

    // Busca al usuario por email en Supabase
    const { data: user, error } = await db
      .from("User")
      .select("id, name, username, email, type")
      .eq("email", identifier)
      .single();

    if (error || !user) {
      return NextResponse.json(
        {
          success: false,
          error: "No se encontró un usuario registrado con ese correo.",
        },
        { status: 401 }
      );
    }

    // Genera el JWT usando exactamente tu utilidad y estructura de payload
    const token = generateJWT({
      id: user.id,
      email: user.email,
      name: user.name || user.username,
      role: user.type,
    });

    const response = NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.type,
        },
      },
    });

    // También lo guarda en cookie para compatibilidad directa con tu middleware
    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 horas
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Error procesando la solicitud de inicio de sesión." },
      { status: 500 }
    );
  }
});