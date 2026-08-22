"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import FocusTrap from "focus-trap-react";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { brandTitles } from "@/config/site";
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
  const portfolioT = useTranslations("Portfolio");
  const footer = useTranslations("Footer");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const desktopPortfolioRef = useRef<HTMLDivElement>(null);
  const desktopPortfolioTriggerRef = useRef<HTMLAnchorElement>(null);
  const mobilePortfolioRef = useRef<HTMLDivElement>(null);
  const mobilePortfolioTriggerRef = useRef<HTMLButtonElement>(null);
  const suppressPortfolioFocusRef = useRef(false);
  const brandName = brandTitles[locale === "fr" ? "fr" : "en"];

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
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setPortfolioOpen(false);
      setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape, true);
    return () => {
      window.removeEventListener("keydown", closeOnEscape, true);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setPortfolioOpen(false));
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    if (!portfolioOpen) return;

    const closeOnOutsidePointer = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (
        !desktopPortfolioRef.current?.contains(target) &&
        !mobilePortfolioRef.current?.contains(target)
      ) {
        setPortfolioOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      setPortfolioOpen(false);
      const trigger = open
        ? mobilePortfolioTriggerRef.current
        : desktopPortfolioTriggerRef.current;
      if (trigger && document.activeElement !== trigger) {
        if (!open) suppressPortfolioFocusRef.current = true;
        trigger.focus();
      }
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer, true);
    document.addEventListener("keydown", closeOnEscape, true);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer, true);
      document.removeEventListener("keydown", closeOnEscape, true);
    };
  }, [open, portfolioOpen]);

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
          className="hidden items-center gap-1 border-y border-white/12 bg-black/20 px-2 backdrop-blur-md xl:flex"
          aria-label={
            locale === "fr" ? "Navigation principale" : "Primary navigation"
          }
        >
          {links.map(([key, href]) =>
            key === "portfolio" ? (
              <div
                key={key}
                ref={desktopPortfolioRef}
                className="relative"
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") setPortfolioOpen(true);
                }}
                onPointerLeave={(event) => {
                  if (
                    event.pointerType === "mouse" &&
                    !event.currentTarget.contains(document.activeElement)
                  ) {
                    setPortfolioOpen(false);
                  }
                }}
                onFocusCapture={() => {
                  if (suppressPortfolioFocusRef.current) {
                    suppressPortfolioFocusRef.current = false;
                    return;
                  }
                  setPortfolioOpen(true);
                }}
                onBlurCapture={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setPortfolioOpen(false);
                  }
                }}
              >
                <Link
                  ref={desktopPortfolioTriggerRef}
                  href={href}
                  aria-current={pathname.startsWith(href) ? "page" : undefined}
                  aria-expanded={portfolioOpen}
                  aria-controls="desktop-portfolio-submenu"
                  aria-haspopup="true"
                  onClick={(event) => {
                    if (
                      window.matchMedia("(hover: none)").matches &&
                      !portfolioOpen
                    ) {
                      event.preventDefault();
                      setPortfolioOpen(true);
                    }
                  }}
                  className={`hover:text-paper flex items-center gap-1.5 border-b px-4 py-3 text-[0.63rem] font-bold tracking-[0.14em] uppercase transition-colors ${
                    pathname.startsWith(href)
                      ? "border-sand text-paper"
                      : "border-transparent text-white/68"
                  }`}
                >
                  {t(key)}
                  <ChevronDown
                    aria-hidden="true"
                    className={`h-3 w-3 transition-transform ${portfolioOpen ? "rotate-180" : ""}`}
                  />
                </Link>
                {portfolioOpen ? (
                  <div
                    id="desktop-portfolio-submenu"
                    className="absolute top-full left-0 w-56 pt-3"
                  >
                    <div className="bg-ink/96 border border-white/15 p-4 shadow-2xl backdrop-blur-xl">
                      <p
                        className="eyebrow text-sand border-b border-white/10 pb-3"
                        aria-hidden="true"
                      >
                        Portfolio
                      </p>
                      <div className="mt-3 ml-1 grid border-l border-white/25 pl-4">
                        {(["photos", "videos"] as const).map((media) => (
                          <Link
                            key={media}
                            href={`/portfolio?media=${media}`}
                            onClick={() => setPortfolioOpen(false)}
                            className="hover:text-sand relative min-h-11 border-b border-white/10 py-3 text-xs font-bold tracking-[0.13em] uppercase transition-colors before:absolute before:top-1/2 before:-left-4 before:w-3 before:border-t before:border-white/25 last:border-b-0"
                          >
                            {portfolioT(media)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
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
            ),
          )}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <ThemeToggle />
          <Link
            href="/contact"
            className="bg-paper text-ink hover:bg-sand hidden min-h-11 items-center gap-2 px-5 text-[0.63rem] font-bold tracking-[0.14em] uppercase transition-colors xl:inline-flex"
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
            className="hover:border-sand hover:text-sand inline-flex h-11 w-11 items-center justify-center border border-white/20 transition-colors xl:hidden"
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
            escapeDeactivates: false,
            allowOutsideClick: true,
            clickOutsideDeactivates: false,
            returnFocusOnDeactivate: false,
          }}
        >
          <nav
            id="mobile-navigation"
            className="bg-ink absolute inset-x-0 top-full z-[var(--z-overlay)] flex h-[calc(100svh-var(--header-height))] flex-col overflow-y-auto px-[var(--page-gutter)] pt-10 pb-8 xl:hidden"
            aria-label={
              locale === "fr" ? "Navigation mobile" : "Mobile navigation"
            }
          >
            <p className="eyebrow text-sand mb-8">Menu</p>
            <div className="flex flex-1 flex-col">
              {[...links, ["contact", "/contact"] as const].map(
                ([key, href]) =>
                  key === "portfolio" ? (
                    <div key={key} ref={mobilePortfolioRef}>
                      <button
                        ref={mobilePortfolioTriggerRef}
                        type="button"
                        aria-expanded={portfolioOpen}
                        aria-controls="mobile-portfolio-submenu"
                        onClick={() => setPortfolioOpen((value) => !value)}
                        className="group font-display flex w-full items-center justify-between border-t border-white/10 py-4 text-left text-[clamp(2.8rem,12vw,5rem)] leading-none tracking-[-0.035em]"
                      >
                        <span>{t(key)}</span>
                        <ChevronDown
                          aria-hidden="true"
                          className={`text-sand h-7 w-7 transition-transform ${portfolioOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      {portfolioOpen ? (
                        <div
                          id="mobile-portfolio-submenu"
                          className="mb-4 ml-2 grid border-l border-white/25 pl-6"
                        >
                          {(["photos", "videos"] as const).map((media) => (
                            <Link
                              key={media}
                              href={`/portfolio?media=${media}`}
                              className="hover:text-sand relative border-t border-white/10 py-4 text-sm font-bold tracking-[0.14em] uppercase transition-colors before:absolute before:top-1/2 before:-left-6 before:w-5 before:border-t before:border-white/25"
                              onClick={() => {
                                setPortfolioOpen(false);
                                setOpen(false);
                              }}
                            >
                              {portfolioT(media)}
                            </Link>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <Link
                      key={key}
                      href={href}
                      className="group font-display flex items-center border-t border-white/10 py-4 text-[clamp(2.8rem,12vw,5rem)] leading-none tracking-[-0.035em]"
                      onClick={() => {
                        setOpen(false);
                      }}
                      aria-current={
                        pathname.startsWith(href) ? "page" : undefined
                      }
                    >
                      <span>{t(key)}</span>
                    </Link>
                  ),
              )}
            </div>
            <div className="mt-8 flex items-end justify-between border-t border-white/10 pt-6">
              <div>
                <p className="eyebrow text-sand">
                  {locale === "fr" ? "Fès · Maroc" : "Fez · Morocco"}
                </p>
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
