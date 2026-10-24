"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatSlot, slotTime, upcomingDays, type Day } from "@/lib/slots";
import { Button } from "@/components/ui";
import { site } from "@/lib/content";
import { Field, FormError, Honeypot, Input, Select, formToObject, useLeadSubmit } from "./fields";

const topics = ["AI strategy & use cases", "Custom software project", "Enterprise program", "Technical audit", "Something else"];

export function BookingWidget() {
  // Computed after mount: the page is static, so build-time dates would be stale.
  const [days, setDays] = useState<Day[]>([]);
  const [day, setDay] = useState("");
  const [slot, setSlot] = useState<string | null>(null);
  const [taken, setTaken] = useState<Set<string>>(new Set());
  const [booked, setBooked] = useState<string | null>(null);
  const { state, error, fields, submit } = useLeadSubmit();

  async function loadTaken() {
    try {
      const res = await fetch("/api/slots", { cache: "no-store" });
      const json = (await res.json()) as { taken: string[] };
      setTaken(new Set(json.taken));
    } catch {
      /* availability is a nicety; the server re-checks on submit */
    }
  }

  useEffect(() => {
    const next = upcomingDays(10);
    setDays(next);
    setDay(next[0].key);
    loadTaken();
  }, []);

  const current = days.find((d) => d.key === day) ?? days[0];

  if (!current) {
    return <div className="h-64 animate-pulse bg-card" aria-label="Loading availability" />;
  }

  if (booked) {
    return (
      <div role="status" className="border border-line bg-card p-8 fade-up">
        <CalendarCheck className="size-8 text-accent" strokeWidth={1.5} />
        <p className="mt-4 text-xl font-medium">You're booked.</p>
        <p className="mt-2 text-muted">
          {formatSlot(booked)} (Algiers time). We'll email a meeting link shortly.
        </p>
        <button
          type="button"
          onClick={() => downloadIcs(booked)}
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4"
        >
          <Download className="size-4" /> Add to calendar (.ics)
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="relative"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!slot) return;
        const data = formToObject(e.currentTarget);
        const ok = await submit({
          kind: "booking",
          name: data.name,
          email: data.email,
          company: data.company,
          message: data.message,
          website: data.website,
          data: { slot, topic: data.topic },
        });
        if (ok) setBooked(slot);
        else loadTaken();
      }}
    >
      <Honeypot />
      <p className="text-[13px] font-medium">1 · Pick a day</p>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
        {days.map((d) => (
          <button
            key={d.key}
            type="button"
            onClick={() => {
              setDay(d.key);
              setSlot(null);
            }}
            className={cn(
              "flex min-w-[68px] flex-col items-center rounded-xl border px-3 py-2.5 text-sm transition-colors",
              d.key === day ? "border-transparent bg-invert text-invert-fg" : "border-line bg-card hover:bg-card-strong",
            )}
          >
            <span className="text-[11px] uppercase tracking-wider opacity-70">{d.weekday}</span>
            <span className="mt-0.5 font-medium">{d.label}</span>
          </button>
        ))}
      </div>

      <p className="mt-6 text-[13px] font-medium">2 · Pick a time <span className="font-normal text-faint">(Algiers, GMT+1)</span></p>
      <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-7">
        {current.slots.map((s) => {
          const isTaken = taken.has(s);
          return (
            <button
              key={s}
              type="button"
              disabled={isTaken}
              onClick={() => setSlot(s)}
              className={cn(
                "h-10 rounded-lg border text-sm transition-colors",
                isTaken && "cursor-not-allowed line-through opacity-35",
                slot === s ? "border-accent bg-accent text-white" : "border-line hover:border-fg/30",
              )}
            >
              {slotTime(s)}
            </button>
          );
        })}
      </div>

      <div className={cn("grid transition-all duration-500", slot ? "mt-8 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
        <div className="overflow-hidden">
          <p className="text-[13px] font-medium">3 · Your details</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" error={fields.name}>
              <Input name="name" autoComplete="name" required invalid={!!fields.name} />
            </Field>
            <Field label="Work email" error={fields.email}>
              <Input name="email" type="email" autoComplete="email" required invalid={!!fields.email} />
            </Field>
            <Field label="Company" hint="Optional">
              <Input name="company" autoComplete="organization" />
            </Field>
            <Field label="Topic">
              <Select name="topic">
                {topics.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Anything we should prepare?" hint="Optional">
              <Input name="message" placeholder="Links, context, goals…" />
            </Field>
          </div>
          <div className="mt-5 space-y-4">
            <FormError message={error} />
            <Button type="submit" className="w-full sm:w-auto" disabled={state === "sending" || !slot}>
              {state === "sending" ? "Booking…" : slot ? `Book ${formatSlot(slot)}` : "Book"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

function downloadIcs(iso: string) {
  const start = new Date(iso);
  const end = new Date(start.getTime() + 30 * 60_000);
  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ORIZON//Website//EN",
    "BEGIN:VEVENT",
    `UID:${fmt(start)}@orizon`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    "SUMMARY:Call with ORIZON",
    `DESCRIPTION:30-minute call with the ORIZON team. Questions: ${site.email}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: "orizon-call.ics" });
  a.click();
  URL.revokeObjectURL(url);
}
