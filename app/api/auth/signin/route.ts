import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: "Signed in successfully.",
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);

    return NextResponse.json(
      { error: "Unable to sign in." },
      { status: 500 }
    );
  }
}