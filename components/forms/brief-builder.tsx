"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { Success } from "./contact-form";
import { Field, FormError, Honeypot, Input, Textarea, formToObject, useLeadSubmit } from "./fields";

const solutions = [
  { id: "ai", label: "AI assistant or agents", weight: 3 },
  { id: "platform", label: "Custom software platform", weight: 4 },
  { id: "app", label: "Web or mobile app", weight: 2 },
  { id: "data", label: "Data platform & analytics", weight: 3 },
  { id: "enterprise", label: "Enterprise system / ERP", weight: 5 },
  { id: "infra", label: "Cloud, DevOps or security", weight: 2 },
];

const capabilities = [
  "LLM / generative AI",
  "Integrations with existing tools",
  "Mobile apps",
  "Dashboards & reporting",
  "Payments",
  "Arabic / French / English",
  "On-prem or sovereign hosting",
  "SSO & role-based access",
];

const stages = [
  { label: "Just an idea", weight: 1 },
  { label: "Prototype exists", weight: 0 },
  { label: "Live, needs to scale", weight: 1 },
  { label: "Legacy to modernize", weight: 2 },
];

const timelines = ["Under 1 month", "1–3 months", "3–6 months", "Flexible"];
const scales = [
  { label: "Internal team", weight: 0 },
  { label: "Thousands of users", weight: 1 },
  { label: "Millions / enterprise-wide", weight: 3 },
];

type Brief = { solution: string; capabilities: string[]; stage: string; timeline: string; scale: string };

function estimate(b: Brief) {
  const s = solutions.find((x) => x.label === b.solution)?.weight ?? 2;
  const st = stages.find((x) => x.label === b.stage)?.weight ?? 0;
  const sc = scales.find((x) => x.label === b.scale)?.weight ?? 0;
  const score = s + st + sc + b.capabilities.length * 0.6;

  if (b.solution === solutions[0].label && score < 6)
    return { offer: "AI Sprint", weeks: "2–4 weeks", team: "AI engineer · product lead", note: "A working pilot on your real data, then a clear go/no-go." };
  if (score < 5) return { offer: "Build Project", weeks: "4–8 weeks", team: "2 engineers · designer · product lead", note: "A focused build with weekly demos from week one." };
  if (score < 8) return { offer: "Build Project", weeks: "8–16 weeks", team: "3–4 engineers · designer · architect", note: "Phased delivery: an MVP first, then hardening and scale." };
  if (score < 10.5)
    return { offer: "Intelligence Platform", weeks: "12–24 weeks", team: "Cross-division pod (AI, software, data, cloud)", note: "Deployed in your environment and licensed to you." };
  return { offer: "Enterprise Program", weeks: "6–18 months", team: "Multiple pods · dedicated program lead", note: "A multi-team roadmap with one accountable partner." };
}

export function BriefBuilder() {
  const [step, setStep] = useState(0);
  const [brief, setBrief] = useState<Brief>({ solution: "", capabilities: [], stage: "", timeline: "", scale: "" });
  const { state, error, fields, submit, reset } = useLeadSubmit();
  const result = useMemo(() => estimate(brief), [brief]);

  const canNext = [!!brief.solution, true, !!brief.stage && !!brief.timeline && !!brief.scale][step] ?? true;
  const steps = ["Project", "Capabilities", "Context", "Your plan"];

  if (state === "done") {
    return (
      <Success
        title="Brief received."
        text={`We'll come back within two business days with a tailored proposal for your ${result.offer.toLowerCase()}.`}
        onReset={() => {
          reset();
          setStep(0);
          setBrief({ solution: "", capabilities: [], stage: "", timeline: "", scale: "" });
        }}
      />
    );
  }

  return (
    <div className="rounded-3xl border border-line bg-bg p-6 shadow-[0_30px_80px_-40px_rgb(0_0_0/0.25)] md:p-10">
      <ol className="flex items-center gap-2" aria-label="Progress">
        {steps.map((label, i) => (
          <li key={label} className="flex flex-1 flex-col gap-2">
            <span className={cn("h-1 rounded-full transition-colors duration-500", i <= step ? "bg-accent" : "bg-card-strong")} />
            <span className={cn("hidden text-xs sm:block", i === step ? "text-fg" : "text-faint")}>{label}</span>
          </li>
        ))}
      </ol>

      <div className="mt-8 min-h-[320px]" key={step}>
        {step === 0 && (
          <Step title="What are you building?">
            <div className="grid gap-3 sm:grid-cols-2">
              {solutions.map((s) => (
                <Choice key={s.id} active={brief.solution === s.label} onClick={() => setBrief({ ...brief, solution: s.label })}>
                  {s.label}
                </Choice>
              ))}
            </div>
          </Step>
        )}

        {step === 1 && (
          <Step title="What does it need?" hint="Select all that apply.">
            <div className="flex flex-wrap gap-2.5">
              {capabilities.map((c) => {
                const on = brief.capabilities.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={on}
                    onClick={() =>
                      setBrief({
                        ...brief,
                        capabilities: on ? brief.capabilities.filter((x) => x !== c) : [...brief.capabilities, c],
                      })
                    }
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition-all",
                      on ? "border-accent bg-accent/10 text-fg" : "border-line hover:border-fg/30",
                    )}
                  >
                    {on && <Check className="size-3.5 text-accent" />}
                    {c}
                  </button>
                );
              })}
            </div>
          </Step>
        )}

        {step === 2 && (
          <Step title="Where are you today?">
            <Group label="Stage" options={stages.map((s) => s.label)} value={brief.stage} onChange={(v) => setBrief({ ...brief, stage: v })} />
            <Group label="Timeline" options={timelines} value={brief.timeline} onChange={(v) => setBrief({ ...brief, timeline: v })} />
            <Group label="Scale" options={scales.map((s) => s.label)} value={brief.scale} onChange={(v) => setBrief({ ...brief, scale: v })} />
          </Step>
        )}

        {step === 3 && (
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] fade-up">
            <div className="tone-dark relative overflow-hidden rounded-2xl p-7">
              <div className="horizon-glow pointer-events-none absolute inset-x-0 bottom-0 h-2/3 opacity-70" aria-hidden />
              <div className="relative">
                <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted">
                  <Sparkles className="size-3.5 text-accent-soft" /> Recommended
                </p>
                <p className="display mt-4 text-4xl">{result.offer}</p>
                <dl className="mt-8 space-y-4 text-sm">
                  <div>
                    <dt className="text-faint">Typical duration</dt>
                    <dd className="mt-1 text-base">{result.weeks}</dd>
                  </div>
                  <div>
                    <dt className="text-faint">Team</dt>
                    <dd className="mt-1 text-base">{result.team}</dd>
                  </div>
                  <div>
                    <dt className="text-faint">How it runs</dt>
                    <dd className="mt-1 text-base">{result.note}</dd>
                  </div>
                </dl>
                <p className="mt-8 text-xs text-faint">Indicative only. Your proposal is fixed-scope, fixed-outcome.</p>
              </div>
            </div>
            <form
              noValidate
              className="relative space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const d = formToObject(e.currentTarget);
                await submit({
                  kind: "brief",
                  name: d.name,
                  email: d.email,
                  company: d.company,
                  phone: d.phone,
                  message: d.message,
                  website: d.website,
                  data: { ...brief, estimate: `${result.offer} · ${result.weeks}` },
                });
              }}
            >
              <Honeypot />
              <p className="text-lg font-medium">Get the full proposal</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name" error={fields.name}>
                  <Input name="name" autoComplete="name" invalid={!!fields.name} />
                </Field>
                <Field label="Work email" error={fields.email}>
                  <Input name="email" type="email" autoComplete="email" invalid={!!fields.email} />
                </Field>
                <Field label="Company" hint="Optional">
                  <Input name="company" autoComplete="organization" />
                </Field>
                <Field label="Phone" hint="Optional">
                  <Input name="phone" type="tel" autoComplete="tel" />
                </Field>
              </div>
              <Field label="Anything else?" hint="Optional">
                <Textarea name="message" className="min-h-24" placeholder="Goals, constraints, links…" />
              </Field>
              <FormError message={error} />
              <Button type="submit" className="w-full" disabled={state === "sending"}>
                {state === "sending" ? "Sending…" : "Send my brief"}
              </Button>
            </form>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className={cn("inline-flex items-center gap-2 text-sm text-muted hover:text-fg", step === 0 && "invisible")}
        >
          <ArrowLeft className="size-4" /> Back
        </button>
        {step < 3 && (
          <Button type="button" onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
            {step === 2 ? "See my plan" : "Continue"} <ArrowRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function Step({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="fade-up">
      <p className="display text-3xl">{title}</p>
      {hint && <p className="mt-2 text-sm text-muted">{hint}</p>}
      <div className="mt-6 space-y-6">{children}</div>
    </div>
  );
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex items-center justify-between rounded-2xl border px-5 py-4 text-left text-[15px] transition-all",
        active ? "border-accent bg-accent/[0.07] shadow-[0_0_0_3px_rgb(91_140_255/0.15)]" : "border-line hover:border-fg/25 hover:bg-card",
      )}
    >
      {children}
      <span className={cn("flex size-5 items-center justify-center rounded-full border transition-all", active ? "border-accent bg-accent" : "border-line")}>
        {active && <Check className="size-3 text-white" />}
      </span>
    </button>
  );
}

function Group({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <fieldset>
      <legend className="text-[13px] font-medium">{label}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={value === o}
            onClick={() => onChange(o)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-colors",
              value === o ? "border-transparent bg-invert text-invert-fg" : "border-line hover:border-fg/30",
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
