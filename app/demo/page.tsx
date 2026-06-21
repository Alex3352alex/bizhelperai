import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Generator from "@/components/Generator";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Demo",
  description:
    "Try the BizHelper AI content generator. Pick a tone and content type, and get ready-to-use marketing copy in seconds.",
};

export default function DemoPage() {
  return (
    <main className="relative">
      <section className="container-x scroll-mt-24 pb-16 pt-32 sm:pt-40">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>

        <div className="mb-10 max-w-2xl">
          <span className="eyebrow mb-5">Live demo</span>
          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl">
            The BizHelper{" "}
            <span className="text-gradient">content generator</span>
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">
            This is the live interface. It returns realistic sample content
            instantly — add your OpenAI or Gemini key to make it production
            ready.
          </p>
        </div>

        <Generator />
      </section>
      <Footer />
    </main>
  );
}
