import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import {
  ArrowUpRight,
  Brain,
  Cloud,
  Code2,
  Database,
  LayoutTemplate,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Division } from "@/lib/content";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary: "bg-invert text-invert-fg hover:opacity-90",
  secondary: "border border-line bg-card text-fg hover:bg-card-strong",
  ghost: "text-fg hover:bg-card",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 h-11 text-sm font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
  arrow,
  ...rest
}: ComponentProps<typeof Link> & { variant?: Variant; arrow?: boolean }) {
  return (
    <Link href={href} className={cn(base, variants[variant], className)} {...rest}>
      {children}
      {arrow && <ArrowUpRight className="size-4 -mr-1" aria-hidden />}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className,
  ...rest
}: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={cn(base, variants[variant], className)} {...rest} />;
}

export function Section({
  tone,
  id,
  className,
  children,
}: {
  tone: "dark" | "light";
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={cn(tone === "dark" ? "tone-dark" : "tone-light", "relative py-24 md:py-32", className)}>
      {children}
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      data-reveal
      className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}
    >
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="display mt-5 text-4xl sm:text-5xl md:text-6xl text-balance">{title}</h2>
      {lead && <p className="mt-6 text-lg leading-relaxed text-muted text-pretty">{lead}</p>}
    </div>
  );
}

const icons = {
  brain: Brain,
  code: Code2,
  layout: LayoutTemplate,
  database: Database,
  cloud: Cloud,
  shield: ShieldCheck,
  workflow: Workflow,
} as const;

export function DivisionIcon({ name, className }: { name: Division["icon"]; className?: string }) {
  const Icon = icons[name];
  return <Icon className={cn("size-5", className)} strokeWidth={1.5} aria-hidden />;
}

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border border-line px-3 py-1 text-xs text-muted", className)}>
      {children}
    </span>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return <span className={cn("wordmark text-[15px]", className)}>ORIZON</span>;
}

export function PageHero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lead: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="tone-dark relative overflow-hidden pt-40 pb-24 md:pt-48 md:pb-32">
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
      <div className="horizon-glow pointer-events-none absolute inset-x-0 bottom-0 h-[70%]" aria-hidden />
      <div className="horizon-line pointer-events-none absolute inset-x-0 bottom-0" aria-hidden />
      <div className="container-x relative">
        <p className="eyebrow fade-up">{eyebrow}</p>
        <h1 className="display text-gradient mt-6 max-w-4xl text-5xl sm:text-6xl md:text-7xl text-balance fade-up" style={{ ["--delay" as string]: "80ms" }}>
          {title}
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted text-pretty fade-up" style={{ ["--delay" as string]: "160ms" }}>
          {lead}
        </p>
        {children && (
          <div className="mt-10 flex flex-wrap gap-3 fade-up" style={{ ["--delay" as string]: "240ms" }}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
