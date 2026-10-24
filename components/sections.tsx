import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { deliverySteps, divisions, industries, offers } from "@/lib/content";
import { cn } from "@/lib/utils";
import { ButtonLink, DivisionIcon, Section, SectionHeader } from "@/components/ui";
import { ChatButton } from "@/components/site/chat-button";
import { photo, photos } from "@/lib/images";

/** Service cards: each division with its artwork as the card background. */
export function DivisionsBento() {
  return (
    <div className="mt-16 grid gap-4 md:grid-cols-6">
      {divisions.map((d, i) => (
        <Link
          key={d.slug}
          href={`/solutions/${d.slug}`}
          data-reveal
          style={{ ["--delay" as string]: `${(i % 3) * 70}ms` }}
          className={cn(
            "image-card group flex flex-col justify-between p-7 lg:p-9",
            i === 0 ? "min-h-[26rem] md:col-span-4 md:row-span-2 md:min-h-[36rem]" : i < 3 ? "min-h-72 md:col-span-2" : "min-h-80 md:col-span-3",
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={d.image} alt="" loading="lazy" decoding="async" className="opacity-80 group-hover:opacity-100" />
          <div className="flex items-start justify-between">
            <span className="flex size-11 items-center justify-center border border-white/20 bg-black/40 backdrop-blur">
              <DivisionIcon name={d.icon} />
            </span>
            <span className="font-mono text-xs text-white/60">{d.index}</span>
          </div>

          <div>
            <h3 className={cn("display", i === 0 ? "text-4xl md:text-5xl" : "text-2xl md:text-3xl")}>{d.name}</h3>
            <p className={cn("mt-3 leading-relaxed text-white/70", i === 0 ? "max-w-md text-base" : "text-sm")}>{i === 0 ? d.summary : d.kicker}</p>
            <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-white/80 transition-colors group-hover:text-white">
              Explore <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function ProcessSteps() {
  return (
    <ol className="mt-16 grid gap-4 md:grid-cols-5">
      {deliverySteps.map((s, i) => (
        <li key={s.step} data-reveal style={{ ["--delay" as string]: `${i * 80}ms` }} className="relative border border-line p-7">
          <span className="display text-4xl text-faint">{s.step}</span>
          <p className="mt-10 text-2xl">{s.name}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function IndustriesGrid() {
  return (
    <div className="mt-16 grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-4">
      {industries.map((ind, i) => (
        <div
          key={ind.name}
          data-reveal
          style={{ ["--delay" as string]: `${(i % 4) * 60}ms` }}
          className="border-b border-r border-line p-7 transition-colors hover:bg-card-strong"
        >
          <p className="font-mono text-xs text-faint">{String(i + 1).padStart(2, "0")}</p>
          <p className="mt-12 text-xl">{ind.name}</p>
          <p className="mt-2 text-sm text-muted">{ind.focus}</p>
        </div>
      ))}
    </div>
  );
}

export function OffersGrid() {
  return (
    <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {offers.map((o, i) => (
        <div
          key={o.name}
          data-reveal
          style={{ ["--delay" as string]: `${(i % 3) * 70}ms` }}
          className={cn("flex flex-col border p-7 transition-colors", o.highlight ? "border-fg/40 bg-card-strong" : "border-line hover:border-fg/30")}
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-2xl">{o.name}</p>
            {o.highlight && <span className="border border-line px-2.5 py-1 font-mono text-[11px] text-muted">{o.highlight}</span>}
          </div>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{o.what}</p>
          <p className="mt-8 border-t border-line pt-4 font-mono text-xs text-faint">{o.engagement}</p>
        </div>
      ))}
    </div>
  );
}

export function CtaBand({
  title = "Let's build what's next.",
  lead = "Tell us where you want to go. We'll come back with a plan, a team and a fixed outcome.",
}: {
  title?: string;
  lead?: string;
}) {
  return (
    <section className="tone-dark relative py-24 lg:py-32">
      <div className="container-x">
        <div className="image-card relative min-h-[32rem] px-8 py-16 md:px-16 md:py-24" data-reveal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo(photos.blueWallpaper, 1920)} alt="" loading="lazy" decoding="async" className="object-center" />
          <div className="relative max-w-2xl">
            <p className="eyebrow text-white/60">Engineering beyond the horizon</p>
            <h2 className="display mt-6 text-5xl text-white sm:text-6xl md:text-7xl text-balance">{title}</h2>
            <p className="mt-6 max-w-xl text-lg text-white/70">{lead}</p>
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/contact#book" arrow className="bg-white text-black">
                Book a call
              </ButtonLink>
              <ChatButton />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { Section, SectionHeader };
