import type { Metadata } from "next";
import { Building2, FileCheck2, Handshake, KeyRound, LifeBuoy, Users } from "lucide-react";
import { principles } from "@/lib/content";
import { ButtonLink, PageHero, Section, SectionHeader } from "@/components/ui";
import { BriefBuilder } from "@/components/forms/brief-builder";
import { CtaBand, IndustriesGrid, ProcessSteps } from "@/components/sections";
import { photo, photos } from "@/lib/images";

export const metadata: Metadata = {
  title: "Enterprise & custom solutions",
  description: "Custom software and AI systems for companies — fixed scope, fixed outcome, one accountable partner. Scope your project and get an instant plan.",
};

const commitments = [
  [Handshake, "One accountable partner", "Strategy, design, engineering and operations under one contract."],
  [FileCheck2, "Fixed scope, fixed outcome", "Priced on results, not billable hours. No surprise invoices."],
  [KeyRound, "You own everything", "Source code, models, data and documentation are yours."],
  [Users, "Dedicated pod", "A stable team that learns your business and stays with it."],
  [LifeBuoy, "SLA-backed support", "Monitoring, incident response and continuous improvement."],
  [Building2, "Sovereign-friendly", "Deploy on-prem, in national cloud or anywhere you need."],
] as const;

export default function EnterprisePage() {
  return (
    <>
      <PageHero
        image={photo(photos.lightsWall, 1920)}
        eyebrow="Custom solutions for companies"
        title="Built for your business. Owned by you."
        lead="When off-the-shelf software doesn't fit, we engineer the system that does — and stay to make it better."
      >
        <ButtonLink href="#brief" arrow>
          Scope my project
        </ButtonLink>
        <ButtonLink href="/contact#book" variant="secondary">
          Book a call
        </ButtonLink>
      </PageHero>

      <Section tone="light" id="brief">
        <div className="container-x">
          <SectionHeader
            align="center"
            eyebrow="Project planner"
            title="Your plan in four steps."
            lead="Tell us what you're building. You'll get an instant recommendation — engagement, team and timeline — and a full proposal within two business days."
          />
          <div className="mx-auto mt-14 max-w-5xl" data-reveal>
            <BriefBuilder />
          </div>
        </div>
      </Section>

      <Section tone="dark">
        <div className="container-x">
          <SectionHeader eyebrow="Our commitments" title="What every client gets." />
          <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {commitments.map(([Icon, t, d], i) => (
              <div key={t} data-reveal style={{ ["--delay" as string]: `${(i % 3) * 70}ms` }} className="border border-line bg-card p-7">
                <Icon className="size-5 text-muted" strokeWidth={1.5} />
                <p className="mt-8 text-lg font-medium">{t}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="light">
        <div className="container-x">
          <SectionHeader eyebrow="Delivery" title="Short cycles. Working software from week one." />
          <ProcessSteps />
          <div className="mt-16 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3" data-reveal>
            {principles.map((p) => (
              <div key={p.name} className="border-t border-line pt-5">
                <p className="font-medium">{p.name}</p>
                <p className="mt-1 text-sm text-muted">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="dark">
        <div className="container-x">
          <SectionHeader eyebrow="Sectors" title="Where we go deep." />
          <IndustriesGrid />
        </div>
      </Section>

      <CtaBand title="Let's engineer it." />
    </>
  );
}
