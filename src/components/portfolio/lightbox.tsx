"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import FocusTrap from "focus-trap-react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { Locale } from "@/config/site";
import type { PhotoAsset } from "@/types/content";

const gridLayouts = [
  "col-span-12 lg:col-span-8",
  "col-span-10 col-start-3 lg:col-span-4 lg:col-start-9 lg:mt-28",
  "col-span-12 lg:col-span-5",
  "col-span-10 lg:col-span-7 lg:col-start-6 lg:mt-20",
  "col-span-11 col-start-2 lg:col-span-6 lg:col-start-2",
  "col-span-12 lg:col-span-5 lg:col-start-8 lg:mt-32",
] as const;

export function Lightbox({
  locale,
  images,
}: {
  locale: Locale;
  images: PhotoAsset[];
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const activeTrigger = useRef<HTMLButtonElement | null>(null);
  const touchStart = useRef(0);
  const fr = locale === "fr";

  const previous = () =>
    setIndex((value) => (value - 1 + images.length) % images.length);
  const next = () => setIndex((value) => (value + 1) % images.length);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const trigger = activeTrigger.current;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open]);

  const current = images[index] ?? images[0];
  if (!current) return null;

  return (
    <>
      <div className="editorial-gallery grid grid-cols-12 items-start gap-x-4 gap-y-16 sm:gap-x-7 sm:gap-y-24">
        {images.map((image, imageIndex) => (
          <button
            key={image.src}
            type="button"
            className={`group media-frame relative border border-white/10 text-left ${gridLayouts[imageIndex % gridLayouts.length]}`}
            style={{ aspectRatio: `${image.width} / ${image.height}` }}
            onClick={(event) => {
              activeTrigger.current = event.currentTarget;
              setIndex(imageIndex);
              setOpen(true);
            }}
            aria-label={`${fr ? "Agrandir" : "Enlarge"}: ${image.alt[locale]}`}
          >
            <Image
              src={image.src}
              alt={image.alt[locale]}
              fill
              sizes="(min-width: 1024px) 62vw, 100vw"
              className="object-cover"
            />
            <span className="gallery-expand" aria-hidden="true">
              <Expand className="h-4 w-4" />
            </span>
          </button>
        ))}
      </div>

      {open ? (
        <FocusTrap
          focusTrapOptions={{
            escapeDeactivates: true,
            onDeactivate: () => setOpen(false),
            clickOutsideDeactivates: false,
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={fr ? "Galerie plein écran" : "Full-screen gallery"}
            className="theme-lock-dark fixed inset-0 z-[var(--z-overlay)] flex flex-col bg-[#070809]/96 p-3 text-white backdrop-blur-xl sm:p-8"
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft") previous();
              if (event.key === "ArrowRight") next();
            }}
            onTouchStart={(event) => {
              touchStart.current = event.touches[0]?.clientX ?? 0;
            }}
            onTouchEnd={(event) => {
              const end = event.changedTouches[0]?.clientX ?? 0;
              const delta = end - touchStart.current;
              if (Math.abs(delta) > 50) {
                if (delta > 0) previous();
                else next();
              }
            }}
          >
            <div className="flex items-center justify-end border-b border-white/12 pb-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={fr ? "Fermer" : "Close"}
                className="hover:border-sand hover:text-sand focus-visible:ring-sand inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 transition-colors focus-visible:ring-2"
              >
                <X aria-hidden="true" />
              </button>
            </div>
            <div className="flex min-h-0 flex-1 items-center gap-2 sm:gap-6">
              <button
                type="button"
                onClick={previous}
                aria-label={fr ? "Image précédente" : "Previous image"}
                className="hover:border-sand hover:text-sand focus-visible:ring-sand inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 transition-colors focus-visible:ring-2"
              >
                <ChevronLeft aria-hidden="true" />
              </button>
              <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
                <div
                  className="relative h-full max-h-[76vh] w-full max-w-6xl"
                  style={{
                    aspectRatio: `${current.width} / ${current.height}`,
                  }}
                >
                  <Image
                    key={current.src}
                    src={current.src}
                    alt={current.alt[locale]}
                    fill
                    sizes="100vw"
                    className="object-contain"
                  />
                </div>
                <p className="mt-4 max-w-2xl text-center text-xs leading-5 text-white/55">
                  {current.alt[locale]}
                </p>
              </div>
              <button
                type="button"
                onClick={next}
                aria-label={fr ? "Image suivante" : "Next image"}
                className="hover:border-sand hover:text-sand focus-visible:ring-sand inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 transition-colors focus-visible:ring-2"
              >
                <ChevronRight aria-hidden="true" />
              </button>
            </div>
          </div>
        </FocusTrap>
      ) : null}
    </>
  );
}
