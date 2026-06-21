import {
  Megaphone,
  Sparkles,
  Mail,
  ShoppingBag,
  MessageCircle,
  CalendarRange,
  type LucideIcon,
} from "lucide-react";

export type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string; // tailwind gradient classes for the icon chip
};

export const FEATURES: Feature[] = [
  {
    icon: Megaphone,
    title: "AI Social Media Posts",
    description:
      "Caption-ready posts for Instagram, Facebook, and LinkedIn — on-brand, with hooks and hashtags built in.",
    accent: "from-indigo-500/30 to-violet-500/30",
  },
  {
    icon: Sparkles,
    title: "AI Ads Generator",
    description:
      "Scroll-stopping ad copy with headline variations and clear calls to action, tuned to your offer.",
    accent: "from-violet-500/30 to-fuchsia-500/30",
  },
  {
    icon: Mail,
    title: "AI Email Writer",
    description:
      "Newsletters, promos, and follow-ups written in your voice — from subject line to sign-off.",
    accent: "from-sky-500/30 to-indigo-500/30",
  },
  {
    icon: ShoppingBag,
    title: "AI Product Descriptions",
    description:
      "Turn a few details into descriptions that sell — benefit-led, SEO-aware, and ready to publish.",
    accent: "from-emerald-500/30 to-sky-500/30",
  },
  {
    icon: MessageCircle,
    title: "AI WhatsApp Messages",
    description:
      "Broadcasts, replies, and offers formatted for chat — short, warm, and built to convert.",
    accent: "from-fuchsia-500/30 to-rose-500/30",
  },
  {
    icon: CalendarRange,
    title: "Weekly Content Plan",
    description:
      "A full 7-day calendar of what to post and when, so you never stare at a blank screen again.",
    accent: "from-amber-500/30 to-violet-500/30",
  },
];

export type Step = {
  number: string;
  title: string;
  description: string;
};

export const STEPS: Step[] = [
  {
    number: "01",
    title: "Enter your business details",
    description:
      "Tell BizHelper what you do, who you serve, and the vibe of your brand. One time, two minutes.",
  },
  {
    number: "02",
    title: "Choose what you want to create",
    description:
      "Pick a content type and a tone. A social post, an ad, an email, a product description — your call.",
  },
  {
    number: "03",
    title: "Get ready-to-use content",
    description:
      "Receive polished, on-brand copy in seconds. Copy, tweak, and publish — no blank page required.",
  },
];

export type Plan = {
  name: string;
  price: string;
  cadence: string;
  tagline: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
};

export const PLANS: Plan[] = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    tagline: "Kick the tires.",
    features: [
      "3 generations total",
      "All content types",
      "2 brand tones",
      "Copy to clipboard",
    ],
    cta: "Start Free",
  },
  {
    name: "Basic",
    price: "$9",
    cadence: "/month",
    tagline: "For solo founders.",
    features: [
      "150 generations / month",
      "All content types",
      "All brand tones",
      "Saved brand profiles",
      "Email support",
    ],
    cta: "Choose Basic",
  },
  {
    name: "Pro",
    price: "$19",
    cadence: "/month",
    tagline: "Most popular for growing shops.",
    features: [
      "Unlimited generations",
      "Weekly content planner",
      "Brand voice memory",
      "Multi-language output",
      "Priority support",
    ],
    cta: "Choose Pro",
    highlighted: true,
  },
  {
    name: "Business",
    price: "$49",
    cadence: "/month",
    tagline: "For teams that ship daily.",
    features: [
      "Everything in Pro",
      "5 team seats",
      "Shared brand library",
      "Approval workflow",
      "API access",
    ],
    cta: "Choose Business",
  },
];

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initials: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I used to spend Sunday nights writing captions. Now I batch a whole week in fifteen minutes and the posts actually sound like me.",
    name: "Maya Cohen",
    role: "Owner, Olive & Thread Boutique",
    initials: "MC",
  },
  {
    quote:
      "The ad generator paid for itself in the first week. We tested four headlines it wrote and one of them doubled our click-through rate.",
    name: "Daniel Reyes",
    role: "Founder, Northside Coffee Roasters",
    initials: "DR",
  },
  {
    quote:
      "Product descriptions were the bottleneck for our store. BizHelper turned a 200-item backlog into an afternoon of work.",
    name: "Priya Nair",
    role: "E-commerce Lead, Lumen Home",
    initials: "PN",
  },
];

export type Faq = {
  question: string;
  answer: string;
};

export const FAQS: Faq[] = [
  {
    question: "Do I need any technical or writing skills?",
    answer:
      "None at all. You describe your business in plain language, pick what you want, and BizHelper writes it. If you can send a text message, you can use it.",
  },
  {
    question: "Will the content actually sound like my brand?",
    answer:
      "Yes. You set a tone — professional, friendly, bold, luxury, or playful — and save a brand profile so every generation stays consistent with your voice.",
  },
  {
    question: "Can I edit what the AI gives me?",
    answer:
      "Always. Everything is fully editable. Most people use the output as a strong first draft, make a small tweak, and publish in under a minute.",
  },
  {
    question: "What happens when I hit my plan limit?",
    answer:
      "We let you know before you run out. You can upgrade anytime, and your saved brand profiles and history carry over instantly.",
  },
  {
    question: "Which languages are supported?",
    answer:
      "English out of the box, with multi-language output on Pro and Business — including right-to-left languages like Hebrew and Arabic.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. Plans are month-to-month with no contract. Cancel in two clicks and keep access until the end of your billing period.",
  },
];

export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Demo", href: "#demo" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];
