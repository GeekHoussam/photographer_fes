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
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      className={`${display.variable} ${sans.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
