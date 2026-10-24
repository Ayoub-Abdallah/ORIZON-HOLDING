"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { nav } from "@/lib/content";
import { cn } from "@/lib/utils";
import { Wordmark } from "@/components/ui";
import { openCommand } from "./reveal";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);


  return (
    <header className="tone-dark !bg-transparent fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-5 md:pt-4">
      <nav
        aria-label="Main"
        className={cn(
          "mx-auto flex h-14 max-w-6xl items-center justify-between rounded-2xl border px-4 transition-all duration-300 md:px-5",
          scrolled || open
            ? "border-white/10 bg-black/70 shadow-[0_8px_40px_-12px_rgb(0_0_0/0.6)] backdrop-blur-xl"
            : "border-transparent bg-transparent",
        )}
      >
        <Link href="/" aria-label="ORIZON home" className="text-white">
          <Wordmark />
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-[13px] transition-colors",
                    active ? "text-white" : "text-white/60 hover:text-white",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openCommand}
            className="hidden h-9 items-center gap-2 rounded-full border border-white/10 px-3 text-xs text-white/60 transition-colors hover:text-white lg:inline-flex"
            aria-label="Search (Ctrl K)"
          >
            <Search className="size-3.5" aria-hidden />
            <kbd className="font-sans">⌘K</kbd>
          </button>
          <Link
            href="/contact"
            className="hidden h-9 items-center rounded-full bg-white px-4 text-[13px] font-medium text-black transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Start a project
          </Link>
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-full text-white md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {open && <div className="fixed inset-0 -z-10 bg-black/80 backdrop-blur-md md:hidden" onClick={() => setOpen(false)} aria-hidden />}
      {open && (
        <div className="mx-auto mt-2 max-w-6xl rounded-2xl border border-white/10 bg-black/90 p-3 backdrop-blur-xl md:hidden">
          <ul className="flex flex-col">
            {[...nav, { label: "Contact", href: "/contact" }].map((item, i) => (
              <li key={item.href} className="fade-up" style={{ ["--delay" as string]: `${i * 40}ms` }}>
                <Link href={item.href} className="block rounded-xl px-4 py-3.5 text-lg font-light text-white/90 hover:bg-white/5">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            className="mt-2 flex h-12 items-center justify-center rounded-xl bg-white text-sm font-medium text-black"
          >
            Start a project
          </Link>
        </div>
      )}
    </header>
  );
}
