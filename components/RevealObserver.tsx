"use client";

import { useEffect } from "react";

/**
 * Adds a light fade-up to elements marked `data-reveal` as they scroll into view.
 * CSS only animates when the user hasn't asked for reduced motion (see globals.css),
 * and nothing is hidden until this runs, so no-JS visitors see everything.
 */
export function RevealObserver() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    // Anything already on screen stays visible — no flash.
    const vh = window.innerHeight;
    for (const el of els) {
      if (el.getBoundingClientRect().top < vh) el.classList.add("is-visible");
    }
    document.documentElement.classList.add("reveal-ready");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    els.forEach((el) => {
      if (!el.classList.contains("is-visible")) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return null;
}
