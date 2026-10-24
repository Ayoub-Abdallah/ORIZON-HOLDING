import type { Metadata } from "next";
import { adminEnabled, isAdmin } from "@/lib/server/guard";
import { AdminLogin, Inbox } from "./inbox";
import { Logo } from "@/components/logo";

export const metadata: Metadata = { title: "Inbox", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!adminEnabled()) {
    return (
      <main className="tone-dark flex min-h-dvh items-center justify-center p-6">
        <div className="max-w-md text-center">
          <Logo className="h-3" />
          <p className="mt-6 text-muted">
            The inbox is disabled. Set <code className="rounded bg-white/10 px-1.5 py-0.5 text-fg">ADMIN_PASSWORD</code> in the environment to enable it.
          </p>
        </div>
      </main>
    );
  }
  return (await isAdmin()) ? <Inbox /> : <AdminLogin />;
}
