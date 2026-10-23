import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { roles, values } from "@/lib/content";
import { ButtonLink, PageHero, Section, SectionHeader } from "@/components/ui";
import { ApplicationForm } from "@/components/forms/application-form";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join ORIZON — build AI and software that matters, with a small team held to an uncompromising standard.",
};

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Build the systems that move the world."
        lead="Small teams, clear owners, short cycles. We hire people who compound — and give them the hardest, most meaningful problems we can find."
      >
        <ButtonLink href="#roles" arrow>
          See open roles
        </ButtonLink>
      </PageHero>

      <Section tone="light" id="roles">
        <div className="container-x">
          <SectionHeader eyebrow="Open roles" title="Where you could fit." />
          <ul className="mt-14 divide-y divide-line border-y border-line">
            {roles.map((r) => (
              <li key={r.title} data-reveal>
                <a href="#apply" className="group grid gap-2 py-7 sm:grid-cols-[1.4fr_1fr_1fr_24px] sm:items-center">
                  <span className="text-lg font-medium">{r.title}</span>
                  <span className="text-sm text-muted">{r.team}</span>
                  <span className="text-sm text-muted">{r.type}</span>
                  <ArrowUpRight className="hidden size-5 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg sm:block" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="dark">
        <div className="container-x grid gap-16 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <SectionHeader eyebrow="Apply" title="Show us what you've built." lead="No cover-letter theatre. A link to your work and a few honest lines go a long way." />
            <ul className="mt-10 space-y-4 text-sm text-muted" data-reveal>
              {values.map((v) => (
                <li key={v.name} className="flex gap-3">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                  <span>
                    <span className="text-fg">{v.name}.</span> {v.line}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-glow p-6 md:p-10" data-reveal>
            <ApplicationForm />
          </div>
        </div>
      </Section>
    </>
  );
}
