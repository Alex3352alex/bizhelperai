/**
 * Content generation logic.
 *
 * Right now this returns realistic MOCK content so the demo works with zero setup.
 * When you're ready for real AI, you don't touch this file's TYPES — you just
 * implement the provider branches in `app/api/generate/route.ts` (see the
 * comments there). The front-end and the API contract stay identical.
 */

export const CONTENT_TYPES = [
  { id: "social", label: "Social Media Post" },
  { id: "ad", label: "Ad Copy" },
  { id: "email", label: "Email" },
  { id: "product", label: "Product Description" },
  { id: "whatsapp", label: "WhatsApp Message" },
  { id: "plan", label: "Weekly Content Plan" },
] as const;

export const TONES = [
  { id: "professional", label: "Professional" },
  { id: "friendly", label: "Friendly" },
  { id: "bold", label: "Bold" },
  { id: "luxury", label: "Luxury" },
  { id: "playful", label: "Playful" },
] as const;

export type ContentTypeId = (typeof CONTENT_TYPES)[number]["id"];
export type ToneId = (typeof TONES)[number]["id"];

export type GenerateRequest = {
  business: string;
  tone: ToneId;
  contentType: ContentTypeId;
};

export type GenerateResponse = {
  title: string;
  body: string;
  meta: string; // small label shown on the result card (e.g. "Instagram caption")
};

const toneFlavour: Record<ToneId, { opener: string; sign: string }> = {
  professional: { opener: "Introducing", sign: "Learn more" },
  friendly: { opener: "Hey there —", sign: "Come say hi" },
  bold: { opener: "Stop scrolling.", sign: "Claim yours" },
  luxury: { opener: "Presenting", sign: "Discover the collection" },
  playful: { opener: "Okay, real talk —", sign: "Treat yourself" },
};

function clean(business: string) {
  const b = business.trim();
  return b.length ? b : "your business";
}

/** Deterministic-ish mock generator. Swap for real AI in the API route. */
export function mockGenerate(req: GenerateRequest): GenerateResponse {
  const biz = clean(req.business);
  const t = toneFlavour[req.tone] ?? toneFlavour.friendly;
  const Biz = biz.charAt(0).toUpperCase() + biz.slice(1);

  switch (req.contentType) {
    case "social":
      return {
        meta: "Instagram caption",
        title: `${Biz} — social post`,
        body: `${t.opener} ${biz} done right. ✨\n\nWe built this for people who want results without the guesswork. Real quality, real care, and a team that actually shows up.\n\nDouble-tap if that's the kind of ${biz} you've been looking for. 👇\n\n#${biz.replace(/\s+/g, "")} #smallbusiness #qualityfirst #${req.tone}vibes`,
      };
    case "ad":
      return {
        meta: "Paid ad copy",
        title: `${Biz} — ad copy`,
        body: `Headline: The ${biz} upgrade you didn't know you needed\n\nPrimary text:\n${t.opener} a smarter way to experience ${biz}. No fluff, no pressure — just the good stuff, delivered the way it should be.\n\n• Trusted by happy customers\n• Fast, friendly, reliable\n• Satisfaction you can feel\n\nCTA: ${t.sign} →`,
      };
    case "email":
      return {
        meta: "Marketing email",
        title: `${Biz} — email`,
        body: `Subject: Something new from ${Biz} 👀\n\nHi {{first_name}},\n\n${t.opener} something we think you'll love. At ${Biz}, we've been quietly working on a better way to serve you — and it's finally here.\n\nHere's why it matters:\n• It saves you time\n• It feels effortless\n• It's made with you in mind\n\nWant to be first in line? ${t.sign}.\n\nWarmly,\nThe ${Biz} team`,
      };
    case "product":
      return {
        meta: "Product description",
        title: `${Biz} — product description`,
        body: `${t.opener} a ${biz} essential, reimagined.\n\nThoughtfully made and built to last, this is the piece your routine has been missing. Every detail is considered, so it looks as good as it works.\n\n• Premium materials, honest craftsmanship\n• Designed for everyday use\n• Backed by our happiness guarantee\n\n${t.sign}.`,
      };
    case "whatsapp":
      return {
        meta: "WhatsApp broadcast",
        title: `${Biz} — WhatsApp message`,
        body: `${t.opener} 👋\n\nQuick one from ${Biz} — we've got something special this week and wanted you to hear it first.\n\n🎁 A little treat for our regulars\n⏰ Limited time only\n📍 Reply *YES* and we'll sort you out\n\n${t.sign} 💬`,
      };
    case "plan":
      return {
        meta: "7-day content plan",
        title: `${Biz} — weekly content plan`,
        body: `Mon · Hook post — a bold question your customers secretly ask\nTue · Behind-the-scenes reel of ${biz} in action\nWed · Customer story / testimonial spotlight\nThu · Educational tip that makes you the expert\nFri · Offer / promo with a clear call to action\nSat · Light, fun post — show the human side\nSun · Recap + a soft "DM us to get started"\n\nTone for the week: ${req.tone}. Keep visuals consistent and end every post with one clear next step.`,
      };
    default:
      return {
        meta: "Content",
        title: `${Biz} — content`,
        body: `${t.opener} ${biz}. ${t.sign}.`,
      };
  }
}
