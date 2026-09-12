import { NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = body.prompt;
    const context = body.context || "";

    if (!prompt) {
      return NextResponse.json(
        { error: "A prompt is required." },
        { status: 400 }
      );
    }

    const ai = getGeminiClient();

    const input = context
      ? `Use the following context to answer the question.

Context:
${context}

Question:
${prompt}`
      : prompt;

    const response = await ai.interactions.create({
      model: "gemini-3.8-flash",
      input,
    });

    return NextResponse.json({
      answer: response.output_text,
    });
  } catch (error) {
    console.error("Gemini error:", error);

    return NextResponse.json(
      { error: "Gemini could not generate a response." },
      { status: 500 }
    );
  }
}