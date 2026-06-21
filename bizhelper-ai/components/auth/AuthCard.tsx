import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";

export default function AuthCard({
  title,
  subtitle,
  children,
  oauth,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  oauth?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <Image
            src="/logo.png"
            alt="BizHelper AI"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
            priority
          />
          <span className="font-display text-xl font-semibold tracking-tight">
            BizHelper<span className="text-gradient"> AI</span>
          </span>
        </Link>

        <div className="glass-strong relative overflow-hidden rounded-3xl p-7 shadow-card sm:p-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1.5 text-sm text-ink-muted">{subtitle}</p>
          )}

          {oauth && (
            <div className="mt-6">
              {oauth}
              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs uppercase tracking-wider text-ink-faint">
                  or
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>
            </div>
          )}

          <div className={oauth ? "" : "mt-6"}>{children}</div>
        </div>

        {footer && (
          <p className="mt-6 text-center text-sm text-ink-muted">{footer}</p>
        )}
      </div>
    </main>
  );
}
