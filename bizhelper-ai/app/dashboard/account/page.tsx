import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/profile";
import AccountForm from "@/components/dashboard/AccountForm";

export const metadata = { title: "Account" };

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Account
        </h1>
        <p className="mt-1.5 text-ink-muted">
          Manage your profile and security settings.
        </p>
      </header>

      <AccountForm
        username={user.profile?.username || ""}
        email={user.email || ""}
      />
    </div>
  );
}
