import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { legacyRedirects } from "./src/config/redirects";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
  poweredByHeader: false,
  reactStrictMode: true,
  turbopack: {
    root: process.cwd(),
  },
  redirects() {
    return legacyRedirects;
  },
};

export default withNextIntl(nextConfig);
