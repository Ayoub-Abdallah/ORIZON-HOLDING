"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarDays, Copy, CornerDownLeft, Mail, MessageCircle, Phone, Search } from "lucide-react";
import { aiSolutions, divisions, nav, site } from "@/lib/content";
import { cn } from "@/lib/utils";
import { openChat } from "./reveal";

type Item = { label: string; group: string; hint?: string; icon?: React.ReactNode; run: () => void };

export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("orizon:command", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("orizon:command", onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  const items = useMemo<Item[]>(() => {
    const go = (href: string) => () => {
      setOpen(false);
      router.push(href);
    };
    return [
      ...nav.map((n) => ({ label: n.label, group: "Pages", run: go(n.href), icon: <ArrowRight className="size-4" /> })),
      { label: "Contact", group: "Pages", run: go("/contact"), icon: <ArrowRight className="size-4" /> },
      ...divisions.map((d) => ({ label: d.name, hint: d.kicker, group: "Solutions", run: go(`/solutions/${d.slug}`), icon: <ArrowRight className="size-4" /> })),
      ...aiSolutions.map((s) => ({ label: s.name, group: "AI", run: go("/ai#catalog"), icon: <ArrowRight className="size-4" /> })),
      { label: "Book a call", group: "Actions", run: go("/contact#book"), icon: <CalendarDays className="size-4" /> },
      { label: "Scope a project", hint: "Instant plan", group: "Actions", run: go("/enterprise#brief"), icon: <ArrowRight className="size-4" /> },
      { label: "Ask the AI concierge", group: "Actions", run: () => { setOpen(false); openChat(); }, icon: <MessageCircle className="size-4" /> },
      { label: `Email ${site.email}`, group: "Actions", run: () => { window.location.href = `mailto:${site.email}`; }, icon: <Mail className="size-4" /> },
      { label: `Call ${site.phone}`, group: "Actions", run: () => { window.location.href = `tel:${site.phoneHref}`; }, icon: <Phone className="size-4" /> },
      { label: "Copy email address", group: "Actions", run: () => { navigator.clipboard?.writeText(site.email); setOpen(false); }, icon: <Copy className="size-4" /> },
    ];
  }, [router]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => `${i.label} ${i.hint ?? ""} ${i.group}`.toLowerCase().includes(q));
  }, [items, query]);

  if (!open) return null;

  return (
    <div className="tone-dark !bg-transparent fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Command menu">
      <button type="button" className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} aria-label="Close" />
      <div className="fade-up relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0d] shadow-2xl">
        <div className="flex items-center gap-3 border-b border-white/10 px-4">
          <Search className="size-4 text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((a) => Math.min(a + 1, filtered.length - 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((a) => Math.max(a - 1, 0));
              } else if (e.key === "Enter") {
                filtered[active]?.run();
              }
            }}
            placeholder="Search pages, solutions, actions…"
            className="h-14 flex-1 bg-transparent text-base outline-none sm:text-[15px] placeholder:text-faint"
          />
          <kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-muted">ESC</kbd>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto p-2">
          {filtered.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted">No results for “{query}”.</li>}
          {filtered.map((item, i) => (
            <li key={`${item.group}-${item.label}`}>
              {(i === 0 || filtered[i - 1].group !== item.group) && (
                <p className="px-3 pb-1 pt-3 text-[11px] uppercase tracking-[0.18em] text-faint">{item.group}</p>
              )}
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onClick={item.run}
                className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm", i === active ? "bg-white/[0.07] text-white" : "text-white/75")}
              >
                <span className="text-muted">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.hint && <span className="text-xs text-faint">{item.hint}</span>}
                {i === active && <CornerDownLeft className="size-3.5 text-muted" />}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
