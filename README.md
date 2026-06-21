# BizHelper AI

A premium, dark-themed SaaS landing site for an AI marketing tool aimed at small businesses. Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**.

The demo generator works out of the box with realistic mock content — and is wired so you can drop in **OpenAI** or **Gemini** later by changing one environment variable.

---

## ✨ What's inside

- Hero with an animated glass dashboard mockup (live "typing" generation effect)
- Features, How it works, Live demo, Pricing, Testimonials, FAQ, CTA, Footer
- A working content generator (business input → tone → content type → result) with loading states, copy-to-clipboard, and regenerate
- A dedicated `/demo` route reusing the same generator component
- Fully responsive, keyboard-accessible, and respects `prefers-reduced-motion`
- SEO: metadata, OpenGraph/Twitter cards, JSON-LD, `sitemap.xml`, `robots.txt`

---

## 🚀 Run it locally

> Requires **Node.js 18.17+** (Node 20 LTS recommended).

```bash
# 1. Install dependencies
npm install

# 2. (Optional) create your env file — the app runs fine without it
cp .env.example .env.local

# 3. Start the dev server
npm run dev
```

Open **http://localhost:3000**.

### Production build

```bash
npm run build
npm run start
```

---

## 🔌 Connect real AI (OpenAI or Gemini)

The front end always calls `POST /api/generate`. The provider is chosen by the
`AI_PROVIDER` env var. No code changes required — just edit `.env.local`:

**OpenAI**
```bash
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

**Gemini**
```bash
AI_PROVIDER=gemini
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-1.5-flash
```

Then restart the dev server. The real provider branches already live in
`app/api/generate/route.ts` — they share one prompt builder, so you only ever
touch that file if you want to customize the prompt.

Leave `AI_PROVIDER=mock` (the default) to keep using built-in sample content.

---

## 📁 Project structure

```
bizhelper-ai/
├── app/
│   ├── api/generate/route.ts   # API endpoint: mock | openai | gemini
│   ├── demo/page.tsx           # standalone /demo route
│   ├── globals.css             # design system (aurora bg, glass, tokens)
│   ├── layout.tsx              # fonts + SEO metadata + shell
│   ├── page.tsx                # landing page composition
│   ├── robots.ts / sitemap.ts  # SEO
├── components/
│   ├── ui/                     # GlassCard, GradientButton, SectionHeading, Reveal
│   ├── AuroraBackground.tsx
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── DashboardMockup.tsx     # animated hero signature
│   ├── Features.tsx
│   ├── HowItWorks.tsx
│   ├── Generator.tsx           # the interactive demo (reusable)
│   ├── DemoSection.tsx
│   ├── Pricing.tsx
│   ├── Testimonials.tsx
│   ├── FAQ.tsx
│   ├── CTA.tsx
│   └── Footer.tsx
├── lib/
│   ├── data.ts                 # features, plans, testimonials, FAQs (edit copy here)
│   ├── generateContent.ts      # types + mock engine
│   └── cn.ts
├── tailwind.config.ts          # brand palette, fonts, glow shadows, keyframes
└── .env.example
```

---

## 🎨 Customizing

- **Brand colors / glow / fonts:** `tailwind.config.ts`
- **All marketing copy (features, prices, reviews, FAQs):** `lib/data.ts`
- **Mock generator output:** `lib/generateContent.ts`
- **Global look (background, glass, scrollbar):** `app/globals.css`

---

## 🛠 Tech

Next.js 14 · React 18 · TypeScript · Tailwind CSS 3 · Framer Motion · lucide-react
