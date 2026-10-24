import type { Metadata } from "next";
import { Check, Sparkles } from "lucide-react";
import { aiSolutions } from "@/lib/content";
import { ButtonLink, PageHero, Pill, Section, SectionHeader } from "@/components/ui";
import { ChatButton } from "@/components/site/chat-button";
import { CtaBand } from "@/components/sections";

export const metadata: Metadata = {
  title: "AI Solutions",
  description: "Private knowledge assistants, autonomous agents, document intelligence, vision and sovereign LLMs — deployed securely inside your organization.",
};

const stack = [
  { name: "Your data", items: ["Documents & wikis", "Databases & ERP", "Email & tickets", "Images & video"] },
  { name: "ORIZON intelligence layer", items: ["Retrieval & RAG", "Fine-tuned models", "Agents & tool use", "Guardrails & evals"] },
  { name: "Where it runs", items: ["Your data center", "National / sovereign cloud", "Public cloud", "Edge devices"] },
];

const guarantees = [
  "Your data is never used to train third-party models.",
  "Every answer is traceable to its source.",
  "Role-based access mirrors your existing permissions.",
  "Continuous evaluation against your own test set.",
  "Full audit logs for compliance and review.",
  "Human-in-the-loop on every consequential action.",
];

export default function AiPage() {
  return (
    <>
      <PageHero
        eyebrow="AI solutions"
        title="Models that speak your domain, privately."
        lead="We design, fine-tune and deploy AI systems — from copilots and agents to bespoke domain models running securely inside your walls."
      >
        <ButtonLink href="/contact?topic=AI%20solution#book" arrow>
          Plan an AI Sprint
        </ButtonLink>
        <ChatButton label="Talk to our AI" />
      </PageHero>

      <Section tone="light" id="catalog">
        <div className="container-x">
          <SectionHeader eyebrow="Solution catalog" title="Proven patterns, tailored to you." lead="Each solution starts from a battle-tested blueprint and is adapted to your data, workflows and constraints." />
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {aiSolutions.map((s, i) => (
              <article key={s.name} data-reveal style={{ ["--delay" as string]: `${(i % 4) * 60}ms` }} className="card-glow flex flex-col p-6">
                <span className="flex size-10 items-center justify-center rounded-xl bg-invert text-invert-fg">
                  <Sparkles className="size-4" strokeWidth={1.5} />
                </span>
                <h3 className="mt-8 text-lg font-medium">{s.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{s.summary}</p>
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {s.tags.map((t) => (
                    <Pill key={t} className="px-2.5 py-0.5 text-[11px]">{t}</Pill>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="dark" className="overflow-hidden">
        <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
        <div className="container-x relative">
          <SectionHeader align="center" eyebrow="Architecture" title="Intelligence, layered on what you already have." />
          <div className="mt-16 grid items-stretch gap-4 lg:grid-cols-3">
            {stack.map((col, i) => (
              <div key={col.name} data-reveal style={{ ["--delay" as string]: `${i * 100}ms` }} className={`card-glow p-7 ${i === 1 ? "ring-1 ring-accent/40 lg:-my-4 lg:py-11" : ""}`}>
                <p className="eyebrow">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-4 text-xl font-medium">{col.name}</p>
                <ul className="mt-6 space-y-3">
                  {col.items.map((it) => (
                    <li key={it} className="flex items-center gap-3 rounded-xl border border-line bg-white/[0.02] px-4 py-3 text-sm">
                      <span className={`size-1.5 rounded-full ${i === 1 ? "bg-accent" : "bg-white/40"}`} /> {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="light">
        <div className="container-x grid gap-16 lg:grid-cols-2">
          <SectionHeader
            eyebrow="Trust, by design"
            title="Security and integrity are preconditions."
            lead="AI earns its place only when people can rely on it. Every system we ship comes with these guarantees."
          />
          <ul className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2" data-reveal>
            {guarantees.map((g) => (
              <li key={g} className="flex gap-3 bg-bg p-6 text-[15px]">
                <Check className="mt-0.5 size-5 shrink-0 text-accent" /> {g}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="light" className="!bg-[#f5f5f6]">
        <div className="container-x">
          <SectionHeader eyebrow="The AI Sprint" title="From idea to working pilot in weeks." />
          <ol className="mt-16 grid gap-4 md:grid-cols-4">
            {[
              ["Week 1", "Use-case & data audit", "We pick the highest-value use case and check your data is ready."],
              ["Week 2", "Prototype", "A working assistant or agent on a slice of your real data."],
              ["Week 3", "Evaluate", "Measured against your own test questions and success criteria."],
              ["Week 4", "Decide", "A clear go/no-go, ROI case and a production roadmap."],
            ].map(([w, t, d], i) => (
              <li key={w} data-reveal style={{ ["--delay" as string]: `${i * 80}ms` }} className="rounded-3xl bg-white p-7">
                <p className="text-xs uppercase tracking-[0.18em] text-accent">{w}</p>
                <p className="mt-6 text-lg font-medium">{t}</p>
                <p className="mt-2 text-sm text-muted">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <CtaBand title="Put intelligence to work." lead="Bring one use case. Leave with a plan to ship it." />
    </>
  );
}
