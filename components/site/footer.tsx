import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { divisions, site } from "@/lib/content";
import { Newsletter } from "@/components/forms/newsletter";

const company = [
  { label: "About", href: "/about" },
  { label: "AI solutions", href: "/ai" },
  { label: "Enterprise", href: "/enterprise" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="tone-dark relative overflow-hidden border-t border-line">
      <div className="container-x relative grid gap-14 py-20 lg:grid-cols-[1.2fr_2fr]">
        <div className="space-y-8">
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

      <div className="relative select-none overflow-hidden" aria-hidden>
        <p className="text-center text-[13vw] font-extralight leading-[0.85] tracking-[0.28em] text-white/[0.06]" style={{ marginRight: "-0.28em" }}>ORIZON</p>
        <div className="horizon-line absolute inset-x-0 bottom-0 opacity-60" />
      </div>

      <div className="container-x flex flex-col items-start justify-between gap-3 border-t border-line py-6 text-xs text-faint sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} ORIZON. All rights reserved.</p>
        <p className="tracking-[0.25em] uppercase">{site.tagline}</p>
      </div>
    </footer>
  );
}
