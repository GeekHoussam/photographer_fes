"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import type { Locale } from "@/config/site";
import type { PhotoAsset } from "@/types/content";

export type ScrollTransitionFrame = {
  image: PhotoAsset;
  category: string;
  title: string;
};

export function ScrollTransitionFrames({
  frames,
  locale,
}: {
  frames: ScrollTransitionFrame[];
  locale: Locale;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const copy = {
    fr: {
      region: "Séquence photographique",
      scroll: "Défilement",
      mark: "ML / FÈS",
    },
    en: {
      region: "Photographic sequence",
      scroll: "Scroll",
      mark: "ML / FEZ",
    },
    ar: {
      region: "تسلسل فوتوغرافي",
      scroll: "تمرير",
      mark: "ML / فاس",
    },
  }[locale];

  useEffect(() => {
    const root = rootRef.current;
    if (!root || frames.length < 2) return;

    let cancelled = false;
    let context: { revert: () => void } | undefined;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([gsapModule, triggerModule]) => {
        if (cancelled || !rootRef.current) return;

        const gsap = gsapModule.gsap;
        gsap.registerPlugin(triggerModule.ScrollTrigger);

        context = gsap.context(() => {
          const media = gsap.matchMedia();

          media.add(
            "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
            () => {
              const frameNodes = Array.from(
                root.querySelectorAll<HTMLElement>(".scroll-sequence-frame"),
              );
              const progress = root.querySelector<HTMLElement>(
                ".scroll-sequence-progress-fill",
              );

              root.dataset.enhanced = "true";
              gsap.set(frameNodes.slice(1), {
                clipPath: "inset(100% 0 0 0)",
                yPercent: 5,
              });
              gsap.set(progress, { scaleY: 0 });

              const timeline = gsap.timeline({
                defaults: { ease: "none" },
                scrollTrigger: {
                  trigger: root,
                  start: "top top",
                  end: "bottom bottom",
                  scrub: 0.45,
                  invalidateOnRefresh: true,
                },
              });

              frameNodes.slice(1).forEach((frame, index) => {
                const previous = frameNodes[index];
                const direction = index % 2 === 0 ? -1 : 1;

                timeline
                  .to(
                    previous,
                    {
                      yPercent: direction * -3.5,
                      scale: 1.035,
                      duration: 1,
                    },
                    index,
                  )
                  .fromTo(
                    frame,
                    {
                      clipPath:
                        direction < 0
                          ? "inset(100% 0 0 0)"
                          : "inset(0 0 100% 0)",
                      yPercent: direction * 5,
                      scale: 1.065,
                    },
                    {
                      clipPath: "inset(0% 0 0 0)",
                      yPercent: 0,
                      scale: 1,
                      duration: 1,
                    },
                    index,
                  );
              });

              if (progress) {
                timeline.to(
                  progress,
                  {
                    scaleY: 1,
                    duration: Math.max(frameNodes.length - 1, 1),
                  },
                  0,
                );
              }

              return () => {
                delete root.dataset.enhanced;
              };
            },
          );

          return () => media.revert();
        }, root);
      },
    );

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, [frames.length]);

  if (!frames.length) return null;

  return (
    <div
      ref={rootRef}
      className="scroll-sequence"
      style={
        {
          "--sequence-count": frames.length,
        } as CSSProperties
      }
      aria-label={copy.region}
    >
      <div className="scroll-sequence-stage">
        <div className="scroll-sequence-rail" aria-hidden="true">
          <span>{copy.scroll}</span>
          <i>
            <b className="scroll-sequence-progress-fill" />
          </i>
        </div>

        <ol className="scroll-sequence-list">
          {frames.map((frame, index) => (
            <li
              key={`${frame.image.src}-${index}`}
              className="scroll-sequence-frame"
              data-layout={String((index % 6) + 1)}
            >
              <div className="scroll-sequence-grid" aria-hidden="true" />
              <figure className="scroll-sequence-photo">
                <Image
                  src={frame.image.src}
                  alt={frame.image.alt[locale]}
                  fill
                  sizes="(min-width: 1280px) 76vw, (min-width: 768px) 88vw, 100vw"
                  className="object-cover"
                />
              </figure>

              <div className="scroll-sequence-caption">
                <span>{frame.category}</span>
                <strong>{frame.title}</strong>
              </div>

              <p className="scroll-sequence-mark" aria-hidden="true">
                {copy.mark}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
