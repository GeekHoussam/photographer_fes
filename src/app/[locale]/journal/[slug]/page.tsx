import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/common/button";
import { Container } from "@/components/common/container";
import {
  JournalArticleContent,
  RichText,
} from "@/components/journal/journal-article-content";
import { JsonLd } from "@/components/seo/json-ld";
import { PageHero } from "@/components/sections/page-hero";
import { contactDetails, isLocale, siteConfig } from "@/config/site";
import {
  getJournalArticle,
  journalArticles,
} from "@/features/journal/articles";
import { Link } from "@/i18n/navigation";
import { createPageMetadata } from "@/lib/seo/metadata";
import { journalArticleJsonLd } from "@/lib/seo/structured-data";

export function generateStaticParams() {
  return journalArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const article = getJournalArticle(slug);
  if (!article) return {};
  const content = article.content[locale];
  const cover = article.images[0];

  return createPageMetadata({
    locale,
    path: `/journal/${article.slug}`,
    title: content.metaTitle,
    description: content.metaDescription,
    image: cover.src,
    imageWidth: cover.width,
    imageHeight: cover.height,
    openGraphType: "article",
  });
}

export default async function JournalArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const articleIndex = journalArticles.findIndex(
    (entry) => entry.slug === slug,
  );
  const article = journalArticles[articleIndex];
  if (!article) notFound();

  const content = article.content[locale];
  const previous =
    journalArticles[
      (articleIndex - 1 + journalArticles.length) % journalArticles.length
    ];
  const next = journalArticles[(articleIndex + 1) % journalArticles.length];
  const fr = locale === "fr";

  return (
    <article className="bg-ink text-paper" data-journal-article={article.slug}>
      <JsonLd data={journalArticleJsonLd(locale, article)} />
      <PageHero
        eyebrow={fr ? "Journal" : "Journal"}
        title={content.title}
        introduction={content.summary}
        mediaSrc={article.images[0].src}
      />

      <section className="border-b border-current/12 py-12 sm:py-16">
        <Container className="grid grid-cols-12 gap-y-10 lg:gap-x-12">
          <nav
            aria-label={fr ? "Fil d’Ariane" : "Breadcrumb"}
            className="col-span-12 flex flex-wrap gap-2 text-xs tracking-[0.12em] text-current/45 uppercase"
          >
            <Link href="/">{fr ? "Accueil" : "Home"}</Link>
            <span aria-hidden="true">/</span>
            <Link href="/journal">Journal</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{content.title}</span>
          </nav>
          <p className="eyebrow text-sand col-span-12 lg:col-span-3">
            {fr ? "À propos de l’article" : "About the article"}
          </p>
          <div className="col-span-12 lg:col-span-7 lg:col-start-5">
            <p className="font-display text-[clamp(2.25rem,4vw,4.5rem)] leading-[1.02] tracking-[-0.03em]">
              {content.summary}
            </p>
            <dl className="mt-10 border-t border-current/12 pt-6 text-sm">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <dt className="eyebrow text-current/45">
                  {fr ? "Auteur" : "Author"}
                </dt>
                <dd>{article.author}</dd>
              </div>
            </dl>
          </div>
        </Container>
      </section>

      <section
        className="theme-light section-space"
        aria-label={fr ? "Contenu de l’article" : "Article content"}
      >
        <Container>
          <JournalArticleContent article={article} locale={locale} />
        </Container>
      </section>

      <section
        id="faq"
        className="section-space bg-surface text-paper border-t border-current/10"
        data-journal-faq
      >
        <Container className="grid grid-cols-12 gap-y-10 lg:gap-x-12">
          <div className="col-span-12 lg:col-span-5">
            <p className="eyebrow text-sand">FAQ</p>
            <h2 className="display-section mt-7">
              {fr ? "Questions fréquentes" : "Frequently asked questions"}
            </h2>
            <p className="mt-8 max-w-xl leading-8 text-current/52">
              {content.faqIntroduction}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            {content.faqs.map((faq) => (
              <section
                key={faq.question}
                className="border-t border-current/12 py-7 last:border-b"
              >
                <h3 className="font-display text-3xl leading-tight tracking-[-0.02em]">
                  {faq.question}
                </h3>
                <p className="mt-5 leading-8 text-current/58">
                  <RichText content={faq.answer} />
                </p>
              </section>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-sand text-ink relative overflow-hidden py-20 sm:py-28">
        <Container className="grid grid-cols-12 gap-y-10 lg:gap-x-12">
          <div className="col-span-12 lg:col-span-5">
            <p className="eyebrow text-current/50">Contact</p>
            <h2 className="font-display mt-7 text-[clamp(3.25rem,6vw,6.75rem)] leading-[0.88] tracking-[-0.04em]">
              {content.contactTitle}
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-6 lg:col-start-7 lg:pt-14">
            <div className="grid gap-5 text-base leading-8 text-current/70">
              {content.contactParagraphs.map((paragraph, index) => (
                <p key={`contact-${index}`}>
                  <RichText content={paragraph} />
                </p>
              ))}
            </div>
            <ButtonLink href="/contact" variant="inverse" className="mt-9">
              {content.contactAction}
            </ButtonLink>
            <ul className="mt-10 grid gap-3 border-t border-current/15 pt-6 text-sm sm:grid-cols-3">
              <li>
                <a
                  href={contactDetails.whatsapp.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-link-arrow"
                >
                  WhatsApp {contactDetails.whatsapp.display}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contactDetails.filmEmail}`}
                  className="text-link-arrow break-all"
                >
                  {contactDetails.filmEmail}
                </a>
              </li>
              <li>{fr ? siteConfig.location : "Fez, Morocco"}</li>
            </ul>
          </div>
        </Container>
      </section>

      <nav
        aria-label={fr ? "Articles adjacents" : "Adjacent articles"}
        className="border-y border-current/10"
      >
        <Container className="grid sm:grid-cols-2">
          <Link
            href={`/journal/${previous.slug}`}
            className="group border-b border-current/10 py-8 sm:border-r sm:border-b-0 sm:pr-10"
            aria-label={`${fr ? "Article précédent" : "Previous article"}: ${previous.content[locale].title}`}
          >
            <span className="eyebrow text-sand flex items-center gap-2">
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              {fr ? "Article précédent" : "Previous article"}
            </span>
            <span className="font-display mt-5 block text-4xl leading-none transition-transform group-hover:-translate-x-1 motion-reduce:transition-none">
              {previous.content[locale].title}
            </span>
          </Link>
          <Link
            href={`/journal/${next.slug}`}
            className="group py-8 sm:pl-10 sm:text-right"
            aria-label={`${fr ? "Article suivant" : "Next article"}: ${next.content[locale].title}`}
          >
            <span className="eyebrow text-sand flex items-center justify-end gap-2">
              {fr ? "Article suivant" : "Next article"}
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </span>
            <span className="font-display mt-5 block text-4xl leading-none transition-transform group-hover:translate-x-1 motion-reduce:transition-none">
              {next.content[locale].title}
            </span>
          </Link>
        </Container>
      </nav>
    </article>
  );
}
