"use server";

import { createClient } from "@/lib/supabase/server";
import { absoluteUrl } from "@/lib/siteUrl";

export type ActionResult = {
  ok?: boolean;
  error?: string;
  message?: string;
};

function validEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function signUpAction(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const username = String(formData.get("username") ?? "").trim();

  if (!username || username.length < 2)
    return { error: "Please enter a username (at least 2 characters)." };
  if (!validEmail(email)) return { error: "Please enter a valid email address." };
  if (password.length < 8)
    return { error: "Password must be at least 8 characters." };

  const supabase = createClient();
  if (!supabase)
    return { error: "Authentication isn't configured yet. Add your Supabase keys." };

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
      emailRedirectTo: absoluteUrl("/auth/callback"),
    },
  });

  if (error) return { error: error.message };

  // If email confirmation is on, there's no session yet.
  if (!data.session) {
    return {
      ok: true,
      message: "Check your inbox to confirm your email, then sign in.",
    };
  }
  return { ok: true };
}

export async function signInAction(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!validEmail(email)) return { error: "Please enter a valid email address." };
  if (!password) return { error: "Please enter your password." };

  const supabase = createClient();
  if (!supabase)
    return { error: "Authentication isn't configured yet. Add your Supabase keys." };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Invalid email or password." };
  return { ok: true };
}

export async function forgotPasswordAction(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "").trim();
  if (!validEmail(email)) return { error: "Please enter a valid email address." };

  const supabase = createClient();
  if (!supabase)
    return { error: "Authentication isn't configured yet. Add your Supabase keys." };

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: absoluteUrl("/auth/callback?next=/reset-password"),
  });
  if (error) return { error: error.message };
  return {
    ok: true,
    message: "If an account exists for that email, a reset link is on its way.",
  };
}

export async function updatePasswordAction(
  _prev: ActionResult | undefined,
  formData: FormData
): Promise<ActionResult> {
  const password = String(formData.get("password") ?? "");
  if (password.length < 8)
    return { error: "Password must be at least 8 characters." };

  const supabase = createClient();
  if (!supabase) return { error: "Authentication isn't configured yet." };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };
  return { ok: true, message: "Password updated. You're all set." };
}

export async function signOutAction(): Promise<void> {
  const supabase = createClient();
  if (supabase) await supabase.auth.signOut();
}
