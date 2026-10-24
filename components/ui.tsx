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
import { Logo } from "@/components/logo";
import type { Division } from "@/lib/content";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary: "bg-invert text-invert-fg hover:opacity-90",
  secondary: "border border-line text-fg hover:bg-card-strong",
  ghost: "text-fg hover:bg-card",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 h-12 text-sm font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

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

/**
 * Page section. Light sections render as rounded slabs on the dark page,
 * giving the soft dark/light transitions.
 */
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
    <section
      id={id}
      className={cn(
        tone === "dark" ? "tone-dark" : "tone-light slab",
        "relative py-24 lg:py-32",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  sub,
  lead,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  /** Second, muted line of the headline. */
  sub?: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div data-reveal className={cn("max-w-4xl", align === "center" && "mx-auto text-center", className)}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="display mt-6 text-5xl md:text-6xl lg:text-[96px] text-balance">
        {title}
        {sub && (
          <>
            <br />
            <span className="text-muted">{sub}</span>
          </>
        )}
      </h2>
      {lead && <p className={cn("mt-8 max-w-2xl text-lg md:text-xl leading-relaxed text-muted text-pretty", align === "center" && "mx-auto")}>{lead}</p>}
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
    <span className={cn("inline-flex items-center border border-line px-3 py-1 font-mono text-xs text-muted", className)}>
      {children}
    </span>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return <Logo className={cn("h-4 md:h-[18px]", className)} />;
}

export function PageHero({
  eyebrow,
  title,
  sub,
  lead,
  image,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: ReactNode;
  lead: ReactNode;
  /** Optional artwork shown on the right, faded into the background. */
  image?: string;
  children?: ReactNode;
}) {
  return (
    <section className="tone-dark relative overflow-hidden pt-40 pb-24 lg:pt-52 lg:pb-32">
      {image && (
        <div className="pointer-events-none absolute inset-y-0 right-0 w-full opacity-60 lg:w-[55%] lg:opacity-100" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="h-full w-full object-cover object-center" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)] via-[var(--bg)]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-[var(--bg)]/40" />
        </div>
      )}
      <div className="container-x relative">
        <p className="eyebrow fade-up">{eyebrow}</p>
        <h1 className="display fade-up mt-8 max-w-5xl text-5xl sm:text-6xl lg:text-[112px] text-balance" style={{ ["--delay" as string]: "80ms" }}>
          {title}
          {sub && (
            <>
              <br />
              <span className="text-muted">{sub}</span>
            </>
          )}
        </h1>
        <p className="fade-up mt-10 max-w-xl text-lg leading-relaxed text-muted md:text-xl text-pretty" style={{ ["--delay" as string]: "160ms" }}>
          {lead}
        </p>
        {children && (
          <div className="fade-up mt-10 flex flex-wrap gap-3" style={{ ["--delay" as string]: "240ms" }}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}

export function ArrowLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-1.5 text-sm font-medium", className)}>
      {children}
      <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
    </Link>
  );
}
