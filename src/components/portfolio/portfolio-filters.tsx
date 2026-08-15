"use client";

import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/config/site";
import {
  categoryLabel,
  categoryOrder,
  isPortfolioCategory,
} from "@/features/portfolio/categories";
import { portfolioProjects } from "@/features/portfolio/projects";
import { ProjectCard } from "./project-card";

export function PortfolioFilters() {
  const locale = useLocale() as Locale;
  const t = useTranslations("Portfolio");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selected = searchParams.get("category");
  const selectedMedia = searchParams.get("media");
  const mediaType = selectedMedia === "videos" ? "videos" : "photos";
  const active = isPortfolioCategory(selected) ? selected : null;
  const projects = portfolioProjects.filter(
    (project) =>
      project.mediaType === mediaType &&
      (!active || project.category === active),
  );

  function updateFilter(category: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (category) params.set("category", category);
    else params.delete("category");
    router.push(`${pathname}${params.size ? `?${params}` : ""}`, {
      scroll: false,
    });
  }

  function updateMedia(nextMedia: "photos" | "videos") {
    const params = new URLSearchParams(searchParams.toString());
    params.set("media", nextMedia);
    params.delete("category");
    router.push(`${pathname}?${params}`, { scroll: false });
  }

  return (
    <>
      <div className="bg-ink/80 sticky top-[calc(var(--header-height)+1rem)] z-20 grid gap-2 rounded-[1.25rem] border border-white/10 p-2 backdrop-blur-xl sm:flex sm:flex-wrap">
        <div className="flex gap-2" role="group" aria-label={t("mediaLabel")}>
          {(["photos", "videos"] as const).map((media) => (
            <button
              key={media}
              type="button"
              onClick={() => updateMedia(media)}
              aria-pressed={mediaType === media}
              className={`min-h-10 flex-1 rounded-full px-4 text-[0.64rem] font-bold tracking-[0.13em] uppercase transition-colors sm:flex-none ${mediaType === media ? "bg-paper text-ink" : "hover:text-paper text-white/48 hover:bg-white/8"}`}
            >
              {t(media)}
            </button>
          ))}
        </div>
        {mediaType === "photos" ? (
          <div
            className="flex flex-wrap gap-2 border-t border-white/10 pt-2 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-2"
            role="group"
            aria-label={t("categoryLabel")}
          >
            <button
              type="button"
              onClick={() => updateFilter(null)}
              aria-pressed={!active}
              className={`min-h-10 rounded-full px-4 text-[0.64rem] font-bold tracking-[0.13em] uppercase transition-colors ${!active ? "bg-paper text-ink" : "hover:text-paper text-white/48 hover:bg-white/8"}`}
            >
              {t("all")}
            </button>
            {categoryOrder.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => updateFilter(category)}
                aria-pressed={active === category}
                className={`min-h-10 rounded-full px-4 text-[0.64rem] font-bold tracking-[0.13em] uppercase transition-colors ${active === category ? "bg-paper text-ink" : "hover:text-paper text-white/48 hover:bg-white/8"}`}
              >
                {categoryLabel(category, locale)}
              </button>
            ))}
          </div>
        ) : null}
      </div>
      <p className="sr-only" aria-live="polite">
        {t("count", { count: projects.length })}
      </p>
      <div
        key={`${mediaType}-${active ?? "all"}`}
        className="portfolio-filter-results"
      >
        <div className="mt-16 grid grid-cols-12 items-start gap-x-5 gap-y-20 sm:gap-x-8">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              locale={locale}
              openLabel={t("openSeries")}
              previewLabel={t("previewHint", {
                count: Math.min(project.gallery.length, 4),
              })}
              imageCountLabel={t("imageCount", {
                count: project.gallery.length,
              })}
              className={
                [
                  "col-span-12 md:col-span-7",
                  "col-span-10 col-start-3 md:col-span-4 md:col-start-9 md:mt-28",
                  "col-span-12 md:col-span-8 md:col-start-3",
                  "col-span-10 md:col-span-4",
                  "col-span-12 md:col-span-7 md:col-start-6 md:mt-24",
                ][index % 5]
              }
            />
          ))}
        </div>
        {projects.length === 0 ? (
          <div className="portfolio-empty-state mt-16 border-y border-white/12 py-20 text-center">
            <div className="portfolio-empty-pulse" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <p className="font-display mt-7 text-4xl">
              {mediaType === "videos" ? t("videos") : t("photos")}
            </p>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/45">
              {mediaType === "videos" ? t("emptyVideos") : t("emptyPhotos")}
            </p>
          </div>
        ) : null}
      </div>
    </>
  );
}
