"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Adds .is-visible to [data-reveal] elements as they scroll into view.
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          // Also reveal anything already scrolled past (e.g. after an anchor jump).
          if (e.isIntersecting || e.boundingClientRect.top < 0) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}

export const openChat = () => window.dispatchEvent(new CustomEvent("orizon:chat"));
export const openCommand = () => window.dispatchEvent(new CustomEvent("orizon:command"));
