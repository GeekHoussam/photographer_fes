"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/config/site";

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const nextLocale: Locale = locale === "fr" ? "en" : "fr";

  return (
    <button
      type="button"
      className="hover:text-sand hover:border-sand inline-flex min-h-11 items-center border-b border-transparent px-3 text-[0.63rem] font-bold tracking-[0.16em] text-white/70 uppercase transition-colors"
      onClick={() => router.replace(pathname, { locale: nextLocale })}
      aria-label={
        nextLocale === "fr" ? "Passer au français" : "Switch to English"
      }
    >
      {nextLocale.toUpperCase()}
    </button>
  );
}
