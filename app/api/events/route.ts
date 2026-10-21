
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json(
      { error: "Falta configurar la conexión con Supabase." },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("is_visible", true)
    .order("start_at", { ascending: true });

  if (error) {
  console.error("Error de Supabase:", error);

  return NextResponse.json(
    {
      error: "No se pudieron consultar los eventos.",
      detalle: error.message,
      codigo: error.code,
      detalles: error.details,
      sugerencia: error.hint,
    },
    { status: 500 }
  );
}

  return NextResponse.json(data);
}
