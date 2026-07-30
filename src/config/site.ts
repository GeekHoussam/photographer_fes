export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

export const siteConfig = {
  name: "Mohammed Laâchach",
  location: "Fès, Maroc",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  email: null,
  phone: null,
  social: [] as Array<{ label: string; url: string }>,
} as const;

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
