import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const { data: problems, error } = await supabase
      .from("problems")
      .select("id, title, prompt, category, difficulty")
      .order("title");

    if (error) {
      console.error("Problems fetch error:", error);

      return NextResponse.json(
        { error: "Unable to retrieve problems." },
        { status: 500 }
      );
    }

    return NextResponse.json({ problems });
  } catch (error) {
    console.error("Problems API error:", error);

    return NextResponse.json(
      { error: "Unable to retrieve problems." },
      { status: 500 }
    );
  }
}