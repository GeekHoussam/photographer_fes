import type { Locale } from "@/config/site";
import type { ProjectSummary } from "@/types/content";
import { ResponsiveMedia } from "@/components/common/responsive-media";
import { Link } from "@/i18n/navigation";

const aspectClasses = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
};

export function ProjectCard({
  project,
  locale,
  index = 0,
  className = "",
  imageClassName = "",
}: {
  project: ProjectSummary;
  locale: Locale;
  index?: number;
  className?: string;
  imageClassName?: string;
}) {
  return (
    <article className={className}>
      <Link href={`/portfolio/${project.slug}`} className="group block">
        <ResponsiveMedia
          src={project.cover.src}
          alt={project.cover.alt[locale]}
          sizes="(min-width: 1024px) 50vw, (min-width: 768px) 50vw, 100vw"
          className={`${aspectClasses[project.aspect]} border border-white/10`}
          imageClassName={imageClassName}
        />
        <div className="flex items-start justify-between gap-5 pt-5">
          <div>
            <p className="eyebrow text-sand">
              {String(index + 1).padStart(2, "0")} ·{" "}
              {project.categoryLabel[locale]}
            </p>
            <h2 className="font-display group-hover:text-sand mt-3 text-[clamp(2rem,3.5vw,3.75rem)] leading-[0.94] tracking-[-0.03em] transition-colors">
              {project.title[locale]}
            </h2>
          </div>
          <span className="pt-1 text-right text-[0.68rem] tracking-[0.1em] text-current/40 uppercase">
            {project.location}
          </span>
        </div>
      </Link>
    </article>
  );
}
