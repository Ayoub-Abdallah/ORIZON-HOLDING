import type { Metadata } from "next";
import { founder, principles, site, values } from "@/lib/content";
import { ButtonLink, PageHero, Section, SectionHeader } from "@/components/ui";
import { CtaBand } from "@/components/sections";

export const metadata: Metadata = {
  title: "Company",
  description: "ORIZON is a technology group engineering software and intelligence for the organizations that run the world.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={`Est. ${site.founded} · ${site.address.city}`}
        title="We are the engineers of the intelligent future."
        lead="ORIZON designs, builds and operates the software and systems modern organizations run on — and layers intelligence into every one, so they don't just work: they learn, adapt and accelerate."
      />

      {/* Vision & mission */}
      <Section tone="light">
        <div className="container-x grid gap-6 lg:grid-cols-2">
          <div data-reveal className="rounded-3xl bg-card p-8 md:p-12">
            <p className="eyebrow">Our vision</p>
            <p className="display mt-8 text-3xl md:text-4xl text-balance">
              A world where the most important systems run on intelligence you can trust.
            </p>
          </div>
          <div data-reveal style={{ ["--delay" as string]: "100ms" }} className="tone-dark relative overflow-hidden rounded-3xl p-8 md:p-12">
            <div className="horizon-glow pointer-events-none absolute inset-x-0 bottom-0 h-2/3" aria-hidden />
            <div className="relative">
              <p className="eyebrow">Our mission</p>
              <p className="display mt-8 text-3xl md:text-4xl text-balance">
                Engineer software and intelligence that make organizations measurably more capable.
              </p>
              <p className="mt-6 text-muted">Delivered with a standard of craft and trust that becomes the industry&apos;s benchmark.</p>
            </div>
          </div>
        </div>
        <div className="container-x mt-6 grid gap-6 md:grid-cols-3">
          {[
            ["Solve whole problems", "End-to-end ownership — from strategy and design to build, deployment and lifelong operation."],
            ["Embed intelligence", "Every system is made to learn and improve, turning data into compounding advantage."],
            ["Earn absolute trust", "Security, reliability and integrity are preconditions for everything we ship."],
          ].map(([t, d], i) => (
            <div key={t} data-reveal style={{ ["--delay" as string]: `${i * 80}ms` }} className="rounded-3xl border border-line p-8">
              <p className="text-xs tabular-nums text-accent">0{i + 1}</p>
              <p className="mt-6 text-lg font-medium">{t}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Values */}
      <Section tone="dark">
        <div className="container-x">
          <SectionHeader eyebrow="Brand essence & values" title="Five principles. One standard." lead="Values are only real when they decide behaviour under pressure. These are the filters every hire, product and program must pass." />
          <div className="mt-16 divide-y divide-line border-y border-line">
            {values.map((v, i) => (
              <div key={v.name} data-reveal className="grid gap-4 py-8 md:grid-cols-[80px_1fr_1.4fr] md:items-baseline">
                <span className="text-sm tabular-nums text-faint">0{i + 1}</span>
                <p className="display text-3xl md:text-4xl">{v.name}</p>
                <div>
                  <p className="font-medium">{v.line}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{v.depth}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Founder */}
      <Section tone="light">
        <div className="container-x grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div data-reveal>
            <p className="eyebrow">A word from the founder</p>
            <div className="mt-8 flex aspect-square w-full max-w-xs items-end rounded-3xl bg-invert p-6 text-invert-fg">
              <div>
                <p className="wordmark text-xs opacity-60">ORIZON</p>
                <p className="mt-3 text-xl font-medium">{founder.name}</p>
                <p className="mt-1 text-sm opacity-60">{founder.role}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted">{founder.credentials}</p>
          </div>
          <div data-reveal style={{ ["--delay" as string]: "100ms" }}>
            <blockquote className="display text-3xl md:text-5xl text-balance">“{founder.quote}”</blockquote>
            <div className="mt-10 space-y-5 text-lg leading-relaxed text-muted">
              {founder.letter.map((p) => (
                <p key={p.slice(0, 20)}>{p}</p>
              ))}
            </div>
            <p className="mt-8 font-medium">— Ayoub A. Ben Chahla</p>
          </div>
        </div>
      </Section>

      {/* Manifesto */}
      <section className="tone-dark relative overflow-hidden py-28 md:py-40">
        <div className="stars pointer-events-none absolute inset-0 opacity-70" aria-hidden />
        <div className="container-x relative max-w-4xl">
          <p className="eyebrow">The ORIZON manifesto</p>
          <div className="mt-10 space-y-8">
            {[
              "We believe the horizon is not a limit — it is an invitation.",
              "We believe intelligence, well engineered, is the most powerful lever humanity has ever held.",
              "We believe in building over talking, in trust over hype, in impact over noise.",
              "We are ORIZON. We engineer beyond the horizon.",
            ].map((line, i) => (
              <p key={line} data-reveal style={{ ["--delay" as string]: `${i * 90}ms` }} className={`display text-3xl md:text-5xl text-balance ${i === 3 ? "text-gradient" : "text-white/70"}`}>
                {line}
              </p>
            ))}
          </div>
        </div>
      </section>

      <Section tone="light">
        <div className="container-x">
          <SectionHeader eyebrow="Operating principles" title="The rules that decide everything." />
          <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((p, i) => (
              <div key={p.name} data-reveal style={{ ["--delay" as string]: `${(i % 3) * 70}ms` }} className="bg-bg p-8">
                <p className="text-xs tabular-nums text-faint">0{i + 1}</p>
                <p className="mt-8 text-lg font-medium">{p.name}</p>
                <p className="mt-2 text-sm text-muted">{p.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap gap-3">
            <ButtonLink href="/careers" arrow>
              Join the team
            </ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Contact us
            </ButtonLink>
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
