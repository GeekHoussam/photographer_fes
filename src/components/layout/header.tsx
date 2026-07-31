"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import FocusTrap from "focus-trap-react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";

const links = [
  ["portfolio", "/portfolio"],
  ["services", "/services"],
  ["about", "/about"],
  ["process", "/process"],
  ["journal", "/journal"],
] as const;

export function Header() {
  const locale = useLocale();
  const t = useTranslations("Navigation");
  const footer = useTranslations("Footer");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const brandName =
    locale === "fr"
      ? "Photographe Fes - Mohammed Laâchach"
      : "Fez Photographer - Mohammed Laâchach";

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(window.scrollY > 24);
      setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const trigger = triggerRef.current;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open]);

  return (
    <header
      className={`theme-lock-dark text-paper fixed inset-x-0 top-0 z-[var(--z-header)] transition-all duration-500 ${
        scrolled || open
          ? "bg-ink/88 border-b border-white/10 backdrop-blur-xl"
          : "bg-gradient-to-b from-black/55 to-transparent"
      }`}
    >
      <div className="mx-auto flex h-[var(--header-height)] max-w-[var(--content-max)] items-center justify-between px-[var(--page-gutter)]">
        <Link
          href="/"
          className="group font-display flex min-w-0 items-center gap-3 leading-none tracking-[-0.025em]"
          onClick={() => setOpen(false)}
        >
          <span className="group-hover:border-sand relative inline-flex h-10 w-10 shrink-0 overflow-hidden border border-white/20 transition-colors">
            <Image
              src="/images/Transparent square camera mark.png"
              alt=""
              aria-hidden="true"
              width={1254}
              height={1254}
              sizes="40px"
              className="h-full w-full object-contain p-1.5"
            />
          </span>
          <span className="max-w-[7rem] text-[0.78rem] leading-[1.08] min-[430px]:max-w-[11.5rem] min-[430px]:text-[0.9rem] sm:max-w-none sm:text-[clamp(0.95rem,1.2vw,1.35rem)] sm:whitespace-nowrap">
            {brandName}
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 border-y border-white/12 bg-black/20 px-2 backdrop-blur-md lg:flex"
          aria-label="Primary navigation"
        >
          {links.map(([key, href]) => (
            <Link
              key={key}
              href={href}
              aria-current={pathname.startsWith(href) ? "page" : undefined}
              className={`hover:text-paper border-b px-4 py-3 text-[0.63rem] font-bold tracking-[0.14em] uppercase transition-colors ${
                pathname.startsWith(href)
                  ? "border-sand text-paper"
                  : "border-transparent text-white/68"
              }`}
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <ThemeToggle />
          <Link
            href="/contact"
            className="bg-paper text-ink hover:bg-sand hidden min-h-11 items-center gap-2 px-5 text-[0.63rem] font-bold tracking-[0.14em] uppercase transition-colors lg:inline-flex"
          >
            {t("contact")}
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? t("close") : t("menu")}
            className="hover:border-sand hover:text-sand inline-flex h-11 w-11 items-center justify-center border border-white/20 transition-colors lg:hidden"
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 h-px bg-white/8"
        aria-hidden="true"
      >
        <div
          className="bg-sand h-full origin-left transition-transform duration-150"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>

      {open ? (
        <FocusTrap
          focusTrapOptions={{
            escapeDeactivates: true,
            onDeactivate: () => setOpen(false),
            returnFocusOnDeactivate: false,
          }}
        >
          <nav
            id="mobile-navigation"
            className="bg-ink absolute inset-x-0 top-full z-[var(--z-overlay)] flex h-[calc(100svh-var(--header-height))] flex-col overflow-y-auto px-[var(--page-gutter)] pt-10 pb-8 lg:hidden"
            aria-label="Mobile navigation"
          >
            <p className="eyebrow text-sand mb-8">Menu</p>
            <div className="flex flex-1 flex-col">
              {[...links, ["contact", "/contact"] as const].map(
                ([key, href], index) => (
                  <Link
                    key={key}
                    href={href}
                    className="group font-display flex items-center justify-between border-t border-white/10 py-4 text-[clamp(2.8rem,12vw,5rem)] leading-none tracking-[-0.035em]"
                    onClick={() => setOpen(false)}
                    aria-current={
                      pathname.startsWith(href) ? "page" : undefined
                    }
                  >
                    <span>{t(key)}</span>
                    <span
                      aria-hidden="true"
                      className="font-sans text-[0.62rem] font-bold tracking-[0.14em] text-white/35"
                    >
                      0{index + 1}
                    </span>
                  </Link>
                ),
              )}
            </div>
            <div className="mt-8 flex items-end justify-between border-t border-white/10 pt-6">
              <div>
                <p className="eyebrow text-sand">Fès · Morocco</p>
                <p className="mt-3 max-w-xs text-sm text-white/50">
                  {footer("location")}
                </p>
              </div>
              <LanguageSwitcher />
            </div>
          </nav>
        </FocusTrap>
      ) : null}
    </header>
  );
}
