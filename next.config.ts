import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { legacyRedirects } from "./src/config/redirects";
import { createSecurityHeaders } from "./src/config/security-headers";

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
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**",
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
        headers() {
          return [
            {
              source: "/:path*",
              headers: createSecurityHeaders(
                process.env.NODE_ENV === "development",
                process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https://") ===
                  true,
              ),
            },
          ];
        },
        redirects() {
          return legacyRedirects;
        },
      }),
};

export default withNextIntl(nextConfig);
