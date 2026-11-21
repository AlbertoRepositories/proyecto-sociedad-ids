import { NextRequest, NextResponse } from "next/server";
import { withDatabase } from "../../../../middlewares/database.middleware";
import { generateJWT } from "../../../../utils/jwt_generator";
import { UserType } from "../../../../types/enums";

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

    const { data: user, error } = await db
      .from("User")
      .select("id, name, username, email, type, seed")
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

    // Normaliza role para que coincida siempre con el enum UserType
    const rawRole = String(user.type || "").toUpperCase();
    const validRole = Object.values(UserType).includes(rawRole as UserType)
      ? (rawRole as UserType)
      : (Object.values(UserType)[0] as UserType);

    const safeName =
      user.name?.trim() ||
      user.username?.trim() ||
      user.email.split("@")[0];

    const token = generateJWT({
      id: user.id,
      email: user.email,
      name: safeName,
      role: validRole,
    });

    const response = NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: safeName,
          username: user.username,
          email: user.email,
          role: validRole,
          seed: user.seed,
        },
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "Error procesando la solicitud de inicio de sesión." },
      { status: 500 }
    );
  }
});