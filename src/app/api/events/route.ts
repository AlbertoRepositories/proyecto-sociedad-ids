import {
  NextRequest,
  NextResponse,
} from "next/server";
import { withDatabase } from "../../../middlewares/database.middleware";

export const GET = withDatabase(
  async (
    _request: NextRequest,
    supabase
  ): Promise<NextResponse> => {
    const { data, error } = await supabase
      .from("Blog")
      .select("*")
      .eq("isVisible", true)
      .eq("publicationType", "EVENT")
      .order("eventStartDate", {
        ascending: true,
      });

    if (error) {
      return NextResponse.json(
        {
          error: "No se pudieron consultar los eventos.",
          details: error.message,
          code: error.code,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  }
);
