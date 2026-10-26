import type { Metadata } from "next";
import { adminEnabled, isAdmin } from "@/lib/server/guard";
import { AdminLogin, Inbox } from "./inbox";
import { Logo } from "@/components/logo";

export const metadata: Metadata = { title: "Inbox", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!adminEnabled()) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-neutral-50 p-6 text-neutral-900">
        <div className="max-w-md text-center">
          <Logo className="h-3" />
          <p className="mt-6 text-neutral-500">
            The inbox is disabled. Set <code className="rounded bg-neutral-200 px-1.5 py-0.5 text-neutral-900">ADMIN_PASSWORD</code> in the environment to enable it.
          </p>
        </div>
      </main>
    );
  }
  return (await isAdmin()) ? <Inbox /> : <AdminLogin />;
}
