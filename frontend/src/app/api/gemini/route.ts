import { NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini";
import { formatKnowledgeContext, retrieveKnowledge } from "@/lib/rag";

const WALKTHROUGH_SCHEMA = `{
  "title": "short problem name",
  "summary": "2-3 sentence plain-language restatement",
  "constraints": ["important constraint or observation"],
  "hints": ["three progressive Socratic hints that do not reveal the answer"],
  "approach": { "name": "recommended approach", "explanation": "why it works", "why_this_works": "key insight", "code": "short TypeScript solution" },
  "complexity": { "time": "O(...)", "space": "O(...)", "explanation": "why" },
  "alternatives": [{ "name": "approach", "time": "O(...)", "space": "O(...)", "tradeoff": "trade-off" }]
}`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    const mode = body.mode === "followup" ? "followup" : "walkthrough";
    const context = typeof body.context === "string" ? body.context : "";

    if (!prompt) {
      return NextResponse.json(
        { error: "A prompt is required." },
        { status: 400 }
      );
    }

    const retrieved = retrieveKnowledge(prompt);
    const knowledgeContext = formatKnowledgeContext(retrieved);
    const ai = getGeminiClient();
    const input = mode === "followup"
      ? `You are a patient technical interview tutor. Answer the follow-up in 2-5 concise sentences. Use the supplied problem context, but do not invent facts. Plain text only.\n\nProblem context:\n${context}\n\nRelevant local examples:\n${knowledgeContext}\n\nFollow-up question:\n${prompt}`
      : `You are a Socratic technical interview tutor. Analyze the user's problem using the relevant local examples below. Return ONLY valid JSON matching this exact shape, with no markdown fences or preamble:\n${WALKTHROUGH_SCHEMA}\n\nRules: provide exactly 3 progressive hints without giving away the solution, keep fields concise, include 2 alternatives, and write TypeScript code. Ground the explanation in the user's actual problem; use local examples only as supporting retrieval context.\n\nRelevant local examples:\n${knowledgeContext}\n\nUser problem:\n${prompt}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: input,
    });

    return NextResponse.json({
      answer: response.text ?? "",
      matches: retrieved,
    });
  } catch (error) {
    console.error("Gemini error:", error);

    return NextResponse.json(
      { error: "Gemini could not generate a response." },
      { status: 500 }
    );
  }
}