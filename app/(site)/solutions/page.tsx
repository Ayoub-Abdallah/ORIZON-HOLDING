import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { divisions } from "@/lib/content";
import { ButtonLink, DivisionIcon, PageHero, Section, SectionHeader } from "@/components/ui";
import { CtaBand, IndustriesGrid, OffersGrid } from "@/components/sections";

export const metadata: Metadata = {
  title: "Solutions",
  description: "Seven integrated divisions — AI & LLMs, software engineering, digital products, data, cloud, cybersecurity and enterprise systems.",
};

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        image="/images/globe.webp"
        eyebrow="Solutions"
        title="Seven divisions. One standard."
        lead="A dashboard needs data; data invites intelligence; intelligence demands security. One relationship with ORIZON covers the whole stack."
      >
        <ButtonLink href="/enterprise#brief" arrow>
          Scope a project
        </ButtonLink>
        <ButtonLink href="#divisions" variant="secondary">
          Browse divisions
        </ButtonLink>
      </PageHero>

      {/* Capability architecture */}
      <Section tone="light">
        <div className="container-x grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <SectionHeader
            eyebrow="The capability architecture"
            title="We own the whole stack."
            lead="Each layer opens the door to the next — so every engagement can grow without changing partners."
          />
          <div className="space-y-3" data-reveal>
            {[
              ["Surface", "Digital products & enterprise systems", "Apps · Web · Platforms"],
              ["Core", "Intelligence, data & software engineering", "AI · LLM · Data · Code"],
              ["Foundation", "Cloud, infrastructure & security", "Cloud · Trust"],
            ].map(([layer, name, tags], i) => (
              <div
                key={layer}
                className="flex items-center justify-between gap-6 border border-line p-6"
                style={{ marginInline: `${i * 1.25}rem`, background: `rgb(10 10 10 / ${0.02 + i * 0.03})` }}
              >
                <div>
                  <p className="eyebrow">{layer}</p>
                  <p className="mt-2 font-medium">{name}</p>
                </div>
                <p className="hidden text-right text-xs text-muted sm:block">{tags}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Divisions list */}
      <Section tone="dark" id="divisions">
        <div className="container-x">
          <SectionHeader eyebrow="Divisions" title="Available now." lead="Every division is staffed, productized and ready to start." />
          <div className="mt-16 divide-y divide-line border-y border-line">
            {divisions.map((d) => (
              <Link
                key={d.slug}
                href={`/solutions/${d.slug}`}
                data-reveal
                className="group grid gap-6 py-10 transition-colors md:grid-cols-[140px_1.2fr_1.5fr_40px] md:items-start"
              >
                <span className="relative block aspect-[4/3] w-32 overflow-hidden border border-line bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={d.image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105" />
                  <span className="absolute left-2 top-2 font-mono text-[11px] text-white/80">{d.index}</span>
                </span>
                <div>
                  <div className="flex items-center gap-3">
                    <DivisionIcon name={d.icon} className="text-muted" />
                    <h3 className="text-2xl font-light tracking-tight md:text-3xl">{d.name}</h3>
                  </div>
                  <p className="mt-3 text-sm uppercase tracking-[0.14em] text-faint">{d.kicker}</p>
                </div>
                <ul className="grid gap-2.5 text-sm text-muted sm:grid-cols-2">
                  {d.deliver.map((x) => (
                    <li key={x} className="flex gap-2">
                      <Check className="mt-0.5 size-4 shrink-0 text-muted" /> {x}
                    </li>
                  ))}
                </ul>
                <ArrowUpRight className="hidden size-6 text-muted transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-fg md:block" />
              </Link>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="light">
        <div className="container-x">
          <SectionHeader eyebrow="Engagement models" title="Productized offers. Clear outcomes." lead="Land with a Sprint or a Build, then expand into a platform, a subscription or a full program." />
          <OffersGrid />
        </div>
      </Section>

      <Section tone="dark">
        <div className="container-x">
          <SectionHeader eyebrow="Industries" title="Built for high-stakes sectors." />
          <IndustriesGrid />
        </div>
      </Section>

      <CtaBand title="Find the right starting point." lead="Twenty minutes with an engineer is usually enough to know." />
    </>
  );
}
