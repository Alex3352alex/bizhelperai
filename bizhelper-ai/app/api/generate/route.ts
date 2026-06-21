import { NextRequest, NextResponse } from "next/server";
import {
  mockGenerate,
  type GenerateRequest,
  type GenerateResponse,
} from "@/lib/generateContent";
import { createClient } from "@/lib/supabase/server";
import { getUsageSnapshot, incrementUsage } from "@/lib/usage";

export const runtime = "nodejs";

/**
 * POST /api/generate
 *
 * Public demo: works with no account (mock content, no limits).
 * Signed-in users: usage is counted and the per-plan monthly cap is enforced
 * server-side (the Free plan is limited; paid plans get more / unlimited).
 *
 * Provider is selected by AI_PROVIDER: "mock" | "openai" | "gemini".
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

  // ── Auth + usage enforcement (only when Supabase is configured) ──
  const supabase = createClient();
  let userId: string | null = null;
  let usedSoFar = 0;
  let usage: { used: number; limit: number | null } | null = null;

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      userId = user.id;
      const snap = await getUsageSnapshot(supabase, user.id);
      usedSoFar = snap.used;
      if (snap.remaining !== Infinity && snap.remaining <= 0) {
        return NextResponse.json(
          {
            error: "limit_reached",
            message:
              "You've used all your generations for this period. Upgrade your plan to keep creating.",
            limit: snap.limit === Infinity ? null : snap.limit,
            used: snap.used,
          },
          { status: 429 }
        );
      }
    }
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
        await new Promise((r) => setTimeout(r, 900));
        result = mockGenerate(payload);
        break;
    }

    // Count this generation for signed-in users.
    if (supabase && userId) {
      await incrementUsage(supabase, userId, usedSoFar);
      const snap = await getUsageSnapshot(supabase, userId);
      usage = { used: snap.used, limit: snap.limit === Infinity ? null : snap.limit };
    }

    return NextResponse.json({ ...result, usage });
  } catch (err) {
    console.error("generate error:", err);
    return NextResponse.json(
      { error: "Generation failed. Please try again." },
      { status: 500 }
    );
  }
}

/* ── Shared prompt ── */
function buildPrompt(req: GenerateRequest) {
  return `You are an expert marketing copywriter for small businesses.
Business: ${req.business || "a small business"}
Content type: ${req.contentType}
Tone: ${req.tone}

Write ready-to-publish ${req.contentType} content in a ${req.tone} tone.
Keep it concise, on-brand, and free of placeholders.
Return ONLY the content text — no explanations.`;
}

/* ── OpenAI (set AI_PROVIDER=openai + OPENAI_API_KEY) ── */
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

/* ── Gemini (set AI_PROVIDER=gemini + GEMINI_API_KEY) ── */
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
      body: JSON.stringify({ contents: [{ parts: [{ text: buildPrompt(req) }] }] }),
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
