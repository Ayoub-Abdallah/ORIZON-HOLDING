import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { divisions } from "@/lib/content";
import { ButtonLink, DivisionIcon, PageHero, Pill, Section, SectionHeader } from "@/components/ui";
import { CtaBand, ProcessSteps } from "@/components/sections";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return divisions.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const d = divisions.find((x) => x.slug === slug);
  return d ? { title: d.name, description: d.summary } : {};
}

export default async function DivisionPage({ params }: Props) {
  const { slug } = await params;
  const index = divisions.findIndex((x) => x.slug === slug);
  if (index === -1) notFound();
  const d = divisions[index];
  const next = divisions[(index + 1) % divisions.length];

  return (
    <>
      <PageHero eyebrow={`Division ${d.index} · ${d.kicker}`} title={d.name} lead={d.summary}>
        <ButtonLink href={`/contact?topic=${encodeURIComponent(d.slug === "intelligence" ? "AI solution" : "Custom software")}`} arrow>
          Talk to this team
        </ButtonLink>
        <ButtonLink href="/enterprise#brief" variant="secondary">
          Scope a project
        </ButtonLink>
      </PageHero>

      <Section tone="light">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <div data-reveal className="card-glow p-8 md:p-10">
            <span className="flex size-11 items-center justify-center rounded-2xl border border-line bg-bg">
              <DivisionIcon name={d.icon} />
            </span>
            <p className="eyebrow mt-10">What we deliver</p>
            <ul className="mt-6 space-y-4">
              {d.deliver.map((x) => (
                <li key={x} className="flex gap-3 text-lg">
                  <Check className="mt-1 size-5 shrink-0 text-accent" /> {x}
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal style={{ ["--delay" as string]: "100ms" }} className="tone-dark relative overflow-hidden rounded-3xl p-8 md:p-10">
            <div className="horizon-glow pointer-events-none absolute inset-x-0 bottom-0 h-2/3" aria-hidden />
            <div className="relative">
              <p className="eyebrow">The client outcome</p>
              <ul className="mt-6 space-y-6">
                {d.outcomes.map((x, i) => (
                  <li key={x} className="flex gap-5">
                    <span className="text-sm tabular-nums text-faint">0{i + 1}</span>
                    <span className="display text-2xl md:text-3xl">{x}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap gap-2">
                {d.stack.map((s) => (
                  <Pill key={s} className="border-white/15">{s}</Pill>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="light" className="!pt-0">
        <div className="container-x">
          <SectionHeader eyebrow="How we deliver" title="One method, every division." />
          <ProcessSteps />
          <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
            <Link href="/solutions" className="inline-flex items-center gap-2 text-sm text-muted hover:text-fg">
              <ArrowLeft className="size-4" /> All solutions
            </Link>
            <Link href={`/solutions/${next.slug}`} className="group inline-flex items-center gap-3 text-right">
              <span>
                <span className="block text-xs text-faint">Next division</span>
                <span className="text-lg font-medium">{next.name}</span>
              </span>
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
