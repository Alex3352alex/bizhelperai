"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/app/auth/actions";

export async function updateUsernameAction(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const username = String(formData.get("username") ?? "").trim();
  if (username.length < 2)
    return { error: "Username must be at least 2 characters." };

  const supabase = createClient();
  if (!supabase) return { error: "Not configured." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { error } = await supabase
    .from("profiles")
    .update({ username })
    .eq("id", user.id);
  if (error) return { error: error.message };

  // keep auth metadata in sync (used as a fallback display name)
  await supabase.auth.updateUser({ data: { username } });

  revalidatePath("/dashboard");
  return { ok: true, message: "Profile updated." };
}
