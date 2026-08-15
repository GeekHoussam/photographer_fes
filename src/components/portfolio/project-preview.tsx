"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Locale } from "@/config/site";
import type { PhotoAsset } from "@/types/content";

const maximumPreviewImages = 4;

export function ProjectPreview({
  images,
  locale,
  aspectClass,
  imageClassName = "",
  openLabel,
  previewLabel,
}: {
  images: PhotoAsset[];
  locale: Locale;
  aspectClass: string;
  imageClassName?: string;
  openLabel: string;
  previewLabel: string;
}) {
  const previewImages = images.slice(0, maximumPreviewImages);
  const frameRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const pendingPointerRef = useRef({ x: 0.5, y: 0.5 });
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(
    () => () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    },
    [],
  );

  function paintPointerPosition() {
    const frame = frameRef.current;
    if (!frame) return;

    const { x, y } = pendingPointerRef.current;
    frame.style.setProperty("--preview-cursor-x", `${x * 100}%`);
    frame.style.setProperty("--preview-cursor-y", `${y * 100}%`);
    frame.style.setProperty("--preview-shift-x", `${(0.5 - x) * 22}px`);
    frame.style.setProperty("--preview-shift-y", `${(0.5 - y) * 14}px`);
    animationFrameRef.current = null;
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.min(
      1,
      Math.max(0, (event.clientX - bounds.left) / bounds.width),
    );
    const y = Math.min(
      1,
      Math.max(0, (event.clientY - bounds.top) / bounds.height),
    );
    const nextIndex = Math.min(
      previewImages.length - 1,
      Math.floor(x * previewImages.length),
    );

    pendingPointerRef.current = { x, y };
    setActiveIndex((currentIndex) =>
      currentIndex === nextIndex ? currentIndex : nextIndex,
    );

    if (animationFrameRef.current === null) {
      animationFrameRef.current = requestAnimationFrame(paintPointerPosition);
    }
  }

  function resetPreview() {
    pendingPointerRef.current = { x: 0.5, y: 0.5 };
    setActiveIndex(0);

    if (animationFrameRef.current === null) {
      animationFrameRef.current = requestAnimationFrame(paintPointerPosition);
    }
  }

  return (
    <div
      ref={frameRef}
      className={`portfolio-project-preview ${aspectClass}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPreview}
      data-portfolio-preview
      data-active-preview={activeIndex}
    >
      {previewImages.map((image, index) => (
        <Image
          key={image.src}
          src={image.src}
          alt={index === 0 ? image.alt[locale] : ""}
          fill
          sizes="(min-width: 1024px) 50vw, (min-width: 768px) 50vw, 100vw"
          className={`portfolio-project-preview-image object-cover ${index === activeIndex ? "is-active" : ""} ${imageClassName}`}
        />
      ))}
      <div className="portfolio-project-preview-shade" aria-hidden="true" />
      {previewImages.length > 1 ? (
        <div
          className="portfolio-project-preview-progress"
          aria-label={previewLabel}
        >
          {previewImages.map((image, index) => (
            <span
              key={image.src}
              className={index === activeIndex ? "is-active" : ""}
              aria-hidden="true"
            />
          ))}
        </div>
      ) : null}
      <span className="portfolio-project-preview-cursor" aria-hidden="true">
        {openLabel}
        <span>↗</span>
      </span>
    </div>
  );
}
