"use client";

import { useEffect } from "react";

export function SmoothScroll() {
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    let cancelled = false;
    let destroy: (() => void) | undefined;

    void Promise.all([
      import("lenis"),
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]).then(([{ default: Lenis }, gsapModule, triggerModule]) => {
      if (cancelled) return;
      const gsap = gsapModule.gsap;
      gsap.registerPlugin(triggerModule.ScrollTrigger);
      const lenis = new Lenis({
        duration: 0.9,
        smoothWheel: true,
        touchMultiplier: 1,
        wheelMultiplier: 0.85,
        autoRaf: false,
      });
      lenis.on("scroll", triggerModule.ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      destroy = () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
      };
    });

    return () => {
      cancelled = true;
      destroy?.();
    };
  }, []);

  return null;
}
