import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/config/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const prefix = siteConfig.basePath;
  return {
    rules: {
      userAgent: "*",
      allow: `${prefix}/`,
      disallow: [`${prefix}/api/`, `${prefix}/studio/`],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
