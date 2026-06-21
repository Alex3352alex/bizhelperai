"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { absoluteUrl } from "@/lib/siteUrl";

/**
 * "Continue with Google" button.
 *
 * Uses Supabase OAuth. Google sends the user back to /auth/callback, which
 * exchanges the code for a session (see app/auth/callback/route.ts). The
 * optional ?redirect= param is preserved so users land where they intended.
 *
 * Requires Google to be enabled in the Supabase dashboard
 * (Authentication -> Providers -> Google) with a Google Cloud OAuth client.
 */
export default function GoogleButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const params = useSearchParams();

  async function signInWithGoogle() {
    setError(null);
    const supabase = createClient();
    if (!supabase) {
      setError("Authentication isn't configured yet. Add your Supabase keys.");
      return;
    }

    setLoading(true);
    const redirect = params.get("redirect") || "/dashboard";
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: absoluteUrl(`/auth/callback?next=${encodeURIComponent(redirect)}`),
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={signInWithGoogle}
        disabled={loading}
        className="relative inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-6 py-3 font-medium text-ink transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? <Loader2 size={17} className="animate-spin" /> : <GoogleIcon />}
        Continue with Google
      </button>

      {error && (
        <p className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-2.5 text-sm text-rose-200">
          {error}
        </p>
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.874 2.6836-6.615z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.4673-.806 5.9564-2.1818l-2.9087-2.2581c-.8059.54-1.8368.8591-3.0477.8591-2.344 0-4.3282-1.5831-5.036-3.7104H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z" />
      <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.2823-1.1168-.2823-1.71s.1023-1.17.2823-1.71V4.9582H.9574C.3477 6.1732 0 7.5477 0 9s.3477 2.8268.9574 4.0418L3.964 10.71z" />
      <path fill="#EA4335" d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C15.4632.8918 13.426 0 9 0 5.4818 0 2.4382 2.0168.9574 4.9582L3.964 7.29C4.6718 5.1627 6.656 3.5795 9 3.5795z" />
    </svg>
  );
}
