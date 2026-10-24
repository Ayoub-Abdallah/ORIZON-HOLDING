"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp, MessageCircle, UserRound, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/schemas";

type Convo = { id: string; mode: "ai" | "human"; messages: ChatMessage[] };

const STORAGE_KEY = "orizon.chat";
const suggestions = ["What AI solutions do you build?", "How do projects start?", "Can you host AI on-prem?", "Book a call"];

const greeting: ChatMessage = {
  id: "greeting",
  role: "assistant",
  text: "Hi, I'm the ORIZON concierge. Ask me anything about our AI and software work — or talk to a human anytime.",
  at: new Date(0).toISOString(),
};

function load(): Convo | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Convo) : null;
  } catch {
    return null;
  }
}

function save(c: Convo) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  } catch {
    /* storage may be unavailable (private mode) — the chat still works in-memory */
  }
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [convo, setConvo] = useState<Convo | null>(null);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [handoff, setHandoff] = useState(false);
  const [unread, setUnread] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const seen = useRef(0);

  // On phones the chat is full-screen: stop the page behind it from scrolling.
  useEffect(() => {
    if (!open || window.matchMedia("(min-width: 640px)").matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    const c = load();
    if (c) {
      setConvo(c);
      seen.current = c.messages.length;
    }
    const onOpen = () => setOpen(true);
    window.addEventListener("orizon:chat", onOpen);
    return () => window.removeEventListener("orizon:chat", onOpen);
  }, []);

  const update = useCallback((c: Convo) => {
    setConvo(c);
    save(c);
  }, []);

  // While a human is on the line, poll for agent replies.
  useEffect(() => {
    if (!convo || convo.mode !== "human") return;
    const id = convo.id;
    const tick = async () => {
      try {
        const res = await fetch(`/api/chat/${id}`, { cache: "no-store" });
        if (!res.ok) return;
        const { conversation } = (await res.json()) as { conversation: Convo };
        setConvo((prev) => {
          if (prev && conversation.messages.length === prev.messages.length) return prev;
          save(conversation);
          return conversation;
        });
      } catch {
        /* retry on next tick */
      }
    };
    const timer = setInterval(tick, open ? 5000 : 20000);
    return () => clearInterval(timer);
  }, [convo?.id, convo?.mode, open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const count = convo?.messages.length ?? 0;
    if (open) {
      seen.current = count;
      setUnread(0);
    } else if (count > seen.current) {
      setUnread(count - seen.current);
    }
  }, [convo?.messages.length, open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [convo?.messages.length, pending, handoff, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || pending) return;
    if (/^book a call$/i.test(message)) {
      window.location.href = "/contact#book";
      return;
    }
    setInput("");
    setError(null);
    setPending(true);
    const optimistic: Convo = {
      id: convo?.id ?? "",
      mode: convo?.mode ?? "ai",
      messages: [...(convo?.messages ?? []), { id: `tmp${Date.now()}`, role: "visitor", text: message, at: new Date().toISOString() }],
    };
    setConvo(optimistic);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: convo?.id || undefined, message }),
      });
      const json = (await res.json()) as { conversation?: Convo; error?: string };
      if (!res.ok || !json.conversation) throw new Error(json.error ?? "Message failed");
      update(json.conversation);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Message failed");
      if (convo) setConvo(convo);
      setInput(message);
    } finally {
      setPending(false);
    }
  }

  async function requestHuman(form: HTMLFormElement) {
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/chat/handoff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: convo?.id || `c_${crypto.randomUUID().replace(/-/g, "").slice(0, 20)}`,
          name: data.name,
          email: data.email,
        }),
      });
      const json = (await res.json()) as { conversation?: Convo; error?: string };
      if (!res.ok || !json.conversation) throw new Error(json.error ?? "Request failed");
      update(json.conversation);
      setHandoff(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setPending(false);
    }
  }


  const messages = [greeting, ...(convo?.messages ?? [])];
  const isHuman = convo?.mode === "human";

  return (
    <div className="tone-dark !bg-transparent fixed bottom-4 right-4 z-[60] flex flex-col items-end gap-3 md:bottom-6 md:right-6">
      {open && (
        <div
          role="dialog"
          aria-label="Chat with ORIZON"
          className="fade-up fixed inset-0 z-[61] flex h-[100dvh] w-full flex-col overflow-hidden bg-[#0b0b0d] pb-[env(safe-area-inset-bottom)] sm:static sm:inset-auto sm:h-[min(640px,calc(100dvh-6rem))] sm:w-[400px] sm:max-w-[calc(100vw-2rem)] sm:rounded-3xl sm:border sm:border-white/10 sm:bg-[#0b0b0d]/95 sm:pb-0 sm:shadow-[0_40px_120px_-20px_rgb(0_0_0/0.8)] sm:backdrop-blur-xl"
        >
          <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="relative flex size-9 items-center justify-center rounded-full bg-white text-[10px] font-semibold tracking-widest text-black">
                O
                <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-[#0b0b0d] bg-emerald-400" />
              </span>
              <div>
                <p className="text-sm font-medium">{isHuman ? "ORIZON team" : "ORIZON concierge"}</p>
                <p className="text-xs text-muted">{isHuman ? "A human will reply here" : "AI · replies instantly"}</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 text-muted hover:bg-white/5 hover:text-fg" aria-label="Close chat">
              <X className="size-4" />
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-5" aria-live="polite">
            {messages.map((m) => (
              <Bubble key={m.id} message={m} />
            ))}
            {pending && !handoff && (
              <div className="flex w-fit gap-1 rounded-2xl rounded-bl-md bg-white/[0.06] px-4 py-3.5">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="typing-dot size-1.5 rounded-full bg-white/70" style={{ animationDelay: `${i * 150}ms` }} />
                ))}
              </div>
            )}
            {!convo?.messages.length && (
              <div className="flex flex-wrap gap-2 pt-2">
                {suggestions.map((s) => (
                  <button key={s} type="button" onClick={() => send(s)} className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/75 hover:border-white/30 hover:text-white">
                    {s}
                  </button>
                ))}
              </div>
            )}
            {handoff && (
              <form
                className="fade-up space-y-2.5 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  requestHuman(e.currentTarget);
                }}
              >
                <p className="text-sm">Who should we reply to?</p>
                <input name="name" required placeholder="Your name" autoComplete="name" className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-base outline-none sm:text-sm focus:border-accent" />
                <input name="email" type="email" required placeholder="Email" autoComplete="email" className="w-full rounded-lg border border-white/10 bg-black px-3 py-2.5 text-base outline-none sm:text-sm focus:border-accent" />
                <div className="flex gap-2 pt-1">
                  <button type="submit" disabled={pending} className="h-9 flex-1 rounded-lg bg-white text-sm font-medium text-black disabled:opacity-50">
                    {pending ? "Connecting…" : "Connect me"}
                  </button>
                  <button type="button" onClick={() => setHandoff(false)} className="h-9 rounded-lg px-3 text-sm text-muted hover:text-fg">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {error && <p className="px-5 pb-2 text-xs text-red-400">{error}</p>}

          <div className="border-t border-white/10 p-3">
            {!isHuman && !handoff && (
              <button type="button" onClick={() => setHandoff(true)} className="mb-2 inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs text-muted hover:text-fg">
                <UserRound className="size-3.5" /> Talk to a human
              </button>
            )}
            <form
              className="flex items-end gap-2 rounded-2xl border border-white/10 bg-black/50 p-1.5 pl-4 focus-within:border-white/25"
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
            >
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder="Write a message…"
                maxLength={2000}
                aria-label="Message"
                className="max-h-32 min-h-9 flex-1 resize-none bg-transparent py-2 text-base outline-none sm:text-sm placeholder:text-faint"
              />
              <button type="submit" disabled={!input.trim() || pending} aria-label="Send" className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white text-black transition-opacity disabled:opacity-30">
                <ArrowUp className="size-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
        className={cn("group relative h-14", open ? "hidden sm:flex" : "flex", " items-center gap-2 rounded-full border border-white/15 bg-black pl-4 pr-5 text-sm font-medium text-white shadow-[0_20px_50px_-10px_rgb(0_0_0/0.6),0_0_0_1px_rgb(255_255_255/0.04)] transition-transform hover:scale-[1.03]")}
      >
        <span className="absolute inset-0 -z-10 rounded-full bg-accent/40 opacity-0 blur-xl transition-opacity group-hover:opacity-100" aria-hidden />
        {open ? <X className="size-5" /> : <MessageCircle className="size-5" strokeWidth={1.75} />}
        <span className="hidden sm:inline">{open ? "Close" : "Ask ORIZON"}</span>
        {unread > 0 && !open && (
          <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-accent text-[11px]">{unread}</span>
        )}
      </button>
    </div>
  );
}

function Bubble({ message }: { message: ChatMessage }) {
  const mine = message.role === "visitor";
  return (
    <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed",
          mine ? "rounded-br-md bg-white text-black" : "rounded-bl-md bg-white/[0.06] text-white/90",
          message.role === "agent" && "border border-accent/40 bg-accent/10",
        )}
      >
        {message.role === "agent" && <span className="mb-1 block text-[11px] uppercase tracking-wider text-muted">ORIZON team</span>}
        {linkify(message.text)}
      </div>
    </div>
  );
}

// Turn site paths like /contact#book and emails into links.
function linkify(text: string) {
  const parts = text.split(/(\s\/[a-z][\w-]*(?:#[\w-]+)?|[\w.+-]+@[\w-]+\.[\w.]+)/gi);
  return parts.map((p, i) => {
    const t = p.trim();
    if (/^\/[a-z]/i.test(t)) return <span key={i}> <a href={t} className="underline underline-offset-2">{t}</a></span>;
    if (/@/.test(t) && /^[\w.+-]+@[\w-]+\.[\w.]+$/.test(t)) return <a key={i} href={`mailto:${t}`} className="underline underline-offset-2">{t}</a>;
    return p;
  });
}
