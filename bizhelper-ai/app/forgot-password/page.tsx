import { Suspense } from "react";
import type { Metadata } from "next";
import AuthCard from "@/components/auth/AuthCard";
import ForgotForm from "@/components/auth/ForgotForm";

export const metadata: Metadata = { title: "Reset password" };

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Reset your password"
      subtitle="We'll email you a secure link to set a new one."
      footer={
        <>
          Remembered it?{" "}
          <a href="/login" className="text-brand-violet hover:underline">
            Back to sign in
          </a>
        </>
      }
    >
      <Suspense fallback={<div className="h-32" />}>
        <ForgotForm />
      </Suspense>
    </AuthCard>
  );
}
