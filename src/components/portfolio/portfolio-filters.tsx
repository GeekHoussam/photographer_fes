"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import type { Locale } from "@/config/site";
import {
  categoryLabel,
  categoryOrder,
  isPortfolioCategory,
} from "@/features/portfolio/categories";
import { portfolioProjects } from "@/features/portfolio/projects";
import {
  filterPortfolioVideos,
  isVideoCategory,
  videoCategoryLabel,
  videoCategoryOrder,
} from "@/features/portfolio/videos";
import { ProjectCard } from "./project-card";
import { VideoCard } from "./video-card";

const projectCardClasses = [
  "col-span-12 md:col-span-7",
  "col-span-10 col-start-3 md:col-span-4 md:col-start-9 md:mt-28",
  "col-span-12 md:col-span-8 md:col-start-3",
  "col-span-10 md:col-span-4",
  "col-span-12 md:col-span-7 md:col-start-6 md:mt-24",
];

export function PortfolioFilters() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterTriggerRef = useRef<HTMLButtonElement>(null);
  const locale = useLocale() as Locale;
  const t = useTranslations("Portfolio");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selected = searchParams.get("category");
  const selectedMedia = searchParams.get("media");
  const mediaType = selectedMedia === "videos" ? "videos" : "photos";
  const activePhotoCategory =
    mediaType === "photos" && isPortfolioCategory(selected) ? selected : null;
  const activeVideoCategory =
    mediaType === "videos" && isVideoCategory(selected) ? selected : null;
  const activeCategory =
    mediaType === "photos" ? activePhotoCategory : activeVideoCategory;
  const projects = portfolioProjects.filter(
    (project) =>
      project.mediaType === "photos" &&
      (!activePhotoCategory || project.category === activePhotoCategory),
  );
  const videos = filterPortfolioVideos(activeVideoCategory);
  const resultCount = mediaType === "photos" ? projects.length : videos.length;
  const activeCategoryLabel = activeCategory
    ? mediaType === "photos"
      ? categoryLabel(activePhotoCategory!, locale)
      : videoCategoryLabel(activeVideoCategory!, locale)
    : t("all");

  useEffect(() => {
    if (!filtersOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setFiltersOpen(false);
      filterTriggerRef.current?.focus();
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [filtersOpen]);

  function updateFilter(category: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (category) params.set("category", category);
    else params.delete("category");
    router.push(`${pathname}${params.size ? `?${params}` : ""}`, {
      scroll: false,
    });
    setFiltersOpen(false);
    filterTriggerRef.current?.focus();
  }

  function updateMedia(nextMedia: "photos" | "videos") {
    const params = new URLSearchParams(searchParams.toString());
    params.set("media", nextMedia);
    params.delete("category");
    router.push(`${pathname}?${params}`, { scroll: false });
  }

  return (
    <>
      <div
        className="bg-ink/80 sticky top-[calc(var(--header-height)+1rem)] z-20 grid gap-2 rounded-[1.25rem] border border-white/10 p-2 backdrop-blur-xl"
        data-portfolio-filters
      >
        <div className="grid min-w-0 gap-2 sm:flex sm:flex-wrap">
          <div
            className="flex min-w-0 gap-2"
            role="group"
            aria-label={t("mediaLabel")}
          >
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
          <button
            ref={filterTriggerRef}
            type="button"
            onClick={() => setFiltersOpen((open) => !open)}
            aria-expanded={filtersOpen}
            aria-controls="portfolio-category-filters"
            aria-label={t(filtersOpen ? "closeFilters" : "openFilters")}
            className="flex min-h-10 min-w-0 items-center justify-center gap-2 rounded-full border border-white/10 px-4 text-[0.64rem] font-bold tracking-[0.13em] uppercase transition-colors hover:border-white/20 hover:bg-white/8 sm:max-w-[28rem]"
            data-portfolio-filter-trigger
          >
            <span className="shrink-0">{t("filters")}</span>
            <span className="text-white/25" aria-hidden="true">
              ·
            </span>
            <span className="min-w-0 truncate text-white/48">
              {activeCategoryLabel}
            </span>
            <ChevronDown
              className={`h-3.5 w-3.5 shrink-0 transition-transform motion-reduce:transition-none ${filtersOpen ? "rotate-180" : ""}`}
              aria-hidden="true"
            />
          </button>
        </div>
        <div
          id="portfolio-category-filters"
          className="flex flex-wrap gap-2 border-t border-white/10 pt-2"
          role="group"
          aria-label={
            mediaType === "photos"
              ? t("categoryLabel")
              : t("videoCategoryLabel")
          }
          hidden={!filtersOpen}
          data-portfolio-filter-panel
        >
          <button
            type="button"
            onClick={() => updateFilter(null)}
            aria-pressed={!activeCategory}
            className={`min-h-10 rounded-full px-4 text-[0.64rem] font-bold tracking-[0.13em] uppercase transition-colors ${!activeCategory ? "bg-paper text-ink" : "hover:text-paper text-white/48 hover:bg-white/8"}`}
          >
            {t("all")}
          </button>
          {mediaType === "photos"
            ? categoryOrder.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => updateFilter(category)}
                  aria-pressed={activePhotoCategory === category}
                  className={`min-h-10 rounded-full px-4 text-[0.64rem] font-bold tracking-[0.13em] uppercase transition-colors ${activePhotoCategory === category ? "bg-paper text-ink" : "hover:text-paper text-white/48 hover:bg-white/8"}`}
                >
                  {categoryLabel(category, locale)}
                </button>
              ))
            : videoCategoryOrder.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => updateFilter(category)}
                  aria-pressed={activeVideoCategory === category}
                  className={`min-h-10 rounded-full px-4 text-[0.64rem] font-bold tracking-[0.13em] uppercase transition-colors ${activeVideoCategory === category ? "bg-paper text-ink" : "hover:text-paper text-white/48 hover:bg-white/8"}`}
                >
                  {videoCategoryLabel(category, locale)}
                </button>
              ))}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {t(mediaType === "videos" ? "videoCount" : "count", {
          count: resultCount,
        })}
      </p>
      <div
        key={`${mediaType}-${activeCategory ?? "all"}`}
        className="portfolio-filter-results"
      >
        {mediaType === "photos" ? (
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
                  projectCardClasses[index % projectCardClasses.length]
                }
              />
            ))}
          </div>
        ) : (
          <div className="mt-16 grid grid-cols-12 items-start gap-x-5 gap-y-20 sm:gap-x-8">
            {videos.map((video, index) => (
              <VideoCard
                key={video.videoId}
                video={video}
                locale={locale}
                labels={{
                  play: t("playVideo"),
                  watchOnYouTube: t("watchOnYouTube"),
                  short: t("short"),
                  longForm: t("longForm"),
                  thumbnailUnavailable: t("thumbnailUnavailable"),
                }}
                className={
                  video.contentType === "short"
                    ? "col-span-10 col-start-2 sm:col-span-5 sm:col-start-auto lg:col-span-3"
                    : projectCardClasses[index % projectCardClasses.length]
                }
              />
            ))}
          </div>
        )}
        {resultCount === 0 ? (
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
