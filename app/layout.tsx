import type { Metadata, Viewport } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import AuroraBackground from "@/components/AuroraBackground";
import Navbar from "@/components/Navbar";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "BizHelper AI — AI Tools That Help Your Business Work Smarter",
    template: "%s · BizHelper AI",
  },
  description:
    "Create posts, ads, emails, product descriptions and business content in seconds. AI marketing built for small businesses.",
  keywords: [
    "AI marketing",
    "small business",
    "content generator",
    "AI copywriter",
    "social media posts",
    "ad generator",
    "SaaS",
  ],
  authors: [{ name: "BizHelper AI" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "BizHelper AI — AI Tools That Help Your Business Work Smarter",
    description:
      "Create posts, ads, emails, product descriptions and business content in seconds.",
    siteName: "BizHelper AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "BizHelper AI",
    description:
      "AI tools that help small businesses create marketing content in seconds.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#070711",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "BizHelper AI",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "AI tools that help small businesses create marketing content in seconds.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AuroraBackground />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
