"use client";

import { useLocale } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/config/site";

const languageOptions = [
  { locale: "fr", short: "FR", name: "Français", lang: "fr", dir: "ltr" },
  { locale: "en", short: "EN", name: "English", lang: "en", dir: "ltr" },
  { locale: "ar", short: "AR", name: "العربية", lang: "ar", dir: "rtl" },
] as const satisfies ReadonlyArray<{
  locale: Locale;
  short: string;
  name: string;
  lang: string;
  dir: "ltr" | "rtl";
}>;

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();

  return (
    <Suspense
      fallback={
        <LanguageChoices locale={locale} pathname={pathname} search="" />
      }
    >
      <LanguageChoicesWithSearch locale={locale} pathname={pathname} />
    </Suspense>
  );
}

function LanguageChoicesWithSearch({
  locale,
  pathname,
}: {
  locale: Locale;
  pathname: string;
}) {
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  return (
    <LanguageChoices
      locale={locale}
      pathname={pathname}
      search={query ? `?${query}` : ""}
    />
  );
}

function LanguageChoices({
  locale,
  pathname,
  search,
}: {
  locale: Locale;
  pathname: string;
  search: string;
}) {
  const labels = {
    fr: {
      navigation: "Choisir la langue",
      option: (name: string) => `Afficher cette page en ${name}`,
    },
    en: {
      navigation: "Choose language",
      option: (name: string) => `View this page in ${name}`,
    },
    ar: {
      navigation: "اختيار اللغة",
      option: (name: string) => `عرض هذه الصفحة باللغة ${name}`,
    },
  }[locale];

  return (
    <nav
      aria-label={labels.navigation}
      className="inline-flex min-h-11 items-center border-y border-white/12 bg-black/20 px-1 backdrop-blur-md"
      data-language-switcher
    >
      {languageOptions.map((option) => {
        const active = option.locale === locale;
        return (
          <Link
            key={option.locale}
            href={`${pathname}${search}`}
            locale={option.locale}
            prefetch={false}
            aria-current={active ? "page" : undefined}
            aria-label={labels.option(option.name)}
            lang={option.lang}
            dir={option.dir}
            className={`hover:text-sand inline-flex min-h-9 min-w-9 items-center justify-center border-b px-2 text-[0.6rem] font-bold tracking-[0.12em] uppercase transition-colors ${
              active
                ? "border-sand text-paper"
                : "border-transparent text-white/55"
            }`}
          >
            <span aria-hidden="true">{option.short}</span>
          </Link>
        );
      })}
    </nav>
  );
}
