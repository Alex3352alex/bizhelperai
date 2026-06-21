import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep space canvas
        base: {
          DEFAULT: "#070711",
          soft: "#0B0B18",
          raised: "#10101F",
        },
        ink: {
          DEFAULT: "#F4F5FB",
          muted: "#9AA0B8",
          faint: "#6B7090",
        },
        // Brand gradient stops
        brand: {
          indigo: "#6366F1",
          violet: "#A855F7",
          sky: "#38BDF8",
          glow: "#7C5CFF",
        },
      },
      fontFamily: {
        display: ["var(--font-sora)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(124,92,255,0.18), 0 18px 60px -20px rgba(124,92,255,0.55)",
        "glow-sm": "0 10px 40px -16px rgba(124,92,255,0.45)",
        glass: "0 1px 0 0 rgba(255,255,255,0.06) inset, 0 24px 70px -40px rgba(0,0,0,0.9)",
        card: "0 30px 80px -40px rgba(0,0,0,0.85)",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(120deg, #6366F1 0%, #A855F7 50%, #38BDF8 100%)",
        "brand-soft":
          "linear-gradient(120deg, rgba(99,102,241,0.18), rgba(168,85,247,0.18))",
      },
      keyframes: {
        "aurora-1": {
          "0%,100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(6%,-4%,0) scale(1.15)" },
        },
        "aurora-2": {
          "0%,100%": { transform: "translate3d(0,0,0) scale(1.1)" },
          "50%": { transform: "translate3d(-8%,6%,0) scale(0.95)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "gradient-pan": {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "pulse-dot": {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.25" },
        },
      },
      animation: {
        "aurora-1": "aurora-1 18s ease-in-out infinite",
        "aurora-2": "aurora-2 22s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        "gradient-pan": "gradient-pan 6s ease infinite",
        "pulse-dot": "pulse-dot 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
