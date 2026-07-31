"use client";

import FocusTrap from "focus-trap-react";
import { Mail, MessageCircle, X } from "lucide-react";
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
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  const whatsappDigits = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(
    /\D/g,
    "",
  );
  const emailAvailable = Boolean(
    contactEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail),
  );
  const whatsappAvailable = Boolean(
    whatsappDigits && whatsappDigits.length >= 8,
  );

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
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>("a[href]");
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
        const mobileMenuTrigger = anchor.closest("#mobile-navigation")
          ? document.querySelector<HTMLElement>(
              '[aria-controls="mobile-navigation"]',
            )
          : null;
        openContact(mobileMenuTrigger ?? anchor);
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
    if (background) background.inert = true;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      closeContact();
    };
    window.addEventListener("keydown", handleEscape, true);
    return () => {
      window.removeEventListener("keydown", handleEscape, true);
      document.body.style.overflow = previousOverflow;
      if (background) background.inert = wasInert;
      const trigger = triggerRef.current;
      if (trigger?.isConnected) trigger.focus();
    };
  }, [closeContact, open]);

  const value = useMemo(() => ({ openContact }), [openContact]);

  return (
    <ContactDialogContext.Provider value={value}>
      <div ref={backgroundRef}>{children}</div>
      {open ? (
        <FocusTrap
          focusTrapOptions={{
            escapeDeactivates: true,
            clickOutsideDeactivates: false,
            onDeactivate: closeContact,
            returnFocusOnDeactivate: false,
          }}
        >
          <div
            className="fixed inset-0 z-[calc(var(--z-overlay)+10)] flex items-end justify-center bg-black/70 p-0 backdrop-blur-md sm:items-center sm:p-6"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) closeContact();
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="contact-dialog-title"
              aria-describedby="contact-dialog-description"
              className="bg-ink text-paper max-h-[94svh] w-full overflow-y-auto border border-white/15 shadow-2xl sm:max-w-5xl"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <div className="bg-ink/88 sticky top-0 z-10 flex items-center justify-between border-b border-white/12 px-5 py-4 backdrop-blur-xl sm:px-8">
                <p className="eyebrow text-sand">{t("eyebrow")}</p>
                <button
                  type="button"
                  onClick={closeContact}
                  aria-label={t("close")}
                  className="hover:border-sand hover:text-sand inline-flex h-11 w-11 items-center justify-center border border-white/20 transition-colors"
                >
                  <X aria-hidden="true" className="h-5 w-5" />
                </button>
              </div>

              <div className="grid gap-10 p-5 sm:p-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12 lg:p-12">
                <div>
                  <h2
                    id="contact-dialog-title"
                    className="font-display text-[clamp(3.25rem,6vw,5.5rem)] leading-[0.88] tracking-[-0.04em]"
                  >
                    {t("title")}
                  </h2>
                  <p
                    id="contact-dialog-description"
                    className="mt-6 max-w-md text-base leading-8 text-white/55"
                  >
                    {t("description")}
                  </p>

                  <div className="mt-9 grid gap-3">
                    {whatsappAvailable ? (
                      <a
                        href={`https://wa.me/${whatsappDigits}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:border-sand hover:text-sand flex min-h-14 items-center gap-4 border border-white/15 px-4 text-sm font-semibold transition-colors"
                      >
                        <MessageCircle aria-hidden="true" className="h-5 w-5" />
                        <span>
                          <span className="block">WhatsApp</span>
                          <span className="mt-0.5 block text-xs font-normal text-white/45">
                            {t("whatsappHint")}
                          </span>
                        </span>
                      </a>
                    ) : (
                      <div
                        className="flex min-h-14 items-center gap-4 border border-white/10 px-4 text-sm text-white/45"
                        aria-disabled="true"
                      >
                        <MessageCircle aria-hidden="true" className="h-5 w-5" />
                        <span>
                          <span className="block font-semibold">WhatsApp</span>
                          <span className="mt-0.5 block text-xs">
                            {t("notConfigured")}
                          </span>
                        </span>
                      </div>
                    )}

                    {emailAvailable ? (
                      <a
                        href={`mailto:${contactEmail}`}
                        className="hover:border-sand hover:text-sand flex min-h-14 items-center gap-4 border border-white/15 px-4 text-sm font-semibold transition-colors"
                      >
                        <Mail aria-hidden="true" className="h-5 w-5" />
                        <span>
                          <span className="block">Email</span>
                          <span className="mt-0.5 block text-xs font-normal text-white/45">
                            {t("emailHint")}
                          </span>
                        </span>
                      </a>
                    ) : (
                      <div
                        className="flex min-h-14 items-center gap-4 border border-white/10 px-4 text-sm text-white/45"
                        aria-disabled="true"
                      >
                        <Mail aria-hidden="true" className="h-5 w-5" />
                        <span>
                          <span className="block font-semibold">Email</span>
                          <span className="mt-0.5 block text-xs">
                            {t("notConfigured")}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-white/12 pt-9 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12">
                  <ContactForm idPrefix="contact-dialog" />
                </div>
              </div>
            </section>
          </div>
        </FocusTrap>
      ) : null}
    </ContactDialogContext.Provider>
  );
}
