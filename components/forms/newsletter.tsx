"use client";

import { ArrowRight, Check } from "lucide-react";
import { useLeadSubmit } from "./fields";

export function Newsletter() {
  const { state, error, submit } = useLeadSubmit();

  return (
    <form
      noValidate
      className="w-full max-w-sm"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const email = new FormData(form).get("email");
        if (await submit({ kind: "newsletter", email })) form.reset();
      }}
    >
      <label htmlFor="newsletter-email" className="text-sm font-medium">
        The Horizon Brief
      </label>
      <p className="mt-1 text-sm text-muted">Monthly notes on applied AI and engineering. No noise.</p>
      <div className="mt-4 flex h-12 items-center rounded-full border border-line bg-card pl-5 pr-1.5 focus-within:border-accent">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="you@company.com"
          autoComplete="email"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-faint"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          aria-label="Subscribe"
          className="inline-flex size-9 items-center justify-center rounded-full bg-invert text-invert-fg transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {state === "done" ? <Check className="size-4" /> : <ArrowRight className="size-4" />}
        </button>
      </div>
      <p className="mt-2 h-4 text-xs text-muted" role="status">
        {state === "done" ? "You're subscribed. Welcome aboard." : state === "error" ? error : ""}
      </p>
    </form>
  );
}
