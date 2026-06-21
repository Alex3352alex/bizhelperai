import { NextRequest, NextResponse } from "next/server";
import {
  mockGenerate,
  type GenerateRequest,
  type GenerateResponse,
} from "@/lib/generateContent";

export const runtime = "nodejs";

/**
 * POST /api/generate
 *
 * Body: { business, tone, contentType }
 * Returns: { title, body, meta }
 *
 * Provider is selected by the AI_PROVIDER env var: "mock" | "openai" | "gemini".
 * Default is "mock" so the app runs with zero configuration.
 */
export async function POST(req: NextRequest) {
  let payload: GenerateRequest;

  try {
    payload = (await req.json()) as GenerateRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!payload?.contentType || !payload?.tone) {
    return NextResponse.json(
      { error: "Missing contentType or tone." },
      { status: 400 }
    );
  }

  const provider = process.env.AI_PROVIDER ?? "mock";

  try {
    let result: GenerateResponse;

    switch (provider) {
      case "openai":
        result = await generateWithOpenAI(payload);
        break;
      case "gemini":
        result = await generateWithGemini(payload);
        break;
      case "mock":
      default:
        // Small artificial delay so the loading state is visible in the demo.
        await new Promise((r) => setTimeout(r, 900));
        result = mockGenerate(payload);
        break;
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("generate error:", err);
    return NextResponse.json(
      { error: "Generation failed. Please try again." },
      { status: 500 }
    );
  }
}

/* ──────────────────────────────────────────────────────────────
 * Build the prompt once; both providers reuse it.
 * ────────────────────────────────────────────────────────────── */
function buildPrompt(req: GenerateRequest) {
  return `You are an expert marketing copywriter for small businesses.
Business: ${req.business || "a small business"}
Content type: ${req.contentType}
Tone: ${req.tone}

Write ready-to-publish ${req.contentType} content in a ${req.tone} tone.
Keep it concise, on-brand, and free of placeholders.
Return ONLY the content text — no explanations.`;
}

/* ──────────────────────────────────────────────────────────────
 * OpenAI — uncomment AI_PROVIDER=openai in .env.local and add OPENAI_API_KEY.
 * No SDK needed; we use fetch against the REST API.
 * ────────────────────────────────────────────────────────────── */
async function generateWithOpenAI(
  req: GenerateRequest
): Promise<GenerateResponse> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set.");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      messages: [{ role: "user", content: buildPrompt(req) }],
      temperature: 0.8,
    }),
  });

  if (!res.ok) throw new Error(`OpenAI error: ${res.status}`);
  const data = await res.json();
  const text: string = data.choices?.[0]?.message?.content?.trim() ?? "";

  return {
    meta: `${req.contentType} · ${req.tone}`,
    title: `${req.business || "Your business"} — ${req.contentType}`,
    body: text,
  };
}

/* ──────────────────────────────────────────────────────────────
 * Google Gemini — set AI_PROVIDER=gemini and add GEMINI_API_KEY.
 * ────────────────────────────────────────────────────────────── */
async function generateWithGemini(
  req: GenerateRequest
): Promise<GenerateResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set.");
  const model = process.env.GEMINI_MODEL ?? "gemini-1.5-flash";

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(req) }] }],
      }),
    }
  );

  if (!res.ok) throw new Error(`Gemini error: ${res.status}`);
  const data = await res.json();
  const text: string =
    data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

  return {
    meta: `${req.contentType} · ${req.tone}`,
    title: `${req.business || "Your business"} — ${req.contentType}`,
    body: text,
  };
}
