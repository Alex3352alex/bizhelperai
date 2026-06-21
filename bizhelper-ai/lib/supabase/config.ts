/**
 * Supabase configuration guard.
 *
 * The marketing site works with zero configuration. Auth, the dashboard, and
 * billing only light up once these env vars are set (locally in .env.local,
 * and in Vercel → Project → Settings → Environment Variables).
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}
