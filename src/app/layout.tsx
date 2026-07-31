import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Mohammed Laâchach — Photographe & Vidéaste à Fès",
    template: "%s — Mohammed Laâchach",
  },
  description:
    "Portfolio de Mohammed Laâchach, photographe et vidéaste à Fès : mariages, événements, hôtellerie, intérieurs et gastronomie.",
  openGraph: {
    type: "website",
    siteName: "Mohammed Laâchach",
    title: "Mohammed Laâchach — Photographe & Vidéaste à Fès",
    description:
      "Photographie et vidéo de mariage, événement, hôtellerie et gastronomie à Fès et au Maroc.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
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
