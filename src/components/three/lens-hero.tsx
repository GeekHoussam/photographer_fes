"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { LensInput } from "./lens-animation";

const LensCanvas = dynamic(() => import("./lens-canvas"), { ssr: false });

export function LensHero({ label, hint }: { label: string; hint: string }) {
  const root = useRef<HTMLDivElement>(null);
  const control = useRef<HTMLButtonElement>(null);
  const input = useRef<LensInput>({
    progress: 0,
    pointer: [0, 0],
    direct: false,
    pressed: false,
    focus: 0,
  });
  const gesture = useRef<{ id: number; x: number; y: number } | null>(null);
  const suppressClick = useRef(false);
  const [dragging, setDragging] = useState(false);
  const [dpr, setDpr] = useState(1);
  const [inView, setInView] = useState(true);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  const resetInteraction = () => {
    const pointerId = gesture.current?.id;
    gesture.current = null;
    input.current.pointer = [0, 0];
    input.current.pressed = false;
    input.current.direct = false;
    setDragging(false);
    if (
      pointerId !== undefined &&
      control.current?.hasPointerCapture(pointerId)
    ) {
      control.current.releasePointerCapture(pointerId);
    }
  };

  const pointAtLens = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const clamp = (value: number) => Math.max(-1, Math.min(1, value));
    input.current.pointer = [
      clamp(((event.clientX - bounds.left) / bounds.width) * 2 - 1),
      clamp(1 - ((event.clientY - bounds.top) / bounds.height) * 2),
    ];
    input.current.direct = true;
  };

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    // Keep fine rings crisp on Retina phones without an unbounded GPU buffer.
    const updateResolution = () => {
      const { width, height } = element.getBoundingClientRect();
      setDpr(
        Math.max(
          1,
          Math.min(
            window.devicePixelRatio || 1,
            3,
            1024 / Math.max(width, height, 1),
          ),
        ),
      );
    };
    updateResolution();
    const observer = new ResizeObserver(updateResolution);
    observer.observe(element);
    window.addEventListener("resize", updateResolution);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateResolution);
    };
  }, []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      const shouldEnable = !motion.matches;
      setEnabled(shouldEnable);
      if (!shouldEnable) {
        setReady(false);
        resetInteraction();
      }
    };
    update();
    motion.addEventListener("change", update);
    return () => {
      motion.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const onPointerMove = (event: PointerEvent) => {
      if (
        event.pointerType !== "mouse" ||
        gesture.current ||
        (event.target instanceof Node &&
          control.current?.contains(event.target))
      )
        return;
      input.current.pointer = [
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
      ];
      input.current.direct = false;
    };
    const onVisibility = () => {
      if (document.visibilityState !== "visible") resetInteraction();
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("blur", resetInteraction);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("blur", resetInteraction);
      document.removeEventListener("visibilitychange", onVisibility);
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
            onUpdate: () => {
              input.current.progress = state.value;
            },
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
      className="hero-lens-3d"
      data-ready={ready}
      data-interacting={dragging}
    >
      <div className="hero-lens-fallback" aria-hidden="true">
        <span />
      </div>
      {enabled ? (
        <LensCanvas
          input={input}
          dpr={dpr}
          active={inView}
          onReady={() => setReady(true)}
        />
      ) : null}
      {enabled && ready ? (
        <button
          ref={control}
          type="button"
          className="hero-lens-control"
          aria-label={label}
          onPointerDown={(event) => {
            if (!event.isPrimary || event.button !== 0 || gesture.current)
              return;
            suppressClick.current = false;
            gesture.current = {
              id: event.pointerId,
              x: event.clientX,
              y: event.clientY,
            };
            event.currentTarget.setPointerCapture(event.pointerId);
            pointAtLens(event);
            input.current.pressed = true;
            setDragging(true);
          }}
          onPointerMove={(event) => {
            const current = gesture.current;
            if (current && current.id !== event.pointerId) return;
            if (!current && event.pointerType !== "mouse") return;
            if (
              current &&
              Math.hypot(event.clientX - current.x, event.clientY - current.y) >
                6
            ) {
              suppressClick.current = true;
            }
            pointAtLens(event);
          }}
          onPointerUp={(event) => {
            if (gesture.current?.id === event.pointerId) resetInteraction();
          }}
          onPointerCancel={(event) => {
            if (gesture.current?.id !== event.pointerId) return;
            suppressClick.current = true;
            resetInteraction();
          }}
          onLostPointerCapture={(event) => {
            if (gesture.current?.id !== event.pointerId) return;
            suppressClick.current = true;
            resetInteraction();
          }}
          onPointerLeave={() => {
            if (!gesture.current) resetInteraction();
          }}
          onBlur={resetInteraction}
          onClick={(event) => {
            if (event.detail !== 0 && suppressClick.current) return;
            input.current.focus += 1;
          }}
          onKeyDown={(event) => {
            const directions: Record<string, [number, number]> = {
              ArrowLeft: [-0.25, 0],
              ArrowRight: [0.25, 0],
              ArrowUp: [0, 0.25],
              ArrowDown: [0, -0.25],
            };
            const direction = directions[event.key];
            if (direction) {
              event.preventDefault();
              input.current.pointer = input.current.pointer.map(
                (value, index) =>
                  Math.max(-1, Math.min(1, value + direction[index]!)),
              ) as [number, number];
              input.current.direct = true;
            } else if (event.key === "Escape" || event.key === "Home") {
              event.preventDefault();
              resetInteraction();
            }
          }}
        >
          <span className="hero-lens-hint" aria-hidden="true">
            {hint}
          </span>
        </button>
      ) : null}
    </div>
  );
}
