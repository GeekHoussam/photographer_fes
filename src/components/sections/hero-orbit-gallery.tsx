"use client";

import Image from "next/image";
import { EyeOff, Images } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import type { Locale } from "@/config/site";
import { Link } from "@/i18n/navigation";

type OrbitItem = {
  href: string;
  title: string;
  src: string;
  alt: string;
};

export function HeroOrbitGallery({
  items,
  locale,
}: {
  items: OrbitItem[];
  locale: Locale;
}) {
  const fr = locale === "fr";
  const [open, setOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setDismissed(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div
      className={`hero-orbit-gallery hidden lg:block ${open ? "is-open" : ""} ${dismissed ? "is-dismissed" : ""}`}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") {
          setOpen(false);
          setDismissed(false);
        }
      }}
    >
      <button
        type="button"
        className="hero-orbit-trigger"
        aria-expanded={open}
        aria-label={
          open
            ? fr
              ? "Masquer la galerie"
              : "Hide gallery"
            : fr
              ? "Afficher la galerie"
              : "Show gallery"
        }
        onClick={() => {
          if (open) {
            setOpen(false);
            setDismissed(true);
          } else {
            setOpen(true);
            setDismissed(false);
          }
        }}
      >
        {open ? (
          <EyeOff aria-hidden="true" className="h-4 w-4" />
        ) : (
          <Images aria-hidden="true" className="h-4 w-4" />
        )}
        <span>
          {open ? (fr ? "Masquer" : "Hide") : fr ? "Galerie" : "Gallery"}
        </span>
        <span className="hero-orbit-count">
          {String(items.length).padStart(2, "0")}
        </span>
      </button>

      <div className="hero-orbit-track">
        {items.map((item, index) => (
          <div
            key={item.href}
            className="hero-orbit-item"
            style={
              {
                "--orbit-angle": `${(360 / items.length) * index}deg`,
              } as CSSProperties
            }
          >
            <Link
              href={item.href}
              className="hero-orbit-card group"
              tabIndex={open ? 0 : -1}
              aria-label={item.title}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="112px"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <span className="hero-orbit-label">{item.title}</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
