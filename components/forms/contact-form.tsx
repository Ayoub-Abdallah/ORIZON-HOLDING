"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui";
import { Field, FormError, Honeypot, Input, Select, Textarea, formToObject, useLeadSubmit } from "./fields";

const topics = ["AI solution", "Custom software", "Enterprise program", "Partnership", "Other"] as const;

export function ContactForm() {
  const params = useSearchParams();
  const preset = params.get("topic");
  const { state, error, fields, submit, reset } = useLeadSubmit();

  if (state === "done") {
    return (
      <Success
        title="Message received."
        text="An engineer will reply within one business day. For anything urgent, call or WhatsApp us."
        onReset={reset}
      />
    );
  }

  return (
    <form
      noValidate
      className="relative space-y-5"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        if (await submit({ kind: "contact", ...formToObject(form) })) form.reset();
      }}
    >
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" error={fields.name}>
          <Input name="name" autoComplete="name" required invalid={!!fields.name} placeholder="Amina Benali" />
        </Field>
        <Field label="Work email" error={fields.email}>
          <Input name="email" type="email" autoComplete="email" required invalid={!!fields.email} placeholder="amina@company.com" />
        </Field>
        <Field label="Company" hint="Optional" error={fields.company}>
          <Input name="company" autoComplete="organization" placeholder="Company name" />
        </Field>
        <Field label="Phone" hint="Optional" error={fields.phone}>
          <Input name="phone" type="tel" autoComplete="tel" placeholder="+213 …" />
        </Field>
      </div>
      <Field label="What can we help with?" error={fields.topic}>
        <Select name="topic" defaultValue={topics.find((t) => t === preset) ?? "AI solution"}>
          {topics.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </Select>
      </Field>
      <Field label="Tell us about it" error={fields.message}>
        <Textarea name="message" required invalid={!!fields.message} placeholder="The problem, the users, the deadline — whatever helps us understand." />
      </Field>
      <FormError message={error} />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-xs text-faint">We reply within one business day. No spam, ever.</p>
        <Button type="submit" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Send message"}
        </Button>
      </div>
    </form>
  );
}

export function Success({ title, text, onReset }: { title: string; text: string; onReset?: () => void }) {
  return (
    <div role="status" className="flex flex-col items-start gap-4 border border-line bg-card p-8 fade-up">
      <CheckCircle2 className="size-8 text-accent" strokeWidth={1.5} />
      <div>
        <p className="text-xl font-medium">{title}</p>
        <p className="mt-2 text-muted">{text}</p>
      </div>
      {onReset && (
        <button type="button" onClick={onReset} className="text-sm text-muted underline underline-offset-4 hover:text-fg">
          Send another
        </button>
      )}
    </div>
  );
}
