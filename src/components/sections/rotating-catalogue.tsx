"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import type { Locale } from "@/config/site";
import { Link } from "@/i18n/navigation";

export type CatalogueItem = {
  slug: string;
  title: string;
  category: string;
  src: string;
  width: number;
  height: number;
  alt: string;
};

function circularOffset(index: number, active: number, length: number) {
  const forward = (index - active + length) % length;
  return forward > length / 2 ? forward - length : forward;
}

export function RotatingCatalogue({
  locale,
  items,
}: {
  locale: Locale;
  items: CatalogueItem[];
}) {
  const fr = locale === "fr";
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [hidden, setHidden] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  const copy = fr
    ? {
        region: "Catalogue photographique en rotation",
        hide: "Masquer le catalogue",
        show: "Afficher le catalogue",
        previous: "Image précédente",
        next: "Image suivante",
        open: "Ouvrir l'histoire",
        select: "Afficher",
        automatic: "Rotation automatique",
      }
    : {
        region: "Rotating photography catalogue",
        hide: "Hide catalogue",
        show: "Show catalogue",
        previous: "Previous image",
        next: "Next image",
        open: "Open story",
        select: "View",
        automatic: "Automatic rotation",
      };

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    if (
      hidden ||
      interacting ||
      reducedMotion ||
      !inView ||
      !pageVisible ||
      items.length < 2
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % items.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [hidden, inView, interacting, items.length, pageVisible, reducedMotion]);

  const previous = () =>
    setActive((value) => (value - 1 + items.length) % items.length);
  const next = () => setActive((value) => (value + 1) % items.length);
  const current = items[active] ?? items[0];

  if (!current) return null;

  if (hidden) {
    return (
      <div
        ref={rootRef}
        className="catalogue-shell catalogue-shell-hidden"
        aria-label={copy.region}
      >
        <button
          type="button"
          className="catalogue-reveal"
          onClick={() => setHidden(false)}
        >
          <Eye aria-hidden="true" className="h-4 w-4" />
          <span>{copy.show}</span>
          <span aria-hidden="true" className="catalogue-reveal-line" />
        </button>
      </div>
    );
  }

  return (
    <div
      ref={rootRef}
      className="catalogue-shell"
      role="region"
      aria-label={copy.region}
      onPointerEnter={() => setInteracting(true)}
      onPointerLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setInteracting(false);
        }
      }}
    >
      <div className="catalogue-orbit" aria-hidden="true">
        <span />
        <span />
      </div>

      <div className="catalogue-toolbar">
        <p>
          <span className="text-white/45">{copy.automatic}</span>
        </p>
        <button type="button" onClick={() => setHidden(true)}>
          <EyeOff aria-hidden="true" className="h-3.5 w-3.5" />
          {copy.hide}
        </button>
      </div>

      <div className="catalogue-stage">
        {items.map((item, index) => {
          const offset = circularOffset(index, active, items.length);
          const distance = Math.abs(offset);
          const style = {
            "--card-x": `${offset * 31}%`,
            "--card-y": `${distance * 2.5}%`,
            "--card-z": `${distance * -165}px`,
            "--card-rotate": `${offset * -27}deg`,
            "--card-scale": String(1 - distance * 0.08),
            "--card-opacity": distance > 1 ? "0" : String(1 - distance * 0.34),
            "--card-order": String(20 - distance),
          } as CSSProperties;

          return (
            <button
              key={item.slug}
              type="button"
              className="catalogue-card"
              style={style}
              data-active={index === active}
              aria-current={index === active ? "true" : undefined}
              aria-label={`${copy.select}: ${item.title}`}
              aria-hidden={distance > 1}
              tabIndex={distance > 1 ? -1 : 0}
              onClick={() => setActive(index)}
            >
              <Image
                src={item.src}
                alt={index === active ? item.alt : ""}
                fill
                priority={index === 0}
                sizes="(min-width: 1280px) 34vw, (min-width: 768px) 46vw, 78vw"
                className="catalogue-card-image"
              />
              <span className="catalogue-card-shade" aria-hidden="true" />
              <span className="catalogue-card-caption">
                <span>{item.category}</span>
                <strong>{item.title}</strong>
              </span>
            </button>
          );
        })}
      </div>

      <div className="catalogue-footer">
        <button
          type="button"
          className="catalogue-arrow"
          onClick={previous}
          aria-label={copy.previous}
        >
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
        </button>

        <div className="catalogue-status" aria-live="polite" aria-atomic="true">
          <span className="sr-only">{current.title}</span>
          <div className="catalogue-dots" aria-hidden="true">
            {items.map((item, index) => (
              <i key={item.slug} data-active={index === active} />
            ))}
          </div>
        </div>

        <Link href={`/portfolio/${current.slug}`} className="catalogue-open">
          {copy.open}
          <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
        </Link>

        <button
          type="button"
          className="catalogue-arrow"
          onClick={next}
          aria-label={copy.next}
        >
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
