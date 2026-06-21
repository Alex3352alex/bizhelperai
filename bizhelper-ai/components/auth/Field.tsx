"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export function Field({
  label,
  name,
  type = "text",
  placeholder,
  autoComplete,
  required = true,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  defaultValue?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-ink-faint"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-ink placeholder:text-ink-faint transition-colors focus:border-brand-violet/50 focus:outline-none"
      />
    </div>
  );
}

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="relative inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-gradient bg-[length:200%_200%] px-6 py-3 font-medium text-white shadow-glow transition-all duration-300 hover:bg-[position:100%_50%] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending && <Loader2 size={17} className="animate-spin" />}
      {children}
    </button>
  );
}
