import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json(
        { error: "Unable to sign out." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Signed out successfully.",
    });
  } catch (error) {
    console.error("Signout error:", error);

    return NextResponse.json(
      { error: "Unable to sign out." },
      { status: 500 }
    );
  }
}