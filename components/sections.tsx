import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { deliverySteps, divisions, industries, offers } from "@/lib/content";
import { cn } from "@/lib/utils";
import { ButtonLink, DivisionIcon, Section, SectionHeader } from "@/components/ui";
import { ChatButton } from "@/components/site/chat-button";

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
            "card-glow group flex min-h-64 flex-col justify-between p-7 transition-all duration-300 hover:-translate-y-1 hover:bg-card-strong",
            i === 0 ? "md:col-span-4 md:row-span-2 md:min-h-[34rem]" : i < 3 ? "md:col-span-2" : "md:col-span-3",
          )}
        >
          <div className="flex items-start justify-between">
            <span className="flex size-11 items-center justify-center rounded-2xl border border-line bg-bg">
              <DivisionIcon name={d.icon} />
            </span>
            <span className="text-xs tabular-nums text-faint">{d.index}</span>
          </div>

          {i === 0 && (
            <div className="my-10 hidden flex-1 items-center justify-center md:flex" aria-hidden>
              <NeuralMark />
            </div>
          )}

          <div className={cn(i !== 0 && "mt-10")}>
            <h3 className={cn("font-medium tracking-tight", i === 0 ? "text-3xl md:text-4xl font-light" : "text-xl")}>{d.name}</h3>
            <p className={cn("mt-3 text-muted leading-relaxed", i === 0 ? "max-w-md text-base" : "text-sm")}>{i === 0 ? d.summary : d.kicker}</p>
            <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium opacity-70 transition-opacity group-hover:opacity-100">
              Explore <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

function NeuralMark() {
  const nodes = [
    [40, 60], [40, 140], [40, 220],
    [160, 30], [160, 110], [160, 190], [160, 250],
    [280, 80], [280, 170],
    [380, 125],
  ];
  const edges: [number, number][] = [];
  for (const a of [0, 1, 2]) for (const b of [3, 4, 5, 6]) edges.push([a, b]);
  for (const a of [3, 4, 5, 6]) for (const b of [7, 8]) edges.push([a, b]);
  edges.push([7, 9], [8, 9]);
  return (
    <svg viewBox="0 0 420 280" className="w-full max-w-md">
      <defs>
        <radialGradient id="node-glow">
          <stop offset="0" stopColor="#5b8cff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#5b8cff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {edges.map(([a, b], i) => (
        <line key={i} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke="currentColor" strokeOpacity="0.12" />
      ))}
      {nodes.map(([x, y], i) => (
        <g key={i}>
          {i === 9 && <circle cx={x} cy={y} r="34" fill="url(#node-glow)" />}
          <circle cx={x} cy={y} r={i === 9 ? 7 : 4.5} fill={i === 9 ? "#5b8cff" : "currentColor"} fillOpacity={i === 9 ? 1 : 0.55} />
        </g>
      ))}
    </svg>
  );
}

export function ProcessSteps() {
  return (
    <ol className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-5">
      {deliverySteps.map((s, i) => (
        <li key={s.step} data-reveal style={{ ["--delay" as string]: `${i * 80}ms` }} className="relative bg-bg p-7">
          <span className="text-xs tabular-nums text-accent">{s.step}</span>
          <p className="mt-8 text-xl font-medium">{s.name}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function IndustriesGrid() {
  return (
    <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
      {industries.map((ind, i) => (
        <div key={ind.name} data-reveal style={{ ["--delay" as string]: `${(i % 4) * 60}ms` }} className="group bg-bg p-7 transition-colors hover:bg-card">
          <p className="text-xs tabular-nums text-faint">{String(i + 1).padStart(2, "0")}</p>
          <p className="mt-10 text-lg font-medium">{ind.name}</p>
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
          className={cn("card-glow flex flex-col p-7", o.highlight && "ring-1 ring-accent/50")}
        >
          <div className="flex items-center justify-between">
            <p className="text-xl font-medium">{o.name}</p>
            {o.highlight && <span className="rounded-full bg-accent/15 px-2.5 py-1 text-[11px] text-accent">{o.highlight}</span>}
          </div>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{o.what}</p>
          <p className="mt-8 border-t border-line pt-4 text-xs uppercase tracking-[0.16em] text-faint">{o.engagement}</p>
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
    <section className="tone-dark relative overflow-hidden py-32 md:py-44">
      <div className="stars pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="pointer-events-none absolute inset-x-[-20%] bottom-[-62%] aspect-[2/1] horizon-arc" aria-hidden />
      <div className="container-x relative text-center" data-reveal>
        <p className="eyebrow">Engineering beyond the horizon</p>
        <h2 className="display text-gradient mx-auto mt-6 max-w-3xl text-5xl sm:text-6xl md:text-7xl text-balance">{title}</h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted">{lead}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/contact#book" arrow>
            Book a call
          </ButtonLink>
          <ChatButton />
        </div>
      </div>
    </section>
  );
}

export { Section, SectionHeader };
