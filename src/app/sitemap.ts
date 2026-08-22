import type { MetadataRoute } from "next";
import { locales, localizedUrl } from "@/config/site";
import { staticPageContent } from "@/features/content/pages";
import { journalArticles } from "@/features/journal/articles";
import { portfolioProjects } from "@/features/portfolio/projects";
import { services } from "@/features/services/services";

export const dynamic = "force-static";

function alternates(path: string) {
  return {
    languages: {
      fr: localizedUrl("fr", path),
      en: localizedUrl("en", path),
      "x-default": localizedUrl("fr", path),
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = Object.values(staticPageContent)
    .filter((page) => page.indexable)
    .map((page) => page.path);
  const routes = [
    ...staticRoutes,
    ...portfolioProjects.map((project) => `/portfolio/${project.slug}`),
    ...services.map((service) => `/services/${service.slug}`),
    ...journalArticles.map((article) => `/journal/${article.slug}`),
  ];

  return locales.flatMap((locale) =>
    routes.map((route) => ({
      url: localizedUrl(locale, route),
      alternates: alternates(route),
    })),
  );
}
