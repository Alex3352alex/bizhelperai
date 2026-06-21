import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUsageSnapshot } from "@/lib/usage";

export const runtime = "nodejs";

export async function GET() {
  const supabase = createClient();
  if (!supabase)
    return NextResponse.json({ error: "Not configured." }, { status: 503 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const snap = await getUsageSnapshot(supabase, user.id);
  return NextResponse.json({
    plan: snap.plan,
    used: snap.used,
    limit: snap.limit === Infinity ? null : snap.limit,
    remaining: snap.remaining === Infinity ? null : snap.remaining,
  });
}
