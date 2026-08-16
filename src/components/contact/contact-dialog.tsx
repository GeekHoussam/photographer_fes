"use client";

import FocusTrap from "focus-trap-react";
import { Aperture, X } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ContactForm } from "@/components/forms/contact-form";
import { ContactMethods } from "@/components/contact/contact-methods";

type ContactDialogContextValue = {
  openContact: (trigger?: HTMLElement | null) => void;
};

const ContactDialogContext = createContext<ContactDialogContextValue | null>(
  null,
);

export function useContactDialog() {
  const context = useContext(ContactDialogContext);
  if (!context) {
    throw new Error(
      "useContactDialog must be used inside ContactDialogProvider",
    );
  }
  return context;
}

export function ContactDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("Contact");
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const backgroundRef = useRef<HTMLDivElement | null>(null);

  const openContact = useCallback((trigger?: HTMLElement | null) => {
    const active = document.activeElement;
    triggerRef.current =
      trigger ??
      (active instanceof HTMLElement && active !== document.body
        ? active
        : null);
    setOpen(true);
  }, []);

  const closeContact = useCallback(() => setOpen(false), []);

  useEffect(() => {
    function interceptContactLinks(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      const targetElement =
        target instanceof Element
          ? target
          : target instanceof Node
            ? target.parentElement
            : null;
      const anchor = targetElement?.closest<HTMLAnchorElement>("a[href]");
      if (
        !anchor ||
        anchor.target === "_blank" ||
        anchor.hasAttribute("download")
      )
        return;

      const url = new URL(anchor.href, window.location.href);
      const normalizedPath = url.pathname.replace(/\/$/, "");
      if (
        url.origin === window.location.origin &&
        (normalizedPath.endsWith("/fr/contact") ||
          normalizedPath.endsWith("/en/contact"))
      ) {
        event.preventDefault();
        const stableTrigger = anchor.closest("#mobile-navigation")
          ? document.querySelector<HTMLElement>(
              '[aria-controls="mobile-navigation"]',
            )
          : anchor;
        if (anchor.closest("#mobile-navigation")) {
          window.requestAnimationFrame(() => openContact(stableTrigger));
        } else {
          openContact(stableTrigger);
        }
      }
    }

    document.addEventListener("click", interceptContactLinks, true);
    return () =>
      document.removeEventListener("click", interceptContactLinks, true);
  }, [openContact]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const background = backgroundRef.current;
    const wasInert = background?.inert ?? false;
    document.body.style.overflow = "hidden";
    const scrollLockFrame = window.requestAnimationFrame(() => {
      document.body.style.overflow = "hidden";
    });
    if (background) background.inert = true;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      closeContact();
    };
    window.addEventListener("keydown", handleEscape, true);
    return () => {
      window.cancelAnimationFrame(scrollLockFrame);
      window.removeEventListener("keydown", handleEscape, true);
      document.body.style.overflow = previousOverflow;
      if (background) background.inert = wasInert;
      const trigger = triggerRef.current;
      if (trigger?.isConnected) trigger.focus();
    };
  }, [closeContact, open]);

  const value = useMemo(() => ({ openContact }), [openContact]);

  const moveSignal = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty("--contact-pointer-x", `${x * 18}px`);
    event.currentTarget.style.setProperty("--contact-pointer-y", `${y * 14}px`);
  }, []);

  const resetSignal = useCallback((event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--contact-pointer-x", "0px");
    event.currentTarget.style.setProperty("--contact-pointer-y", "0px");
  }, []);

  return (
    <ContactDialogContext.Provider value={value}>
      <div ref={backgroundRef}>{children}</div>
      {open ? (
        <FocusTrap
          focusTrapOptions={{
            escapeDeactivates: false,
            clickOutsideDeactivates: false,
            fallbackFocus: "#contact-dialog-panel",
            initialFocus: "#contact-dialog-close",
            returnFocusOnDeactivate: false,
          }}
        >
          <div
            className="contact-dialog-backdrop fixed inset-0 z-[calc(var(--z-overlay)+10)] flex items-end justify-center bg-black/76 p-0 backdrop-blur-xl sm:items-center sm:p-6"
            onPointerDown={(event) => {
              if (event.target === event.currentTarget) closeContact();
            }}
          >
            <section
              id="contact-dialog-panel"
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-dialog-title"
              aria-describedby="contact-dialog-description"
              className="contact-dialog-panel theme-lock-dark bg-ink text-paper relative isolate w-full overflow-hidden border border-white/15 shadow-2xl sm:max-w-[76rem]"
              onPointerDown={(event) => event.stopPropagation()}
              onPointerMove={moveSignal}
              onPointerLeave={resetSignal}
            >
              <div className="contact-dialog-chrome relative z-20 flex items-center justify-between border-b border-white/12 px-5 py-3.5 sm:px-7">
                <div className="flex items-center gap-4">
                  <span
                    className="contact-dialog-status-dot"
                    aria-hidden="true"
                  />
                  <p className="eyebrow text-sand">{t("eyebrow")}</p>
                  <span
                    className="hidden h-px w-16 bg-white/14 sm:block"
                    aria-hidden="true"
                  />
                  <p className="hidden text-[0.58rem] font-bold tracking-[0.16em] text-white/34 uppercase md:block">
                    {t("locationLabel")}
                  </p>
                </div>
                <button
                  id="contact-dialog-close"
                  type="button"
                  onClick={closeContact}
                  aria-label={t("close")}
                  className="contact-dialog-close hover:border-sand hover:text-sand inline-flex h-10 w-10 items-center justify-center border border-white/20 transition-colors"
                >
                  <X aria-hidden="true" className="h-5 w-5" />
                </button>
              </div>

              <div className="contact-dialog-layout relative z-10">
                <div className="contact-dialog-intro relative overflow-hidden p-5 sm:p-8 lg:p-9">
                  <div className="relative z-10">
                    <h2
                      id="contact-dialog-title"
                      className="font-display max-w-[8ch] text-[clamp(3.25rem,5.5vw,5.25rem)] leading-[0.82] tracking-[-0.045em]"
                    >
                      {t("title")}
                    </h2>
                    <p
                      id="contact-dialog-description"
                      className="mt-5 max-w-sm text-[0.92rem] leading-7 text-white/55"
                    >
                      {t("description")}
                    </p>
                  </div>

                  <div className="contact-dialog-signal" aria-hidden="true">
                    <span className="contact-dialog-signal-axis contact-dialog-signal-axis-x" />
                    <span className="contact-dialog-signal-axis contact-dialog-signal-axis-y" />
                    <span className="contact-dialog-signal-ring contact-dialog-signal-ring-outer" />
                    <span className="contact-dialog-signal-ring contact-dialog-signal-ring-inner" />
                    <span className="contact-dialog-signal-orbiter" />
                    <span className="contact-dialog-signal-core">
                      <Aperture className="h-7 w-7" strokeWidth={1.2} />
                    </span>
                  </div>

                  <ContactMethods showFullPageLink className="mt-5" />
                </div>

                <div className="contact-dialog-form-shell border-t border-white/12 p-5 sm:p-8 lg:border-t-0 lg:border-l lg:p-9">
                  <div className="mb-6 flex items-center justify-between gap-5 border-b border-white/10 pb-4">
                    <p className="text-[0.62rem] font-bold tracking-[0.16em] text-white/55 uppercase">
                      {t("projectDetails")}
                    </p>
                    <p className="text-[0.58rem] tracking-[0.12em] text-white/30 uppercase">
                      {t("requiredFields")}
                    </p>
                  </div>
                  <ContactForm idPrefix="contact-dialog" variant="dialog" />
                </div>
              </div>
            </section>
          </div>
        </FocusTrap>
      ) : null}
    </ContactDialogContext.Provider>
  );
}
