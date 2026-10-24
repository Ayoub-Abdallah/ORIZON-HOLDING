import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { divisions, site } from "@/lib/content";
import { Newsletter } from "@/components/forms/newsletter";
import { Wordmark } from "@/components/ui";

const company = [
  { label: "About", href: "/about" },
  { label: "AI solutions", href: "/ai" },
  { label: "Enterprise", href: "/enterprise" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="tone-dark relative overflow-hidden">
      <div className="relative h-[280px] w-full overflow-hidden md:h-[420px]" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/terrain2.webp" alt="" loading="lazy" decoding="async" className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg)] via-transparent to-[var(--bg)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      </div>
      <div className="container-x relative grid gap-14 pb-20 pt-4 lg:grid-cols-[1.2fr_2fr]">
        <div className="space-y-8">
          <Link href="/" aria-label="ORIZON home" className="inline-block">
            <Wordmark />
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-muted">{site.description}</p>
          <Newsletter />
          <ul className="space-y-3 text-sm text-muted">
            <li>
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-3 hover:text-fg">
                <Mail className="size-4" /> {site.email}
              </a>
            </li>
            <li>
              <a href={`tel:${site.phoneHref}`} className="inline-flex items-center gap-3 hover:text-fg">
                <Phone className="size-4" /> {site.phone}
              </a>
            </li>
            <li>
              <a href={site.address.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 hover:text-fg">
                <MapPin className="size-4" /> {site.address.line1}, {site.address.city}, {site.address.country}
              </a>
            </li>
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div>
            <p className="eyebrow">Solutions</p>
            <ul className="mt-5 space-y-3 text-sm">
              {divisions.map((d) => (
                <li key={d.slug}>
                  <Link href={`/solutions/${d.slug}`} className="text-muted hover:text-fg">
                    {d.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Company</p>
            <ul className="mt-5 space-y-3 text-sm">
              {company.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-muted hover:text-fg">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow">Connect</p>
            <ul className="mt-5 space-y-3 text-sm">
              <li><a href={site.whatsapp} target="_blank" rel="noreferrer" className="text-muted hover:text-fg">WhatsApp</a></li>
              <li><Link href="/contact#book" className="text-muted hover:text-fg">Book a call</Link></li>
              <li><Link href="/enterprise#brief" className="text-muted hover:text-fg">Scope a project</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container-x flex flex-col items-start justify-between gap-3 border-t border-line py-6 text-xs text-faint sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} ORIZON. All rights reserved.</p>
        <p className="tracking-[0.25em] uppercase">{site.tagline}</p>
      </div>
    </footer>
  );
}
