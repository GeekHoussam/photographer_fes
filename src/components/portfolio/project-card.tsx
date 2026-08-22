import type { Locale } from "@/config/site";
import type { ProjectSummary } from "@/types/content";
import { Link } from "@/i18n/navigation";
import { ProjectPreview } from "./project-preview";

const aspectClasses = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
};

export function ProjectCard({
  project,
  locale,
  className = "",
  imageClassName = "",
  openLabel,
  previewLabel,
  imageCountLabel,
}: {
  project: ProjectSummary;
  locale: Locale;
  className?: string;
  imageClassName?: string;
  openLabel: string;
  previewLabel: string;
  imageCountLabel: string;
}) {
  return (
    <article className={className}>
      <Link
        href={`/portfolio/${project.slug}`}
        className="group portfolio-project-card block"
      >
        <ProjectPreview
          images={project.gallery.length ? project.gallery : [project.cover]}
          locale={locale}
          aspectClass={aspectClasses[project.aspect]}
          imageClassName={imageClassName}
          openLabel={openLabel}
          previewLabel={previewLabel}
        />
        <div className="flex items-start justify-between gap-5 pt-5">
          <div className="max-w-[46rem]">
            <p className="eyebrow text-sand">{project.categoryLabel[locale]}</p>
            <h2 className="font-display group-hover:text-sand mt-3 text-[clamp(2rem,3.5vw,3.75rem)] leading-[0.94] tracking-[-0.03em] transition-colors">
              {project.title[locale]}
            </h2>
            <p className="portfolio-project-summary mt-4 max-w-2xl text-sm leading-7 text-white/48">
              {project.summary[locale]}
            </p>
          </div>
          <div className="shrink-0 pt-1 text-right text-[0.68rem] tracking-[0.1em] text-current/40 uppercase">
            <span className="block">{project.location[locale]}</span>
            <span className="mt-2 block text-current/65">
              {imageCountLabel}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
