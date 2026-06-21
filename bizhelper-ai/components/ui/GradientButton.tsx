import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type CommonProps = {
  children: ReactNode;
  variant?: "primary" | "ghost";
  size?: "md" | "lg";
  className?: string;
};

type AsButton = CommonProps & {
  href?: undefined;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

type AsLink = CommonProps & {
  href: string;
};

type GradientButtonProps = AsButton | AsLink;

function classesFor(
  variant: "primary" | "ghost",
  size: "md" | "lg",
  className?: string
) {
  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-300 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60";
  const sizing = size === "lg" ? "px-7 py-3.5 text-base" : "px-5 py-2.5 text-sm";

  const variants =
    variant === "primary"
      ? "bg-brand-gradient bg-[length:200%_200%] text-white shadow-glow hover:bg-[position:100%_50%] hover:shadow-[0_22px_70px_-20px_rgba(124,92,255,0.75)] hover:-translate-y-0.5"
      : "glass text-ink hover:border-white/25 hover:bg-white/[0.08] hover:-translate-y-0.5";

  return cn(base, sizing, variants, className);
}

export default function GradientButton(props: GradientButtonProps) {
  const { children, variant = "primary", size = "md", className } = props;
  const classes = classesFor(variant, size, className);

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { onClick, type = "button", disabled } = props as AsButton;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}
