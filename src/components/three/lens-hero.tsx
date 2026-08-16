"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const LensCanvas = dynamic(() => import("./lens-canvas"), { ssr: false });

export function LensHero() {
  const root = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [pointer, setPointer] = useState<[number, number]>([0, 0]);
  const [inView, setInView] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1280px)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      const shouldEnable = desktop.matches && !motion.matches;
      setEnabled(shouldEnable);
      if (!shouldEnable) setReady(false);
    };
    update();
    desktop.addEventListener("change", update);
    motion.addEventListener("change", update);
    return () => {
      desktop.removeEventListener("change", update);
      motion.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    const onPointerMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setPointer([
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1,
        ]);
      });
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const element = root.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { rootMargin: "160px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !root.current) return;
    let context: { revert: () => void } | undefined;
    let cancelled = false;
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([gsapModule, triggerModule]) => {
        if (cancelled || !root.current) return;
        const gsap = gsapModule.gsap;
        gsap.registerPlugin(triggerModule.ScrollTrigger);
        const state = { value: 0 };
        const trigger = root.current.parentElement ?? root.current;
        context = gsap.context(() => {
          gsap.to(state, {
            value: 1,
            ease: "none",
            scrollTrigger: {
              trigger,
              start: "top top",
              end: "bottom top",
              scrub: 0.4,
            },
            onUpdate: () => setProgress(state.value),
          });
        }, trigger);
      },
    );
    return () => {
      cancelled = true;
      context?.revert();
    };
  }, [enabled]);

  return (
    <div
      ref={root}
      className="hero-lens-3d hidden xl:block"
      data-ready={ready}
      aria-hidden="true"
    >
      <div className="hero-lens-fallback">
        <span />
      </div>
      {enabled ? (
        <LensCanvas
          progress={progress}
          reducedMotion={false}
          pointer={pointer}
          active={inView}
          onReady={() => setReady(true)}
        />
      ) : null}
    </div>
  );
}
