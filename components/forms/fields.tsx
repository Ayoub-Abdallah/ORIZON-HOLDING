"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type FieldErrors = Record<string, string[] | undefined>;

export function useLeadSubmit() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<FieldErrors>({});

  async function submit(payload: Record<string, unknown>) {
    setState("sending");
    setError(null);
    setFields({});
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string; fields?: FieldErrors };
      if (!res.ok) {
        setFields(json.fields ?? {});
        setError(json.error ?? "Something went wrong. Please try again.");
        setState("error");
        return false;
      }
      setState("done");
      return true;
    } catch {
      setError("Network error. Check your connection and try again.");
      setState("error");
      return false;
    }
  }

  return { state, error, fields, submit, reset: () => setState("idle") };
}

const inputBase =
  "w-full rounded-xl border border-line bg-bg px-4 py-3 text-base sm:text-[15px] text-fg placeholder:text-faint outline-none transition-colors focus:border-accent focus:ring-4 focus:ring-accent/15";

export function Field({
  label,
  error,
  children,
  hint,
}: {
  label: string;
  error?: string[];
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-baseline justify-between text-[13px] font-medium text-fg">
        {label}
        {hint && <span className="text-xs font-normal text-faint">{hint}</span>}
      </span>
      {children}
      {error?.[0] && <span className="mt-1.5 block text-xs text-red-500">{error[0]}</span>}
    </label>
  );
}

export function Input({ className, invalid, ...rest }: ComponentProps<"input"> & { invalid?: boolean }) {
  return <input className={cn(inputBase, invalid && "border-red-500/60", className)} aria-invalid={invalid || undefined} {...rest} />;
}

export function Textarea({ className, invalid, ...rest }: ComponentProps<"textarea"> & { invalid?: boolean }) {
  return (
    <textarea
      className={cn(inputBase, "min-h-36 resize-y", invalid && "border-red-500/60", className)}
      aria-invalid={invalid || undefined}
      {...rest}
    />
  );
}

export function Select({ className, children, ...rest }: ComponentProps<"select">) {
  return (
    <select className={cn(inputBase, "appearance-none bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10", className)} style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23888' stroke-width='1.5' fill='none'/%3E%3C/svg%3E\")" }} {...rest}>
      {children}
    </select>
  );
}

/** Invisible field that bots fill and humans don't. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
      {message}
    </p>
  );
}

export function formToObject(form: HTMLFormElement) {
  return Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
}
