import { Suspense } from "react";
import type { Metadata } from "next";
import AuthCard from "@/components/auth/AuthCard";
import ResetForm from "@/components/auth/ResetForm";

export const metadata: Metadata = { title: "Set new password" };

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Set a new password"
      subtitle="Choose a strong password you don't use anywhere else."
    >
      <Suspense fallback={<div className="h-32" />}>
        <ResetForm />
      </Suspense>
    </AuthCard>
  );
}
