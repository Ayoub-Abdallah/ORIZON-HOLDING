import Link from "next/link";
import { Fingerprint, Languages, ServerCog, Zap } from "lucide-react";
import { aiSolutions, edges, site } from "@/lib/content";
import { ButtonLink, Pill, Section, SectionHeader } from "@/components/ui";
import { Hero } from "@/components/home/hero";
import { Trust } from "@/components/home/trust";
import { ChatButton } from "@/components/site/chat-button";
import { CtaBand, DivisionsBento, IndustriesGrid, OffersGrid, ProcessSteps } from "@/components/sections";
import { photo, photos } from "@/lib/images";

const marquee = ["Large language models", "Retrieval & RAG", "Autonomous agents", "Custom platforms", "Web & mobile", "Data engineering", "Cloud & Kubernetes", "Zero-trust security", "Enterprise systems", "Computer vision"];

export default function Home() {
  return (
    <>
      <Hero />

      <div className="tone-dark relative overflow-hidden border-y border-line py-6" aria-label="Capabilities">
        <div className="marquee gap-12 text-sm text-muted">
          {[...marquee, ...marquee].map((m, i) => (
            <span key={i} className="flex items-center gap-12 whitespace-nowrap">
              {m} <span className="size-1 rounded-full bg-faint" />
            </span>
          ))}
        </div>
      </div>

      {/* SERVICES — light slab, image cards */}
      <Section tone="light" id="solutions" className="mt-24">
        <div className="container-x">
          <div className="grid items-end gap-8 lg:grid-cols-12">
            <SectionHeader className="lg:col-span-7" eyebrow="Capabilities" title="One company." sub="Every layer." />
            <div className="lg:col-span-5 lg:pb-4" data-reveal>
              <p className="text-xl leading-relaxed text-muted">
                Most vendors sell a single layer. We own the whole stack — intelligence, software, data, cloud and security — so we solve your entire problem.
              </p>
              <ButtonLink href="/solutions" variant="secondary" arrow className="mt-8">
                All solutions
              </ButtonLink>
            </div>
          </div>
          <DivisionsBento />
        </div>
      </Section>

      {/* AI — dark, original "intelligent workers" layout */}
      <Section tone="dark">
        <div className="container-x">
          <div className="grid items-end gap-8 lg:grid-cols-12">
            <SectionHeader className="lg:col-span-7" eyebrow="AI solutions" title="Intelligent" sub="systems." />
            <p className="text-xl leading-relaxed text-muted lg:col-span-5 lg:pb-4" data-reveal>
              From private knowledge assistants to autonomous agents, we deploy models that speak your domain, respect your permissions and keep your data where it belongs.
            </p>
          </div>

          <div className="mt-16 flex min-h-[32rem] overflow-hidden border border-line bg-black" data-reveal>
            <div className="flex-1 p-8 lg:p-12">
              <span className="font-mono text-sm text-muted">01</span>
              <h3 className="display mt-4 text-4xl lg:text-5xl">Sovereign, private AI.</h3>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
                Fine-tuned models running in your data center or national cloud — answering from your knowledge, with citations and audit trails.
              </p>
              <ul className="mt-10 grid gap-6 sm:grid-cols-2">
                {[
                  [ServerCog, "On-prem & sovereign", "Runs where your data must stay."],
                  [Languages, "Arabic · French · English", "Multilingual, dialect-aware."],
                  [Fingerprint, "Permission-aware", "Answers respect who is asking."],
                  [Zap, "Weeks, not years", "A working pilot in 2–4 weeks."],
                ].map(([Icon, t, d]) => {
                  const I = Icon as typeof Zap;
                  return (
                    <li key={t as string} className="flex gap-4">
                      <I className="mt-0.5 size-5 shrink-0 text-muted" strokeWidth={1.5} />
                      <div>
                        <p className="font-medium">{t as string}</p>
                        <p className="mt-1 text-sm text-muted">{d as string}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink href="/ai" arrow>
                  Explore AI solutions
                </ButtonLink>
                <ChatButton label="Try our concierge" />
              </div>
            </div>
            <div className="relative hidden w-[40%] shrink-0 lg:block" aria-hidden>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo(photos.glowLines, 1200)} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {aiSolutions.slice(0, 8).map((s, i) => (
              <div key={s.name} data-reveal style={{ ["--delay" as string]: `${(i % 4) * 60}ms` }} className="border border-line p-6 transition-colors hover:border-fg/30">
                <p className="font-mono text-xs text-faint">{String(i + 2).padStart(2, "0")}</p>
                <p className="mt-6 text-lg">{s.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* INDUSTRIES — light */}
      <Section tone="light">
        <div className="container-x">
          <SectionHeader eyebrow="Industries" title="Every sector." sub="The same standard." lead="Our capabilities recombine into tailored solutions where the stakes are high and the systems are complex." />
          <IndustriesGrid />
        </div>
      </Section>

      {/* PROCESS / CUSTOM — dark, original "Define. Deploy. Scale." */}
      <Section tone="dark" className="overflow-hidden">
        <div className="container-x">
          <div className="grid items-end gap-4 lg:grid-cols-2 lg:gap-12">
            <div className="lg:pb-24" data-reveal>
              <p className="eyebrow">Custom solutions for companies</p>
              <h2 className="display mt-8 text-6xl md:text-7xl lg:text-[128px] lg:leading-[0.85]">
                <span className="block">Define.</span>
                <span className="block text-fg/30">Build.</span>
                <span className="block text-fg/10">Operate.</span>
              </h2>
              <p className="mt-10 max-w-lg text-lg leading-relaxed text-muted">
                Whole-problem ownership — from strategy and design to build, launch and lifelong operation. Fixed scope, fixed outcome, weekly demos.
              </p>
            </div>
            <div className="relative h-[320px] lg:h-[560px]" aria-hidden>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo(photos.blueBlur, 1200)} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover [mask-image:radial-gradient(ellipse_45%_60%_at_50%_45%,black_45%,transparent_100%)]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent" />
            </div>
          </div>
          <ProcessSteps />
          <div className="mt-4 flex flex-col items-start justify-between gap-6 border border-line p-8 md:flex-row md:items-center" data-reveal>
            <div>
              <p className="text-xl">Scope your project in 60 seconds.</p>
              <p className="mt-1 text-muted">Answer four questions and get an instant recommended plan, team and timeline.</p>
            </div>
            <ButtonLink href="/enterprise#brief" arrow>
              Build my plan
            </ButtonLink>
          </div>
        </div>
      </Section>

      {/* TRUST — light */}
      <Section tone="light">
        <div className="container-x">
          <SectionHeader eyebrow="Security" title="Powerful," sub="never uncontrolled." lead="Security and reliability are engineered in, not added later — the reason we're trusted with critical systems." />
          <Trust />
        </div>
      </Section>

      {/* WHY + OFFERS — dark */}
      <Section tone="dark">
        <div className="container-x">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <SectionHeader eyebrow="How to work with us" title="Outcomes," sub="not hours." lead="Clear offers priced on results. Start small with a sprint, or bring us the whole transformation." />
            <div className="relative h-64 lg:h-96" aria-hidden data-reveal>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo(photos.tealWaves, 1400)} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />
            </div>
          </div>
          <OffersGrid />

          <div className="mt-24 grid gap-px border border-line bg-line md:grid-cols-3">
            {edges.map((e, i) => (
              <div key={e.name} data-reveal style={{ ["--delay" as string]: `${(i % 3) * 70}ms` }} className="bg-bg p-7">
                <p className="font-mono text-xs text-faint">EDGE {String(i + 1).padStart(2, "0")}</p>
                <p className="mt-8 text-xl">{e.name}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{e.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-wrap gap-2">
              <Pill>Value-based</Pill>
              <Pill>Fixed scope</Pill>
              <Pill>SLA-backed</Pill>
            </div>
            <p className="text-sm text-muted">
              Not sure where to start?{" "}
              <Link href="/contact#book" className="text-fg underline underline-offset-4">
                Book a 30-minute call
              </Link>{" "}
              or write to{" "}
              <a href={`mailto:${site.email}`} className="text-fg underline underline-offset-4">
                {site.email}
              </a>
              .
            </p>
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
