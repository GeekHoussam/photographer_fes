"use client";

import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selected = searchParams.get("category");
  const active = isPortfolioCategory(selected) ? selected : null;
  const projects = active
    ? portfolioProjects.filter((project) => project.category === active)
    : portfolioProjects;

  function updateFilter(category: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (category) params.set("category", category);
    else params.delete("category");
    router.replace(`${pathname}${params.size ? `?${params}` : ""}`, {
      scroll: false,
    });
  }

  return (
    <>
      <div
        className="bg-ink/80 sticky top-[calc(var(--header-height)+1rem)] z-20 flex flex-wrap gap-2 rounded-[1.25rem] border border-white/10 p-2 backdrop-blur-xl"
        aria-label={locale === "fr" ? "Filtrer les projets" : "Filter projects"}
      >
        <button
          type="button"
          onClick={() => updateFilter(null)}
          aria-pressed={!active}
          className={`min-h-10 rounded-full px-4 text-[0.64rem] font-bold tracking-[0.13em] uppercase transition-colors ${!active ? "bg-paper text-ink" : "hover:text-paper text-white/48 hover:bg-white/8"}`}
        >
          {locale === "fr" ? "Tous" : "All"}
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
      <p className="sr-only" aria-live="polite">
        {locale === "fr"
          ? `${projects.length} projets affichés`
          : `${projects.length} projects shown`}
      </p>
      <div className="mt-16 grid grid-cols-12 items-start gap-x-5 gap-y-20 sm:gap-x-8">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            locale={locale}
            index={index}
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
        <p className="py-20 text-center text-white/45">
          {locale === "fr"
            ? "Aucun projet n'est publié dans cette catégorie."
            : "No project is published in this category."}
        </p>
      ) : null}
    </>
  );
}
