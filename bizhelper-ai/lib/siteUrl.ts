import { headers } from "next/headers";

/**
 * Builds an absolute URL for the current deployment. Prefers NEXT_PUBLIC_SITE_URL,
 * then the forwarded host (Vercel), then localhost. Used for auth email links.
 */
export function absoluteUrl(path = ""): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  let base = envUrl;

  if (!base) {
    const h = headers();
    const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
    const proto = h.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
    base = `${proto}://${host}`;
  }

  return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}
