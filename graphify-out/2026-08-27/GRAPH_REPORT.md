# Graph Report - photographer_fes  (2026-08-26)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 543 nodes · 1160 edges · 38 communities (31 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0a8c632b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- isLocale
- structured-data.ts
- content.ts
- devDependencies
- dependencies
- videos.ts
- scripts
- compilerOptions
- index.ts
- contact-form.tsx
- site.ts
- audit_photos.py
- header.tsx
- arabic-locale.spec.ts
- [locale]/layout.tsx
- root-document.tsx
- contact-dialog.tsx
- next.config.ts
- hero-media.tsx
- rotating-catalogue.tsx
- client.ts
- queries.ts
- .lintstagedrc.mjs
- next-env.d.ts
- postcss.config.mjs
- prettier.config.mjs

## God Nodes (most connected - your core abstractions)
1. `isLocale()` - 44 edges
2. `getPageContent()` - 42 edges
3. `createPageMetadata()` - 31 edges
4. `Locale` - 25 edges
5. `localizedUrl()` - 22 edges
6. `compilerOptions` - 16 edges
7. `Container()` - 14 edges
8. `journalArticleJsonLd()` - 13 edges
9. `scripts` - 13 edges
10. `JsonLd()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `generateMetadata()` --calls--> `isLocale()`  [EXTRACTED]
  src/app/[locale]/layout.tsx → src/config/site.ts
- `Page()` --calls--> `aboutPageJsonLd()`  [EXTRACTED]
  src/app/[locale]/about/page.tsx → src/lib/seo/structured-data.ts
- `ContactPage()` --calls--> `contactPageJsonLd()`  [EXTRACTED]
  src/app/[locale]/contact/page.tsx → src/lib/seo/structured-data.ts
- `JournalPage()` --calls--> `journalPageJsonLd()`  [EXTRACTED]
  src/app/[locale]/journal/page.tsx → src/lib/seo/structured-data.ts
- `JournalArticlePage()` --calls--> `journalArticleJsonLd()`  [EXTRACTED]
  src/app/[locale]/journal/[slug]/page.tsx → src/lib/seo/structured-data.ts

## Import Cycles
- None detected.

## Communities (38 total, 7 thin omitted)

### Community 0 - "isLocale"
Cohesion: 0.09
Nodes (47): generateMetadata(), Page(), ContactPage(), generateMetadata(), generateMetadata(), JournalPage(), generateMetadata(), JournalArticlePage() (+39 more)

### Community 1 - "structured-data.ts"
Cohesion: 0.08
Nodes (55): ProjectPage(), dynamic, robots(), alternates(), dynamic, sitemap(), absoluteUrl(), localizedUrl() (+47 more)

### Community 2 - "content.ts"
Cohesion: 0.07
Nodes (35): gridLayouts, Lightbox(), aspectClasses, ProjectCard(), ProjectPreview(), handlePointerMove(), paintPointerPosition(), resetPreview() (+27 more)

### Community 3 - "devDependencies"
Cohesion: 0.05
Nodes (43): eslint, eslint-config-next, eslint-config-prettier, husky, jsdom, lint-staged, devDependencies, eslint (+35 more)

### Community 4 - "dependencies"
Cohesion: 0.05
Nodes (43): focus-trap-react, @fontsource-variable/jost, @fontsource-variable/noto-sans-arabic, @hookform/resolvers, lucide-react, next, next-intl, next-sanity (+35 more)

### Community 5 - "videos.ts"
Cohesion: 0.10
Nodes (27): JournalVideo(), PortfolioFilters(), projectCardClasses, VideoCard(), VideoCardLabels, categoryLabel(), categoryOrder, isPortfolioCategory() (+19 more)

### Community 6 - "scripts"
Cohesion: 0.07
Nodes (28): engines, node, name, packageManager, pnpm, onlyBuiltDependencies, private, scripts (+20 more)

### Community 7 - "compilerOptions"
Cohesion: 0.07
Nodes (27): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 8 - "index.ts"
Cohesion: 0.10
Nodes (18): accessibleImage, category, client, faq, homepage, journalArticle, localizedPortableText, localizedString (+10 more)

### Community 9 - "contact-form.tsx"
Cohesion: 0.15
Nodes (13): POST(), Button(), ContactForm(), ContactFormCopy, attempts, checkContactRateLimit(), Entry, ContactInput (+5 more)

### Community 10 - "site.ts"
Cohesion: 0.19
Nodes (10): configuredBasePath, configuredUrl, defaultLocale, locales, normalizeBasePath(), normalizeSiteUrl(), publicBaseUrl, resolvePublicBaseUrl() (+2 more)

### Community 11 - "audit_photos.py"
Cohesion: 0.28
Nodes (12): Image, ImageFont, Path, difference_hash(), display_category(), hamming(), inspect(), label_font() (+4 more)

### Community 12 - "header.tsx"
Cohesion: 0.21
Nodes (7): Header(), links, languageOptions, LanguageSwitcher(), applyTheme(), Theme, ThemeToggle()

### Community 13 - "arabic-locale.spec.ts"
Cohesion: 0.17
Nodes (5): arabicRoutes, articleSlugs, projectSlugs, serviceSlugs, articles

### Community 14 - "[locale]/layout.tsx"
Cohesion: 0.24
Nodes (4): generateMetadata(), Footer(), HydrationMarker(), SmoothScroll()

### Community 15 - "root-document.tsx"
Cohesion: 0.24
Nodes (6): metadata, arabicFont, RootDocument(), siteFont, ThemeInitializer(), brandTitles

### Community 16 - "contact-dialog.tsx"
Cohesion: 0.25
Nodes (5): ContactDialogContext, ContactDialogContextValue, ContactDialogProvider(), ContactMethods(), contactDetails

### Community 17 - "next.config.ts"
Cohesion: 0.40
Nodes (4): nextConfig, withNextIntl, LegacyRedirect, legacyRedirects

### Community 19 - "rotating-catalogue.tsx"
Cohesion: 0.67
Nodes (3): CatalogueItem, circularOffset(), RotatingCatalogue()

## Knowledge Gaps
- **180 isolated node(s):** `ContainerProps`, `PageMetadataInput`, `PageContent`, `PageCopy`, `ProcessStep` (+175 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `sharp` connect `scripts` to `structured-data.ts`?**
  _High betweenness centrality (0.245) - this node is a cross-community bridge._
- **What connects `ContainerProps`, `PageMetadataInput`, `PageContent` to the rest of the system?**
  _180 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `isLocale` be split into smaller, more focused modules?**
  _Cohesion score 0.09297297297297297 - nodes in this community are weakly interconnected._
- **Should `structured-data.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07692307692307693 - nodes in this community are weakly interconnected._
- **Should `content.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06509803921568627 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.046511627906976744 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.046511627906976744 - nodes in this community are weakly interconnected._