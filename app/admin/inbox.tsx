"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, LogOut, RefreshCw, Send } from "lucide-react";
import type { Conversation, Lead } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { formatSlot } from "@/lib/slots";

export function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <main className="tone-dark flex min-h-dvh items-center justify-center p-6">
      <form
        className="w-full max-w-sm space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setPending(true);
          setError(null);
          const password = new FormData(e.currentTarget).get("password");
          const res = await fetch("/api/admin/session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
          });
          setPending(false);
          if (res.ok) router.refresh();
          else setError(((await res.json().catch(() => ({}))) as { error?: string }).error ?? "Login failed");
        }}
      >
        <p className="wordmark text-center text-sm">ORIZON</p>
        <p className="text-center text-sm text-muted">Team inbox</p>
        <input
          name="password"
          type="password"
          required
          autoFocus
          placeholder="Password"
          className="h-12 w-full rounded-xl border border-line bg-card px-4 outline-none focus:border-accent"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button disabled={pending} className="h-12 w-full rounded-xl bg-white font-medium text-black disabled:opacity-50">
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}

type Data = { leads: Lead[]; conversations: Conversation[] };
type Tab = "conversations" | Lead["kind"] | "all";

const tabs: { id: Tab; label: string }[] = [
  { id: "conversations", label: "Live chat" },
  { id: "all", label: "All leads" },
  { id: "contact", label: "Messages" },
  { id: "brief", label: "Briefs" },
  { id: "booking", label: "Calls" },
  { id: "careers", label: "Applications" },
  { id: "newsletter", label: "Subscribers" },
];

export function Inbox() {
  const router = useRouter();
  const [data, setData] = useState<Data | null>(null);
  const [tab, setTab] = useState<Tab>("conversations");
  const [selected, setSelected] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/inbox", { cache: "no-store" });
    setLoading(false);
    if (res.status === 401) return router.refresh();
    if (res.ok) setData((await res.json()) as Data);
  }, [router]);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 15000);
    return () => clearInterval(t);
  }, [refresh]);

  const leads = useMemo(() => (data?.leads ?? []).filter((l) => tab === "all" || l.kind === tab), [data, tab]);
  const convo = data?.conversations.find((c) => c.id === selected);
  const lead = data?.leads.find((l) => l.id === selected);

  async function patch(body: object) {
    await fetch("/api/admin/inbox", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    refresh();
  }

  async function sendReply() {
    if (!convo || !reply.trim()) return;
    const res = await fetch("/api/admin/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: convo.id, text: reply }),
    });
    if (res.ok) {
      setReply("");
      refresh();
    }
  }

  function exportCsv() {
    const rows = leads.map((l) => ({
      date: l.createdAt,
      kind: l.kind,
      status: l.status,
      name: l.name ?? "",
      email: l.email,
      company: l.company ?? "",
      phone: l.phone ?? "",
      topic: l.topic ?? "",
      message: l.message ?? "",
      details: l.data ? JSON.stringify(l.data) : "",
    }));
    const head = Object.keys(rows[0] ?? { date: "" });
    const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const csv = [head.join(","), ...rows.map((r) => head.map((h) => esc(String(r[h as keyof typeof r]))).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    Object.assign(document.createElement("a"), { href: url, download: `orizon-${tab}-${new Date().toISOString().slice(0, 10)}.csv` }).click();
    URL.revokeObjectURL(url);
  }

  const count = (t: Tab) =>
    t === "conversations"
      ? data?.conversations.filter((c) => c.unread).length ?? 0
      : (data?.leads ?? []).filter((l) => (t === "all" || l.kind === t) && l.status === "new").length;

  return (
    <main className="tone-light flex min-h-dvh flex-col">
      <header className="tone-dark flex h-14 items-center justify-between px-5">
        <div className="flex items-center gap-4">
          <span className="wordmark text-xs">ORIZON</span>
          <span className="text-xs text-muted">Inbox</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={refresh} className="rounded-lg p-2 text-muted hover:text-fg" aria-label="Refresh">
            <RefreshCw className={cn("size-4", loading && "animate-spin")} />
          </button>
          <button
            onClick={async () => {
              await fetch("/api/admin/session", { method: "DELETE" });
              router.refresh();
            }}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted hover:text-fg"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </header>

      <nav className="flex gap-1 overflow-x-auto border-b border-line px-3 py-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTab(t.id);
              setSelected(null);
            }}
            className={cn("flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm", tab === t.id ? "bg-invert text-invert-fg" : "text-muted hover:bg-card")}
          >
            {t.label}
            {count(t.id) > 0 && <span className="rounded-full bg-accent px-1.5 text-[11px] text-white">{count(t.id)}</span>}
          </button>
        ))}
        {tab !== "conversations" && (
          <button onClick={exportCsv} className="ml-auto inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-muted hover:bg-card">
            <Download className="size-4" /> CSV
          </button>
        )}
      </nav>

      <div className="grid flex-1 md:grid-cols-[360px_1fr]">
        <ul className="max-h-[calc(100dvh-6.5rem)] overflow-y-auto border-r border-line">
          {!data && <li className="p-6 text-sm text-muted">Loading…</li>}
          {tab === "conversations"
            ? data?.conversations.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => {
                      setSelected(c.id);
                      if (c.unread) patch({ type: "conversation", id: c.id, read: true });
                    }}
                    className={cn("w-full border-b border-line p-4 text-left hover:bg-card", selected === c.id && "bg-card")}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn("truncate text-sm", c.unread && "font-semibold")}>{c.visitor.name ?? "Anonymous visitor"}</span>
                      <span className="shrink-0 text-[11px] text-faint">{ago(c.updatedAt)}</span>
                    </div>
                    <p className="mt-1 truncate text-xs text-muted">{c.messages.at(-1)?.text}</p>
                    <div className="mt-2 flex gap-1.5">
                      <Badge tone={c.mode === "human" ? "accent" : "muted"}>{c.mode === "human" ? "Wants a human" : "AI"}</Badge>
                      {c.status === "closed" && <Badge>Closed</Badge>}
                    </div>
                  </button>
                </li>
              ))
            : leads.map((l) => (
                <li key={l.id}>
                  <button onClick={() => setSelected(l.id)} className={cn("w-full border-b border-line p-4 text-left hover:bg-card", selected === l.id && "bg-card")}>
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn("truncate text-sm", l.status === "new" && "font-semibold")}>{l.name ?? l.email}</span>
                      <span className="shrink-0 text-[11px] text-faint">{ago(l.createdAt)}</span>
                    </div>
                    <p className="mt-1 truncate text-xs text-muted">{l.message || l.topic || l.email}</p>
                    <div className="mt-2 flex gap-1.5">
                      <Badge>{l.kind}</Badge>
                      <Badge tone={l.status === "new" ? "accent" : "muted"}>{l.status}</Badge>
                    </div>
                  </button>
                </li>
              ))}
          {data && (tab === "conversations" ? data.conversations.length === 0 : leads.length === 0) && (
            <li className="p-6 text-sm text-muted">Nothing here yet.</li>
          )}
        </ul>

        <section className="flex max-h-[calc(100dvh-6.5rem)] flex-col">
          {convo && (
            <>
              <div className="flex items-center justify-between border-b border-line p-4">
                <div>
                  <p className="font-medium">{convo.visitor.name ?? "Anonymous visitor"}</p>
                  {convo.visitor.email && (
                    <a href={`mailto:${convo.visitor.email}`} className="text-sm text-muted underline">
                      {convo.visitor.email}
                    </a>
                  )}
                </div>
                <button
                  onClick={() => patch({ type: "conversation", id: convo.id, status: convo.status === "open" ? "closed" : "open" })}
                  className="rounded-lg border border-line px-3 py-1.5 text-sm hover:bg-card"
                >
                  {convo.status === "open" ? "Close" : "Reopen"}
                </button>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto p-5">
                {convo.messages.map((m) => (
                  <div key={m.id} className={cn("flex", m.role === "visitor" ? "justify-start" : "justify-end")}>
                    <div
                      className={cn(
                        "max-w-[75%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm",
                        m.role === "visitor" ? "bg-card" : m.role === "agent" ? "bg-invert text-invert-fg" : "border border-line text-muted",
                      )}
                    >
                      <span className="mb-1 block text-[10px] uppercase tracking-wider opacity-60">
                        {m.role === "assistant" ? "AI concierge" : m.role === "agent" ? "You" : "Visitor"} · {new Date(m.at).toLocaleString()}
                      </span>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <form
                className="flex gap-2 border-t border-line p-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  sendReply();
                }}
              >
                <input
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Reply as the ORIZON team…"
                  className="h-11 flex-1 rounded-xl border border-line px-4 text-sm outline-none focus:border-accent"
                />
                <button className="inline-flex h-11 items-center gap-2 rounded-xl bg-invert px-4 text-sm text-invert-fg disabled:opacity-40" disabled={!reply.trim()}>
                  <Send className="size-4" /> Send
                </button>
              </form>
            </>
          )}

          {lead && (
            <div className="space-y-6 overflow-y-auto p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xl font-medium">{lead.name ?? lead.email}</p>
                  <p className="text-sm text-muted">
                    {lead.kind} · {new Date(lead.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  {(["new", "open", "closed"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => patch({ type: "lead", id: lead.id, status: s })}
                      className={cn("rounded-lg border px-3 py-1.5 text-sm capitalize", lead.status === s ? "border-transparent bg-invert text-invert-fg" : "border-line hover:bg-card")}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <dl className="grid gap-4 sm:grid-cols-2">
                <Item label="Email" value={<a className="underline" href={`mailto:${lead.email}`}>{lead.email}</a>} />
                {lead.phone && <Item label="Phone" value={<a className="underline" href={`tel:${lead.phone}`}>{lead.phone}</a>} />}
                {lead.company && <Item label="Company" value={lead.company} />}
                {lead.topic && <Item label="Topic" value={lead.topic} />}
                {typeof lead.data?.slot === "string" && <Item label="Call" value={`${formatSlot(lead.data.slot)} (Algiers)`} />}
                {Object.entries(lead.data ?? {})
                  .filter(([k]) => k !== "slot")
                  .map(([k, v]) => (
                    <Item key={k} label={k} value={Array.isArray(v) ? v.join(", ") || "—" : String(v || "—")} />
                  ))}
              </dl>
              {lead.message && <p className="whitespace-pre-wrap rounded-2xl bg-card p-5 text-sm leading-relaxed">{lead.message}</p>}
              <a
                href={`mailto:${lead.email}?subject=${encodeURIComponent("Re: your request to ORIZON")}`}
                className="inline-flex h-11 items-center rounded-xl bg-invert px-5 text-sm text-invert-fg"
              >
                Reply by email
              </a>
            </div>
          )}

          {!convo && !lead && <p className="m-auto p-10 text-sm text-muted">Select an item to view it.</p>}
        </section>
      </div>
    </main>
  );
}

function Badge({ children, tone = "muted" }: { children: React.ReactNode; tone?: "muted" | "accent" }) {
  return (
    <span className={cn("rounded-full px-2 py-0.5 text-[11px] capitalize", tone === "accent" ? "bg-accent/15 text-accent" : "bg-card-strong text-muted")}>
      {children}
    </span>
  );
}

function Item({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs capitalize text-faint">{label}</dt>
      <dd className="mt-1 text-sm">{value}</dd>
    </div>
  );
}

function ago(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return "now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}
