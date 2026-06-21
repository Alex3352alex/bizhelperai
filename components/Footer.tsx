import Link from "next/link";
import { Wand2, Twitter, Linkedin, Github } from "lucide-react";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Demo", href: "#demo" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Contact", href: "#" },
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 pb-10 pt-16">
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          {/* Brand */}
          <div>
            <Link href="#top" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient shadow-glow-sm">
                <Wand2 size={18} className="text-white" />
              </span>
              <span className="font-display text-lg font-semibold tracking-tight">
                BizHelper<span className="text-gradient"> AI</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              AI tools that help small businesses create marketing content in
              seconds — on-brand, every time.
            </p>
            <div className="mt-5 flex gap-2">
              {[Twitter, Linkedin, Github].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-ink-muted transition-colors hover:border-white/20 hover:text-ink"
                >
                  <Icon size={16} />
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-ink-faint">
                {col.title}
              </p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-muted transition-colors hover:text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 rule" />

        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-xs text-ink-faint sm:flex-row">
          <p>© {new Date().getFullYear()} BizHelper AI. All rights reserved.</p>
          <p>Built for small businesses that move fast.</p>
        </div>
      </div>
    </footer>
  );
}
