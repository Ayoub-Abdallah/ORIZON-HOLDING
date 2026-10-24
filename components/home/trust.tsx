"use client";

import { useState } from "react";
import { Eye, FileLock2, KeyRound, ShieldCheck } from "lucide-react";
import { photo, photos } from "@/lib/images";

const features = [
  {
    icon: ShieldCheck,
    title: "Secure by design",
    text: "Threat modeling, code review and hardening from the first commit — never bolted on.",
    image: photo(photos.security, 1200),
  },
  {
    icon: FileLock2,
    title: "Encrypted end to end",
    text: "Data encrypted in transit and at rest, with keys you control.",
    image: photo(photos.ledPanel, 1200),
  },
  {
    icon: Eye,
    title: "Full audit trails",
    text: "Every action by people and AI agents is logged, attributable and reviewable.",
    image: photo(photos.motherboard, 1200),
  },
  {
    icon: KeyRound,
    title: "Permission-aware AI",
    text: "Assistants only see and answer from what the asking user is allowed to access.",
    image: photo(photos.blueCircuit, 1200),
  },
];

const standards = ["Threat modeling", "Pen-tested releases", "SSO / SAML", "On-prem option", "Data residency"];

export function Trust() {
  const [active, setActive] = useState(0);

  return (
    <div className="mt-16 grid gap-4 lg:grid-cols-12">
      <div className="image-card relative min-h-[26rem] p-8 lg:col-span-7 lg:p-12" data-reveal>
        {features.map((f, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={f.image}
            src={f.image}
            alt=""
            loading="lazy"
            decoding="async"
            className="transition-opacity duration-700"
            style={{ opacity: active === i ? 0.75 : 0 }}
          />
        ))}
        <div className="relative flex h-full flex-col justify-between gap-16">
          <div>
            <p className="font-mono text-sm text-white/60">Trust is the product</p>
            <p className="display mt-8 max-w-xs text-4xl text-white lg:text-5xl">{features[active].title}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {standards.map((s) => (
              <span key={s} className="border border-white/15 bg-black/40 px-3 py-1 font-mono text-xs text-white/70 backdrop-blur">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:col-span-5">
        {features.map((f, i) => (
          <button
            key={f.title}
            type="button"
            data-reveal
            style={{ ["--delay" as string]: `${i * 80}ms` }}
            onClick={() => setActive(i)}
            onMouseEnter={() => setActive(i)}
            aria-pressed={active === i}
            className={`flex items-start gap-4 border p-6 text-left transition-colors ${
              active === i ? "border-fg/40 bg-card-strong" : "border-line hover:border-fg/25"
            }`}
          >
            <span
              className={`flex size-10 shrink-0 items-center justify-center border transition-colors ${
                active === i ? "border-fg bg-invert text-invert-fg" : "border-line"
              }`}
            >
              <f.icon className="size-5" strokeWidth={1.5} />
            </span>
            <span>
              <span className="block font-medium">{f.title}</span>
              <span className="mt-1 block text-sm text-muted">{f.text}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
