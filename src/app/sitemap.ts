import type { MetadataRoute } from "next";
import { locales, siteConfig } from "@/config/site";
import { portfolioProjects } from "@/features/portfolio/projects";
import { services } from "@/features/services/services";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/portfolio",
    "/services",
    "/about",
    "/process",
    "/journal",
    "/contact",
    "/privacy",
    "/legal",
  ];
  const routes = [
    ...staticRoutes,
    ...portfolioProjects.map((p) => `/portfolio/${p.slug}`),
    ...services.map((s) => `/services/${s.slug}`),
  ];
  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: `${siteConfig.url}/${locale}${route}`,
      lastModified: new Date(),
      alternates: {
        languages: {
          fr: `${siteConfig.url}/fr${route}`,
          en: `${siteConfig.url}/en${route}`,
        },
      },
    })),
  );
}
