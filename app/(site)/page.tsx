import Link from "next/link";
import { ArrowRight, Fingerprint, Globe2, Languages, Layers, ServerCog, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { aiSolutions, edges, site } from "@/lib/content";
import { ButtonLink, Pill, Section, SectionHeader } from "@/components/ui";
import { Console } from "@/components/home/console";
import { ChatButton } from "@/components/site/chat-button";
import { CtaBand, DivisionsBento, IndustriesGrid, OffersGrid, ProcessSteps } from "@/components/sections";

const marquee = ["Large language models", "Retrieval & RAG", "Autonomous agents", "Custom platforms", "Web & mobile", "Data engineering", "Cloud & Kubernetes", "Zero-trust security", "Enterprise systems", "Computer vision"];

export default function Home() {
  return (
    <>
      {/* HERO — pure CSS, no media: paints instantly. */}
      <section className="tone-dark relative overflow-hidden pt-36 md:pt-44">
        <div className="stars pointer-events-none absolute inset-0" aria-hidden />
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden />
        <div className="container-x relative text-center">
          <Link
            href="/ai"
            className="fade-up group mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1.5 pl-1.5 pr-4 text-xs text-white/70 backdrop-blur hover:border-white/25 hover:text-white"
          >
            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-black">New</span>
            Private, sovereign AI for the enterprise
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <h1
            className="display text-gradient fade-up mx-auto mt-8 max-w-5xl text-[3.25rem] leading-[0.98] sm:text-7xl md:text-8xl lg:text-[7.5rem]"
            style={{ ["--delay" as string]: "80ms" }}
          >
            Intelligence,
            <br />
            engineered.
          </h1>
          <p className="fade-up mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl" style={{ ["--delay" as string]: "160ms" }}>
            ORIZON designs, builds and operates the AI and software that modern organizations run on — so they don&apos;t just work, they learn, adapt and accelerate.
          </p>
          <div className="fade-up mt-10 flex flex-wrap justify-center gap-3" style={{ ["--delay" as string]: "240ms" }}>
            <ButtonLink href="/enterprise#brief" arrow>
              Start a project
            </ButtonLink>
            <ButtonLink href="/solutions" variant="secondary">
              Explore solutions
            </ButtonLink>
          </div>
        </div>

        <div className="relative mt-20 md:mt-28">
          <div className="pointer-events-none absolute inset-x-[-30%] top-[10%] aspect-[2/1] horizon-arc md:inset-x-[-10%]" aria-hidden />
          <div className="container-x relative fade-up" style={{ ["--delay" as string]: "360ms" }}>
            <Console />
          </div>
          <div className="relative h-24 bg-gradient-to-b from-transparent to-black md:h-32" />
        </div>

        <div className="relative overflow-hidden border-y border-white/[0.07] py-6" aria-label="Capabilities">
          <div className="marquee gap-12 text-sm text-white/45">
            {[...marquee, ...marquee].map((m, i) => (
              <span key={i} className="flex items-center gap-12 whitespace-nowrap">
                {m} <span className="size-1 rounded-full bg-white/25" />
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE BUILD — light */}
      <Section tone="light" id="solutions">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeader
              eyebrow="What we build"
              title="An integrated company, not a menu."
              lead="Most vendors sell a single layer. We own the whole stack — intelligence, software, data, cloud and security — so we solve your entire problem."
            />
            <ButtonLink href="/solutions" variant="secondary" arrow className="shrink-0">
              All solutions
            </ButtonLink>
          </div>
          <DivisionsBento />
        </div>
      </Section>

      {/* AI — dark */}
      <Section tone="dark" className="overflow-hidden">
        <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
        <div className="container-x relative grid items-center gap-16 lg:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow="AI solutions"
              title={
                <>
                  AI that works <span className="text-accent-soft">inside</span> your walls.
                </>
              }
              lead="From private knowledge assistants to autonomous agents, we deploy models that speak your domain, respect your permissions, and keep your data where it belongs."
            />
            <ul className="mt-10 grid gap-5 sm:grid-cols-2" data-reveal>
              {[
                [ServerCog, "On-prem & sovereign", "Runs in your data center or national cloud."],
                [Languages, "Arabic · French · English", "Multilingual by default, dialect-aware."],
                [Fingerprint, "Permission-aware", "Answers respect who is asking."],
                [Zap, "Weeks, not years", "A working pilot in a 2–4 week AI Sprint."],
              ].map(([Icon, t, d]) => {
                const I = Icon as typeof Zap;
                return (
                  <li key={t as string} className="flex gap-4">
                    <I className="mt-0.5 size-5 shrink-0 text-accent-soft" strokeWidth={1.5} />
                    <div>
                      <p className="font-medium">{t as string}</p>
                      <p className="mt-1 text-sm text-muted">{d as string}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3" data-reveal>
              <ButtonLink href="/ai" arrow>
                Explore AI solutions
              </ButtonLink>
              <ChatButton label="Try our concierge" />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2" data-reveal>
            {aiSolutions.slice(0, 7).map((s, i) => (
              <div key={s.name} className={`card-glow p-5 ${i === 0 ? "sm:col-span-2" : ""}`}>
                <Sparkles className="size-4 text-accent-soft" strokeWidth={1.5} />
                <p className="mt-4 font-medium">{s.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CUSTOM — light */}
      <Section tone="light">
        <div className="container-x">
          <SectionHeader
            eyebrow="Custom solutions for companies"
            title="Your problem. Engineered end to end."
            lead="We take whole-problem ownership — from strategy and design to build, launch and lifelong operation. Fixed scope, fixed outcome, weekly demos."
          />
          <ProcessSteps />
          <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-3xl bg-card p-8 md:flex-row md:items-center" data-reveal>
            <div>
              <p className="text-xl font-medium">Scope your project in 60 seconds.</p>
              <p className="mt-1 text-muted">Answer four questions and get an instant recommended plan, team and timeline.</p>
            </div>
            <ButtonLink href="/enterprise#brief" arrow>
              Build my plan
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* WHY — dark */}
      <Section tone="dark">
        <div className="container-x">
          <SectionHeader align="center" eyebrow="Why ORIZON" title="Six reasons we win." lead="Defensible advantages, not wishful ones — each compounds the others." />
          <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {edges.map((e, i) => (
              <div key={e.name} data-reveal style={{ ["--delay" as string]: `${(i % 3) * 70}ms` }} className="card-glow p-7">
                <p className="text-xs tabular-nums text-faint">EDGE {String(i + 1).padStart(2, "0")}</p>
                <p className="mt-8 text-xl font-medium">{e.name}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{e.text}</p>
              </div>
            ))}
          </div>
          <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-4" data-reveal>
            {[
              [Layers, "7", "Integrated divisions"],
              [Globe2, "24/7", "Follow-the-sun delivery"],
              [Languages, "3", "Working languages"],
              [ShieldCheck, "100%", "Fixed-outcome pricing"],
            ].map(([Icon, v, l]) => {
              const I = Icon as typeof Layers;
              return (
                <div key={l as string} className="bg-bg p-7">
                  <I className="size-4 text-muted" strokeWidth={1.5} />
                  <dd className="display mt-6 text-5xl">{v as string}</dd>
                  <dt className="mt-2 text-sm text-muted">{l as string}</dt>
                </div>
              );
            })}
          </dl>
        </div>
      </Section>

      {/* INDUSTRIES — light */}
      <Section tone="light">
        <div className="container-x">
          <SectionHeader eyebrow="Industries" title="The same standard, every sector." lead="Our capabilities recombine into tailored solutions where the stakes are high and the systems are complex." />
          <IndustriesGrid />
        </div>
      </Section>

      {/* ENGAGEMENT — light card section on gray */}
      <Section tone="light" className="!bg-[#f5f5f6] [&_.card-glow]:!bg-white">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeader eyebrow="How to work with us" title="Clear offers. Outcomes, not hours." />
            <div className="flex flex-wrap gap-2">
              <Pill>Value-based</Pill>
              <Pill>Fixed scope</Pill>
              <Pill>SLA-backed</Pill>
            </div>
          </div>
          <OffersGrid />
          <p className="mt-8 text-sm text-muted">
            Not sure where to start? <Link href="/contact#book" className="font-medium text-fg underline underline-offset-4">Book a 30-minute call</Link> or write to{" "}
            <a href={`mailto:${site.email}`} className="font-medium text-fg underline underline-offset-4">{site.email}</a>.
          </p>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
