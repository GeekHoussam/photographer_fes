import localFont from "next/font/local";

const display = localFont({
  src: "../../node_modules/@fontsource-variable/cormorant-garamond/files/cormorant-garamond-latin-wght-normal.woff2",
  weight: "300 700",
  variable: "--font-cormorant",
  display: "swap",
});

const sans = localFont({
  src: "../../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  weight: "200 800",
  variable: "--font-manrope",
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
      className={`${display.variable} ${sans.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#101112" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
