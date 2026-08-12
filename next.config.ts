import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { legacyRedirects } from "./src/config/redirects";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGitHubPages
  ? (process.env.NEXT_PUBLIC_BASE_PATH ?? "/photographer_fes")
  : "";

if (isGitHubPages && !process.env.NEXT_PUBLIC_BASE_PATH) {
  process.env.NEXT_PUBLIC_BASE_PATH = basePath;
}

const nextConfig: NextConfig = {
  output: isGitHubPages ? "export" : undefined,
  basePath,
  assetPrefix: basePath,
  trailingSlash: isGitHubPages,
  images: {
    loader: isGitHubPages ? "custom" : "default",
    loaderFile: isGitHubPages ? "./src/lib/image-loader.ts" : undefined,
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
  ...(isGitHubPages
    ? {}
    : {
        redirects() {
          return legacyRedirects;
        },
      }),
};

export default withNextIntl(nextConfig);
