import localFont from "next/font/local";
import type { Locale } from "@/config/site";
import { ThemeInitializer } from "@/components/layout/theme-initializer";

const siteFont = localFont({
  src: "../../node_modules/@fontsource-variable/jost/files/jost-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-jost",
  display: "swap",
});

const arabicFont = localFont({
  src: "../../node_modules/@fontsource-variable/noto-sans-arabic/files/noto-sans-arabic-arabic-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-arabic",
  display: "swap",
});

const themeScript = `(() => {
  // Apply the saved or system theme before the first paint.
  try {
    const saved = localStorage.getItem("photographer-theme");
    const theme = saved === "light" || saved === "dark"
      ? saved
      : (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch (_) {
    document.documentElement.dataset.theme = "dark";
  }
})();`;

export function RootDocument({
  lang,
  children,
}: Readonly<{
  lang: Locale;
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={`${siteFont.variable} ${arabicFont.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#101112" />
        <ThemeInitializer script={themeScript} />
      </head>
      <body>{children}</body>
    </html>
  );
}
