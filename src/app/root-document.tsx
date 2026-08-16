import localFont from "next/font/local";
import Script from "next/script";

const siteFont = localFont({
  src: "../../node_modules/@fontsource-variable/jost/files/jost-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-jost",
  display: "swap",
});

const themeScript = `(() => {
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
  lang: "fr" | "en";
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={lang}
      className={siteFont.variable}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#101112" />
        <Script
          id="theme-initializer"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
