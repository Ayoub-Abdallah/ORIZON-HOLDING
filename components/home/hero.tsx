"use client";

import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui";

const words = ["think", "design", "build", "deploy", "scale"];

const stats = [
  { value: "7", label: "integrated divisions" },
  { value: "AR · FR · EN", label: "multilingual by default" },
  { value: "24/7", label: "follow-the-sun delivery" },
];

/** Letters fade in from a blur, one after another. Pure CSS per letter. */
function BlurWord({ word }: { word: string }) {
  return (
    <span key={word} className="inline-block" aria-live="polite">
      {word.split("").map((ch, i) => (
        <span key={i} className="blur-letter inline-block" style={{ animationDelay: `${i * 45}ms` }}>
          {ch}
        </span>
      ))}
      <style>{`
        .blur-letter { animation: blur-in 0.55s cubic-bezier(0.2,0.7,0.2,1) both; }
        @keyframes blur-in { from { opacity: 0; filter: blur(16px); } to { opacity: 1; filter: blur(0); } }
      `}</style>
    </span>
  );
}

export function Hero() {
  const [index, setIndex] = useState(2);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % words.length), 3000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    // Respect reduced-motion and data-saver: keep the poster frame only.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (reduce || saveData) {
      v.removeAttribute("autoplay");
      v.pause();
      return;
    }
    v.play().catch(() => undefined);
  }, []);

  return (
    <section className="tone-dark relative flex min-h-[100svh] flex-col justify-center overflow-hidden">
      <div className="absolute inset-0" aria-hidden>
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/videos/hero-poster.jpg"
          className="h-full w-full object-cover object-center opacity-80"
        >
          <source src="/videos/hero-720.mp4" type="video/mp4" media="(max-width: 767px)" />
          <source src="/videos/hero.webm" type="video/webm" />
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[var(--bg)]" />
      </div>

      <div className="container-x relative z-10 pb-16 pt-32 lg:pt-36">
        <div className="lg:max-w-[62%]">
          <p className="eyebrow fade-up text-white/60">Software, AI and custom solutions — engineered as one.</p>
          <h1
            className="display fade-up mt-8 text-[clamp(2.6rem,7vw,7.5rem)] text-white"
            style={{ ["--delay" as string]: "80ms" }}
          >
            <span className="block">Engineering tomorrow,</span>
            <span className="block">
              together we <BlurWord word={words[index]} />
            </span>
          </h1>
          <p
            className="fade-up mt-10 max-w-xl text-lg leading-relaxed text-white/60 md:text-xl"
            style={{ ["--delay" as string]: "160ms" }}
          >
            ORIZON designs, builds and operates the AI and software modern organizations run on — so they don&apos;t
            just work, they learn.
          </p>
          <div className="fade-up mt-10 flex flex-wrap gap-3" style={{ ["--delay" as string]: "240ms" }}>
            <ButtonLink href="/enterprise#brief" arrow>
              Start a project
            </ButtonLink>
            <ButtonLink href="/solutions" variant="secondary" className="border-white/25 text-white">
              Explore solutions
            </ButtonLink>
          </div>
        </div>
      </div>

      <div className="container-x relative z-10 pb-12">
        <dl className="fade-up flex flex-wrap gap-x-14 gap-y-6" style={{ ["--delay" as string]: "400ms" }}>
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col gap-1.5">
              <dd className="text-3xl text-white lg:text-4xl">{s.value}</dd>
              <dt className="text-xs text-white/50">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
