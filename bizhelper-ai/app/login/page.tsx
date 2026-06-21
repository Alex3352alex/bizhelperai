import { Suspense } from "react";
import type { Metadata } from "next";
import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";
import GoogleButton from "@/components/auth/GoogleButton";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your BizHelper AI workspace."
      oauth={
        <Suspense fallback={<div className="h-12" />}>
          <GoogleButton />
        </Suspense>
      }
      footer={
        <>
          New here?{" "}
          <a href="/signup" className="text-brand-violet hover:underline">
            Create an account
          </a>
        </>
      }
    >
      <Suspense fallback={<div className="h-40" />}>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
