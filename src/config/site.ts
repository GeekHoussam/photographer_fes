export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

function normalizeBasePath(value: string | undefined) {
  if (!value || value === "/") return "";
  return `/${value.replace(/^\/+|\/+$/g, "")}`;
}

function normalizeSiteUrl(value: string) {
  return value.replace(/\/+$/, "");
}

const configuredUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
);
const configuredBasePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

export function resolvePublicBaseUrl(url: string, basePath = "") {
  const normalizedUrl = normalizeSiteUrl(url);
  const normalizedBasePath = normalizeBasePath(basePath);
  const urlAlreadyContainsBasePath =
    normalizedBasePath !== "" &&
    new URL(normalizedUrl).pathname.replace(/\/$/, "") === normalizedBasePath;
  return urlAlreadyContainsBasePath
    ? normalizedUrl
    : `${normalizedUrl}${normalizedBasePath}`;
}

const publicBaseUrl = resolvePublicBaseUrl(configuredUrl, configuredBasePath);

export const siteConfig = {
  name: "Mohammed Laâchach",
  location: "Fès, Maroc",
  url: configuredUrl,
  basePath: configuredBasePath,
  publicBaseUrl,
  trailingSlash: process.env.GITHUB_PAGES === "true",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? null,
  phone: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? null,
  social: [] as Array<{ label: string; url: string }>,
} as const;

export function absoluteUrl(path = "") {
  const normalizedPath = path
    ? path.startsWith("/") || path.startsWith("#")
      ? path
      : `/${path}`
    : "";
  return `${siteConfig.publicBaseUrl}${normalizedPath}`;
}

export function localizedUrl(locale: Locale, path = "") {
  const normalizedPath = path ? (path.startsWith("/") ? path : `/${path}`) : "";
  const url = absoluteUrl(`/${locale}${normalizedPath}`);
  return withTrailingSlash(url, siteConfig.trailingSlash);
}

export function withTrailingSlash(url: string, enabled: boolean) {
  return enabled && !url.endsWith("/") ? `${url}/` : url;
}

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
