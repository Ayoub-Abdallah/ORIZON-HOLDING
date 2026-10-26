"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  ChevronDown,
  Download,
  ExternalLink,
  FileText,
  Inbox as InboxIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Newspaper,
  RefreshCw,
  Search,
  Send,
  UserRound,
  X,
} from "lucide-react";
import type { Conversation, Lead } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { formatSlot } from "@/lib/slots";
import { Logo } from "@/components/logo";

async function signOut(router: ReturnType<typeof useRouter>) {
  await fetch("/api/admin/session", { method: "DELETE" });
  router.refresh();
}

export function AdminLogin() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-neutral-50 p-6 text-neutral-900">
      <form
        className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm"
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
        <Logo className="h-3" />
        <h1 className="mt-8 text-xl font-medium">Sign in</h1>
        <p className="mt-1 text-sm text-neutral-500">Team dashboard: messages, calls and live chat.</p>
        <label htmlFor="password" className="mt-6 block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="mt-2 h-11 w-full rounded-lg border border-neutral-300 bg-white px-3 text-base outline-none focus:border-neutral-900 sm:text-sm"
        />
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <button disabled={pending} className="mt-6 h-11 w-full rounded-lg bg-neutral-900 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50">
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}

type Data = { leads: Lead[]; conversations: Conversation[] };
type View = "overview" | "conversations" | "all" | Lead["kind"];

const nav: { id: View; label: string; icon: typeof InboxIcon }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "conversations", label: "Live chat", icon: MessageSquare },
  { id: "all", label: "All requests", icon: InboxIcon },
  { id: "contact", label: "Messages", icon: Mail },
  { id: "brief", label: "Project briefs", icon: FileText },
  { id: "booking", label: "Calls", icon: CalendarClock },
  { id: "careers", label: "Applications", icon: UserRound },
  { id: "newsletter", label: "Subscribers", icon: Newspaper },
];

export function Inbox() {
  const router = useRouter();
  const [data, setData] = useState<Data | null>(null);
  const [view, setView] = useState<View>("overview");
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [profile, setProfile] = useState(false);

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

  const q = query.trim().toLowerCase();
  const leads = useMemo(
    () =>
      (data?.leads ?? [])
        .filter((l) => view === "all" || l.kind === view)
        .filter((l) => !q || [l.name, l.email, l.company, l.message, l.topic].some((v) => v?.toLowerCase().includes(q))),
    [data, view, q],
  );
  const conversations = useMemo(
    () =>
      (data?.conversations ?? []).filter(
        (c) => !q || [c.visitor.name, c.visitor.email, ...c.messages.map((m) => m.text)].some((v) => v?.toLowerCase().includes(q)),
      ),
    [data, q],
  );
  const convo = data?.conversations.find((c) => c.id === selected);
  const lead = data?.leads.find((l) => l.id === selected);

  const count = (v: View) =>
    v === "overview"
      ? 0
      : v === "conversations"
        ? data?.conversations.filter((c) => c.unread).length ?? 0
        : (data?.leads ?? []).filter((l) => (v === "all" || l.kind === v) && l.status === "new").length;

  function go(v: View) {
    setView(v);
    setSelected(null);
    setDrawer(false);
  }

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
    Object.assign(document.createElement("a"), { href: url, download: `orizon-${view}-${new Date().toISOString().slice(0, 10)}.csv` }).click();
    URL.revokeObjectURL(url);
  }

  const title = nav.find((n) => n.id === view)?.label ?? "";

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between px-5">
        <Logo className="h-2.5 text-neutral-900" />
        <button className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 lg:hidden" onClick={() => setDrawer(false)} aria-label="Close menu">
          <X className="size-5" />
        </button>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2" aria-label="Dashboard">
        {nav.map((n) => (
          <button
            key={n.id}
            onClick={() => go(n.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              view === n.id ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
            )}
          >
            <n.icon className="size-4" strokeWidth={1.75} />
            <span className="flex-1 text-left">{n.label}</span>
            {count(n.id) > 0 && (
              <span className={cn("rounded-full px-1.5 text-[11px] font-medium", view === n.id ? "bg-white/20" : "bg-neutral-900 text-white")}>{count(n.id)}</span>
            )}
          </button>
        ))}
      </nav>
      <div className="border-t border-neutral-200 p-3">
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
          <Avatar />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">ORIZON team</p>
            <p className="truncate text-xs text-neutral-500">Administrator</p>
          </div>
          <button onClick={() => signOut(router)} className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900" aria-label="Sign out" title="Sign out">
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-neutral-50 text-neutral-900 [color-scheme:light]">
      {/* Sidebar: fixed on desktop, drawer on mobile */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-neutral-200 bg-white lg:block">{sidebar}</aside>
      {drawer && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-neutral-900/30" onClick={() => setDrawer(false)} aria-hidden />
          <aside className="relative h-full w-72 max-w-[85vw] bg-white shadow-xl">{sidebar}</aside>
        </div>
      )}

      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-neutral-200 bg-white/90 px-4 backdrop-blur sm:px-6">
          <button className="rounded-md p-2 text-neutral-600 hover:bg-neutral-100 lg:hidden" onClick={() => setDrawer(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          <h1 className="hidden text-base font-medium sm:block">{title}</h1>
          <div className="relative ml-auto w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              className="h-9 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-9 pr-3 text-base outline-none focus:border-neutral-400 focus:bg-white sm:text-sm"
            />
          </div>
          <button onClick={refresh} className="rounded-md p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900" aria-label="Refresh">
            <RefreshCw className={cn("size-4", loading && "animate-spin")} />
          </button>
          <div className="relative">
            <button onClick={() => setProfile((v) => !v)} className="flex items-center gap-1.5 rounded-full p-0.5 hover:bg-neutral-100" aria-label="Account" aria-expanded={profile}>
              <Avatar />
              <ChevronDown className="hidden size-4 text-neutral-400 sm:block" />
            </button>
            {profile && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setProfile(false)} aria-hidden />
                <div className="absolute right-0 z-20 mt-2 w-56 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-lg">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium">ORIZON team</p>
                    <p className="text-xs text-neutral-500">Administrator</p>
                  </div>
                  <a href="/" target="_blank" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
                    <ExternalLink className="size-4" /> View website
                  </a>
                  <button onClick={() => signOut(router)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
                    <LogOut className="size-4" /> Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        <main className="p-4 sm:p-6">
          {!data && <p className="p-6 text-sm text-neutral-500">Loading…</p>}

          {data && view === "overview" && <Overview data={data} open={(v, id) => (setView(v), setSelected(id))} />}

          {data && view !== "overview" && (
            <div className="grid overflow-hidden rounded-xl border border-neutral-200 bg-white lg:h-[calc(100dvh-7rem)] lg:grid-cols-[360px_1fr]">
              {/* List (hidden on small screens while an item is open) */}
              <div className={cn("flex min-h-0 flex-col border-neutral-200 lg:border-r", selected && "hidden lg:flex")}>
                <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
                  <p className="text-sm font-medium sm:hidden">{title}</p>
                  <p className="hidden text-xs text-neutral-500 sm:block">
                    {(n => `${n} ${n === 1 ? "item" : "items"}`)(view === "conversations" ? conversations.length : leads.length)}
                  </p>
                  {view !== "conversations" && leads.length > 0 && (
                    <button onClick={exportCsv} className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-100">
                      <Download className="size-3.5" /> Export CSV
                    </button>
                  )}
                </div>
                <ul className="min-h-0 flex-1 divide-y divide-neutral-100 overflow-y-auto">
                  {view === "conversations"
                    ? conversations.map((c) => (
                        <Row
                          key={c.id}
                          active={selected === c.id}
                          bold={c.unread}
                          title={c.visitor.name ?? "Anonymous visitor"}
                          time={c.updatedAt}
                          text={c.messages.at(-1)?.text}
                          badges={[c.mode === "human" ? ["Wants a human", true] : ["AI", false], ...(c.status === "closed" ? [["Closed", false] as const] : [])]}
                          onClick={() => {
                            setSelected(c.id);
                            if (c.unread) patch({ type: "conversation", id: c.id, read: true });
                          }}
                        />
                      ))
                    : leads.map((l) => (
                        <Row
                          key={l.id}
                          active={selected === l.id}
                          bold={l.status === "new"}
                          title={l.name ?? l.email}
                          time={l.createdAt}
                          text={l.message || l.topic || l.email}
                          badges={[[kindLabel[l.kind], false], [l.status, l.status === "new"]]}
                          onClick={() => setSelected(l.id)}
                        />
                      ))}
                  {(view === "conversations" ? conversations.length === 0 : leads.length === 0) && (
                    <li className="p-8 text-center text-sm text-neutral-500">{q ? "No results." : "Nothing here yet."}</li>
                  )}
                </ul>
              </div>

              {/* Detail */}
              <section className={cn("min-h-0 flex-col", selected ? "flex" : "hidden lg:flex")}>
                {selected && (
                  <button onClick={() => setSelected(null)} className="flex items-center gap-1.5 border-b border-neutral-200 px-4 py-3 text-sm text-neutral-600 lg:hidden">
                    <ArrowLeft className="size-4" /> Back
                  </button>
                )}

                {convo && (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 px-5 py-4">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{convo.visitor.name ?? "Anonymous visitor"}</p>
                        {convo.visitor.email && (
                          <a href={`mailto:${convo.visitor.email}`} className="truncate text-sm text-neutral-500 hover:underline">
                            {convo.visitor.email}
                          </a>
                        )}
                      </div>
                      <button
                        onClick={() => patch({ type: "conversation", id: convo.id, status: convo.status === "open" ? "closed" : "open" })}
                        className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-50"
                      >
                        {convo.status === "open" ? "Close chat" : "Reopen"}
                      </button>
                    </div>
                    <div className="min-h-[40vh] flex-1 space-y-3 overflow-y-auto bg-neutral-50 p-4 sm:p-5">
                      {convo.messages.map((m) => (
                        <div key={m.id} className={cn("flex", m.role === "visitor" ? "justify-start" : "justify-end")}>
                          <div
                            className={cn(
                              "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm sm:max-w-[75%]",
                              m.role === "visitor" ? "border border-neutral-200 bg-white" : m.role === "agent" ? "bg-neutral-900 text-white" : "bg-neutral-200/70 text-neutral-700",
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
                      className="flex gap-2 border-t border-neutral-200 p-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        sendReply();
                      }}
                    >
                      <input
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                        placeholder="Reply as the ORIZON team…"
                        className="h-11 min-w-0 flex-1 rounded-lg border border-neutral-200 px-3 text-base outline-none focus:border-neutral-400 sm:text-sm"
                      />
                      <button className="inline-flex h-11 items-center gap-2 rounded-lg bg-neutral-900 px-4 text-sm text-white disabled:opacity-40" disabled={!reply.trim()}>
                        <Send className="size-4" /> <span className="hidden sm:inline">Send</span>
                      </button>
                    </form>
                  </>
                )}

                {lead && (
                  <div className="space-y-6 overflow-y-auto p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-xl font-medium">{lead.name ?? lead.email}</p>
                        <p className="text-sm text-neutral-500">
                          {kindLabel[lead.kind]} · {new Date(lead.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex rounded-lg border border-neutral-200 p-0.5">
                        {(["new", "open", "closed"] as const).map((s) => (
                          <button
                            key={s}
                            onClick={() => patch({ type: "lead", id: lead.id, status: s })}
                            className={cn("rounded-md px-3 py-1 text-sm capitalize", lead.status === s ? "bg-neutral-900 text-white" : "text-neutral-600 hover:bg-neutral-100")}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <dl className="grid gap-4 rounded-xl border border-neutral-200 p-4 sm:grid-cols-2">
                      <Item label="Email" value={<a className="hover:underline" href={`mailto:${lead.email}`}>{lead.email}</a>} />
                      {lead.phone && <Item label="Phone" value={<a className="hover:underline" href={`tel:${lead.phone}`}>{lead.phone}</a>} />}
                      {lead.company && <Item label="Company" value={lead.company} />}
                      {lead.topic && <Item label="Topic" value={lead.topic} />}
                      {typeof lead.data?.slot === "string" && <Item label="Call" value={`${formatSlot(lead.data.slot)} (Algiers)`} />}
                      {Object.entries(lead.data ?? {})
                        .filter(([k]) => k !== "slot")
                        .map(([k, v]) => (
                          <Item key={k} label={k} value={Array.isArray(v) ? v.join(", ") || "—" : String(v || "—")} />
                        ))}
                    </dl>
                    {lead.message && <p className="whitespace-pre-wrap rounded-xl bg-neutral-50 p-4 text-sm leading-relaxed">{lead.message}</p>}
                    <a
                      href={`mailto:${lead.email}?subject=${encodeURIComponent("Re: your request to ORIZON")}`}
                      className="inline-flex h-10 items-center gap-2 rounded-lg bg-neutral-900 px-4 text-sm text-white hover:bg-neutral-800"
                    >
                      <Mail className="size-4" /> Reply by email
                    </a>
                  </div>
                )}

                {!convo && !lead && <p className="m-auto hidden p-10 text-sm text-neutral-500 lg:block">Select an item to view it.</p>}
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const kindLabel: Record<Lead["kind"], string> = {
  contact: "Message",
  brief: "Brief",
  booking: "Call",
  careers: "Application",
  newsletter: "Subscriber",
};

function Overview({ data, open }: { data: Data; open: (v: View, id: string) => void }) {
  const now = new Date().toISOString();
  const stats = [
    { label: "New requests", value: data.leads.filter((l) => l.status === "new" && l.kind !== "newsletter").length, icon: InboxIcon },
    { label: "Chats waiting for you", value: data.conversations.filter((c) => c.mode === "human" && c.status === "open").length, icon: MessageSquare },
    {
      label: "Upcoming calls",
      value: data.leads.filter((l) => l.kind === "booking" && typeof l.data?.slot === "string" && l.data.slot > now).length,
      icon: CalendarClock,
    },
    { label: "Subscribers", value: data.leads.filter((l) => l.kind === "newsletter").length, icon: Newspaper },
  ];
  const recent = [
    ...data.leads.map((l) => ({ id: l.id, at: l.createdAt, title: l.name ?? l.email, sub: kindLabel[l.kind], view: l.kind as View, isNew: l.status === "new" })),
    ...data.conversations.map((c) => ({ id: c.id, at: c.updatedAt, title: c.visitor.name ?? "Anonymous visitor", sub: "Live chat", view: "conversations" as View, isNew: c.unread })),
  ]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5">
            <s.icon className="size-4 text-neutral-400" strokeWidth={1.75} />
            <p className="mt-4 text-3xl font-medium tabular-nums">{s.value}</p>
            <p className="mt-1 text-xs text-neutral-500 sm:text-sm">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-neutral-200 bg-white">
        <p className="border-b border-neutral-200 px-5 py-3 text-sm font-medium">Recent activity</p>
        <ul className="divide-y divide-neutral-100">
          {recent.map((r) => (
            <li key={r.id}>
              <button onClick={() => open(r.view, r.id)} className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-neutral-50">
                <span className={cn("size-2 shrink-0 rounded-full", r.isNew ? "bg-blue-500" : "bg-neutral-200")} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{r.title}</span>
                  <span className="block text-xs text-neutral-500">{r.sub}</span>
                </span>
                <span className="shrink-0 text-xs text-neutral-400">{ago(r.at)}</span>
              </button>
            </li>
          ))}
          {recent.length === 0 && <li className="px-5 py-8 text-center text-sm text-neutral-500">No activity yet. New messages, calls and chats will appear here.</li>}
        </ul>
      </div>
    </div>
  );
}

function Row({
  active,
  bold,
  title,
  time,
  text,
  badges,
  onClick,
}: {
  active: boolean;
  bold?: boolean;
  title: string;
  time: string;
  text?: string;
  badges: readonly (readonly [string, boolean])[];
  onClick: () => void;
}) {
  return (
    <li>
      <button onClick={onClick} className={cn("w-full px-4 py-3.5 text-left hover:bg-neutral-50", active && "bg-neutral-100 hover:bg-neutral-100")}>
        <div className="flex items-center justify-between gap-2">
          <span className={cn("truncate text-sm", bold ? "font-semibold" : "text-neutral-800")}>{title}</span>
          <span className="shrink-0 text-[11px] text-neutral-400">{ago(time)}</span>
        </div>
        {text && <p className="mt-1 truncate text-xs text-neutral-500">{text}</p>}
        <div className="mt-2 flex gap-1.5">
          {badges.map(([label, strong]) => (
            <span key={label} className={cn("rounded-full px-2 py-0.5 text-[11px] first-letter:uppercase", strong ? "bg-blue-50 text-blue-700" : "bg-neutral-100 text-neutral-600")}>
              {label}
            </span>
          ))}
        </div>
      </button>
    </li>
  );
}

function Avatar() {
  return <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-medium text-white">OT</span>;
}

function Item({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs capitalize text-neutral-500">{label}</dt>
      <dd className="mt-1 break-words text-sm">{value}</dd>
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
