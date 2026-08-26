"use client";

import { ArrowUpRight, Mail, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { contactDetails } from "@/config/site";
import { Link } from "@/i18n/navigation";

const methodClass =
  "contact-method group hover:border-sand hover:text-sand flex min-h-14 items-center gap-3 border border-white/15 px-3.5 text-sm transition-all";

export function ContactMethods({
  className = "",
  showFullPageLink = false,
}: {
  className?: string;
  showFullPageLink?: boolean;
}) {
  const t = useTranslations("Contact");

  return (
    <div className={`contact-methods grid gap-2 ${className}`}>
      <a
        href={contactDetails.whatsapp.href}
        target="_blank"
        rel="noopener noreferrer"
        className={methodClass}
      >
        <span className="contact-method-icon" aria-hidden="true">
          <MessageCircle className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          <span className="block font-semibold">WhatsApp</span>
          <bdi
            dir="ltr"
            className="mt-1 block text-xs break-words text-white/55"
          >
            {contactDetails.whatsapp.display}
          </bdi>
        </span>
      </a>
      <a href={`mailto:${contactDetails.generalEmail}`} className={methodClass}>
        <span className="contact-method-icon" aria-hidden="true">
          <Mail className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          <span className="block font-semibold">{t("generalEmailLabel")}</span>
          <bdi dir="ltr" className="mt-1 block text-xs break-all text-white/55">
            {contactDetails.generalEmail}
          </bdi>
        </span>
      </a>
      <a href={`mailto:${contactDetails.filmEmail}`} className={methodClass}>
        <span className="contact-method-icon" aria-hidden="true">
          <Mail className="h-4 w-4" />
        </span>
        <span className="min-w-0">
          <span className="block font-semibold">{t("filmEmailLabel")}</span>
          <bdi dir="ltr" className="mt-1 block text-xs break-all text-white/55">
            {contactDetails.filmEmail}
          </bdi>
        </span>
      </a>
      {showFullPageLink ? (
        <Link
          href="/contact"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-method-full-page hover:text-sand mt-1 inline-flex min-h-10 items-center gap-2 text-[0.65rem] font-bold tracking-[0.13em] uppercase transition-colors"
        >
          {t("openFullPage")}
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}
