import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { site } from "@/lib/content";
import { PageHero, Section, SectionHeader } from "@/components/ui";
import { ContactForm } from "@/components/forms/contact-form";
import { BookingWidget } from "@/components/forms/booking";
import { ChatButton } from "@/components/site/chat-button";
import { photo, photos } from "@/lib/images";

export const metadata: Metadata = {
  title: "Contact",
  description: `Talk to ORIZON — ${site.email} · ${site.phone} · ${site.address.line1}, ${site.address.city}.`,
};

const channels = [
  { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
  { icon: Phone, label: "Phone", value: site.phone, href: `tel:${site.phoneHref}` },
  { icon: MessageCircle, label: "WhatsApp", value: site.phone, href: site.whatsapp },
  { icon: MapPin, label: "Office", value: `${site.address.line1}, ${site.address.city}`, href: site.address.mapUrl },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        image={photo(photos.earthLights, 1920)}
        eyebrow="Contact"
        title="Let's talk about what you're building."
        lead="Write to us, book a call, or chat right now. An engineer — not a salesperson — will answer."
      >
        <ChatButton label="Chat now" variant="primary" />
      </PageHero>

      <Section tone="light">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <SectionHeader eyebrow="Reach us directly" title="Pick your channel." />
            <ul className="mt-10 space-y-3" data-reveal>
              {channels.map((c) => (
                <li key={c.label}>
                  <a
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="group flex items-center gap-4 border border-line p-5 transition-colors hover:bg-card"
                  >
                    <span className="flex size-11 items-center justify-center bg-invert text-invert-fg">
                      <c.icon className="size-4" strokeWidth={1.75} />
                    </span>
                    <span>
                      <span className="block text-xs text-faint">{c.label}</span>
                      <span className="font-medium">{c.value}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 flex items-center gap-2 text-sm text-muted">
              <Clock className="size-4" /> {site.hours}
            </p>
            <div className="mt-8 overflow-hidden border border-line" data-reveal>
              <iframe
                title="ORIZON office location — Bab Ezzouar, Algiers"
                src="https://www.google.com/maps?q=Bab+Ezzouar,+Algiers&output=embed"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-64 w-full grayscale"
              />
            </div>
          </div>
          <div className="border border-line p-6 md:p-10" data-reveal>
            <p className="text-2xl font-light tracking-tight">Send a message</p>
            <p className="mt-1 mb-8 text-sm text-muted">We reply within one business day.</p>
            <Suspense>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </Section>

      <Section tone="dark" id="book">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeader
            eyebrow="Book a call"
            title="30 minutes with an engineer."
            lead="Pick a slot that works for you. We'll send a meeting link and come prepared with questions, not slides."
          />
          <div className="border border-line bg-card p-6 md:p-10" data-reveal>
            <BookingWidget />
          </div>
        </div>
      </Section>
    </>
  );
}
