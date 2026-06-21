import { Suspense } from "react";
import type { Metadata } from "next";
import AuthCard from "@/components/auth/AuthCard";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = { title: "Create account" };

export default function SignupPage() {
  return (
    <AuthCard
      title="Create your account"
      subtitle="Start free — 3 generations on us, no card required."
      footer={
        <>
          Already have an account?{" "}
          <a href="/login" className="text-brand-violet hover:underline">
            Sign in
          </a>
        </>
      }
    >
      <Suspense fallback={<div className="h-56" />}>
        <SignupForm />
      </Suspense>
    </AuthCard>
  );
}
