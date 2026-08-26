import type { Metadata } from "next";
import { Container } from "@/components/common/container";
import { ResponsiveMedia } from "@/components/common/responsive-media";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/sections/page-hero";
import { isLocale } from "@/config/site";
import { getPageContent } from "@/features/content/pages";
import { journalArticles } from "@/features/journal/articles";
import { Link } from "@/i18n/navigation";
import { createPageMetadata } from "@/lib/seo/metadata";
import { journalPageJsonLd } from "@/lib/seo/structured-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const content = getPageContent("journal", locale);
  const cover = journalArticles[0].images[0];
  return createPageMetadata({
    locale,
    path: content.path,
    title: content.metaTitle,
    description: content.metaDescription,
    image: cover.src,
    imageWidth: cover.width,
    imageHeight: cover.height,
    noIndex: !content.indexable,
  });
}

export default async function JournalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const content = getPageContent("journal", locale);
  const readArticle = {
    fr: "Lire l’article",
    en: "Read article",
    ar: "قراءة المقال",
  }[locale];

  return (
    <>
      <JsonLd data={journalPageJsonLd(locale)} />
      <PageHero
        eyebrow={content.eyebrow}
        title={content.h1}
        introduction={content.introduction}
        mediaSrc={journalArticles[0].images[0].src}
      />
      <section className="section-space bg-ink text-paper">
        <Container>
          <div className="border-t border-current/12">
            {journalArticles.map((article, index) => {
              const articleContent = article.content[locale];
              const cover = article.images[0];
              const mediaClass =
                index % 2 === 0
                  ? "lg:col-span-6"
                  : "lg:col-span-6 lg:col-start-7 lg:order-2";
              const copyClass =
                index % 2 === 0
                  ? "lg:col-span-5 lg:col-start-8"
                  : "lg:col-span-5 lg:col-start-1 lg:row-start-1";

              return (
                <article
                  key={article.slug}
                  className="grid grid-cols-12 gap-y-8 border-b border-current/12 py-10 sm:py-14 lg:items-center lg:gap-x-10 lg:py-20"
                  data-journal-card={article.slug}
                >
                  <Link
                    href={`/journal/${article.slug}`}
                    className={`group col-span-12 block ${mediaClass}`}
                    aria-label={`${readArticle}: ${articleContent.title}`}
                  >
                    <ResponsiveMedia
                      src={cover.src}
                      alt={cover.alt[locale]}
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="aspect-square"
                      imageClassName="transition-transform duration-700 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
                    />
                  </Link>
                  <div
                    className={`col-span-12 flex flex-col justify-center ${copyClass}`}
                  >
                    <h2 className="font-display mt-7 text-[clamp(2.75rem,5vw,5.5rem)] leading-[0.92] tracking-[-0.04em]">
                      <Link
                        href={`/journal/${article.slug}`}
                        className="hover:text-sand transition-colors"
                      >
                        {articleContent.title}
                      </Link>
                    </h2>
                    <p className="mt-8 max-w-xl text-base leading-8 text-current/58">
                      {articleContent.summary}
                    </p>
                    <Link
                      href={`/journal/${article.slug}`}
                      className="text-link-arrow mt-8 w-fit"
                      aria-label={`${readArticle}: ${articleContent.title}`}
                    >
                      {readArticle}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
