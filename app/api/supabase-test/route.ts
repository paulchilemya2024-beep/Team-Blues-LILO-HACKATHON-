import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("problems")
      .select("id, title")
      .limit(1);

    if (error) {
      throw error;
    }

    return NextResponse.json({
      message: "Supabase connection successful.",
      problems: data,
    });
  } catch (error) {
    console.error("Supabase test error:", error);

    return NextResponse.json(
      { error: "Supabase connection failed." },
      { status: 500 }
    );
  }
}