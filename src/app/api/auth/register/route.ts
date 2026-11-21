import { NextRequest, NextResponse } from "next/server";
import { withDatabase } from "../../../../middlewares/database.middleware";
import { generateJWT } from "../../../../utils/jwt_generator";

export const POST = withDatabase(async (request: NextRequest, db) => {
  try {
    const body = await request.json();
    const username = body?.username?.trim();
    const email = body?.email?.trim();

    if (!username || !email) {
      return NextResponse.json(
        { success: false, error: "Username y Email son obligatorios." },
        { status: 400 }
      );
    }

    // Verifica si ya existe el correo
    const { data: existing } = await db
      .from("User")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Ya existe una cuenta registrada con ese correo." },
        { status: 409 }
      );
    }

    // Inserta el nuevo usuario con los campos de tu tabla
    const { data: newUser, error } = await db
      .from("User")
      .insert({
        name: username,
        username,
        email,
        externalAuthProvider: "local",
        notificationsEnabled: true,
        type: "STUDENT",
      })
      .select("id, name, username, email, type")
      .single();

    if (error || !newUser) {
      return NextResponse.json(
        { success: false, error: error?.message || "No se pudo crear la cuenta." },
        { status: 500 }
      );
    }

    const token = generateJWT({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.type,
    });

    const response = NextResponse.json({
      success: true,
      data: { token, user: newUser },
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
      { success: false, error: "Error procesando el registro." },
      { status: 500 }
    );
  }
});