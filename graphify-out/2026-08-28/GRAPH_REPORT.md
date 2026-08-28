# Graph Report - photographer_fes  (2026-08-27)

## Corpus Check
- 157 files · ~3,430,705 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1223 nodes · 1790 edges · 107 communities (86 shown, 21 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7eaca5ba`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- isLocale
- structured-data.ts
- Locale
- devDependencies
- dependencies
- videos.ts
- scripts
- compilerOptions
- index.ts
- contact-form.tsx
- site.ts
- audit_photos.py
- [locale]/layout.tsx
- arabic-locale.spec.ts
- Hard Rules
- LAYER 2 — QUANTA IMPLEMENTATION
- Threat model
- next.config.ts
- hero-media.tsx
- rotating-catalogue.tsx
- Hard rules
- client.ts
- queries.ts
- .lintstagedrc.mjs
- next-env.d.ts
- postcss.config.mjs
- prettier.config.mjs
- What You Must Do When Invoked
- Appendix B - Canonical Sources (read these before reinventing)
- Skill: FNF SDK
- 5. Component & block directory (copy-paste; the source lands in the repo)
- Hard rules
- portfolio-filters.tsx
- Skill: Auth Boundary
- Photography portfolio redesign brief
- Workflow
- Skill: Runtime And Infra
- Fit it into the existing website pipeline
- Photographe Fès - Votre Photographe de Mariage à Fès
- content.ts
- 4. DESIGN ENGINEERING DIRECTIVES (Bias Correction)
- 7 Principles
- Photographe Fès - Réussir votre présence sur Réseaux Sociaux
- Photographe Fès - Revivez Votre Événement en Photo et Vidéo
- design-recipe — the distilled craft playbook (read on EVERY build)
- Audit Procedure
- Technical SEO
- App quickstart — the working critical path
- Containers — heavy & long-running work
- 10. REFERENCE VOCABULARY (Pattern Names the Agent Should Know)
- tasteskill: Anti-Slop Frontend Skill
- Meta tags & OG
- Higgsfield website builder (CLI) — two product types, two flows
- Mohammed Laâchach photography portfolio
- Workflow
- Skill: FNF React
- reference-boards — design the page as IMAGES before writing code (Phase 1)
- The catalog
- graphify reference: extra exports and benchmark
- Architecture decision record
- 9. AI TELLS (Forbidden Patterns)
- Entity SEO
- 11. REDESIGN PROTOCOL
- 3. DEFAULT ARCHITECTURE & CONVENTIONS
- 6. PERFORMANCE & ACCESSIBILITY GUARDRAILS
- image-to-code — implement the reference boards faithfully (Phase 3)
- Required Fields Per Schema Type
- app-layouts — the standard Higgsfield app layouts (`type: "app"` builds ONLY)
- App contest — how to enter, and how it shapes the build
- SEO
- Schema markup
- graphify reference: query, path, explain
- Photography asset audit
- asset-system — the Higgsfield-generated visual system (Phase 2)
- 0. BRIEF INFERENCE (Read the Room Before Anything Else)
- 12. THE BLOCK LIBRARY (Contract - Implementations Land Here Iteratively)
- 5. CONTEXT-AWARE PROACTIVITY
- 8. DARK MODE PROTOCOL
- 7. DIAL DEFINITIONS (Technical Reference)
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- mappers.ts
- review-rubric — Phase 5 mechanical gate
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- AGENTS.md
- scroll-scrub-asset-css.md
- scroll-scrub-asset-react.md
- scroll-scrub-asset-video.md
- extraction-spec.md
- content-todo.md
- content-migration.md
- deployment.md
- sanity-editor-guide.md
- threejs-performance.md

## God Nodes (most connected - your core abstractions)
1. `isLocale()` - 44 edges
2. `getPageContent()` - 42 edges
3. `createPageMetadata()` - 31 edges
4. `Locale` - 25 edges
5. `localizedUrl()` - 22 edges
6. `Skill: FNF SDK` - 21 edges
7. `compilerOptions` - 16 edges
8. `tasteskill: Anti-Slop Frontend Skill` - 16 edges
9. `Appendix B - Canonical Sources (read these before reinventing)` - 15 edges
10. `Container()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `generateMetadata()` --calls--> `isLocale()`  [EXTRACTED]
  src/app/[locale]/layout.tsx → src/config/site.ts
- `Page()` --calls--> `aboutPageJsonLd()`  [EXTRACTED]
  src/app/[locale]/about/page.tsx → src/lib/seo/structured-data.ts
- `ContactPage()` --calls--> `contactPageJsonLd()`  [EXTRACTED]
  src/app/[locale]/contact/page.tsx → src/lib/seo/structured-data.ts
- `JournalArticlePage()` --calls--> `journalArticleJsonLd()`  [EXTRACTED]
  src/app/[locale]/journal/[slug]/page.tsx → src/lib/seo/structured-data.ts
- `JournalPage()` --calls--> `journalPageJsonLd()`  [EXTRACTED]
  src/app/[locale]/journal/page.tsx → src/lib/seo/structured-data.ts

## Import Cycles
- None detected.

## Communities (107 total, 21 thin omitted)

### Community 0 - "isLocale"
Cohesion: 0.09
Nodes (50): generateMetadata(), Page(), ContactPage(), generateMetadata(), generateMetadata(), JournalPage(), generateMetadata(), JournalArticlePage() (+42 more)

### Community 1 - "structured-data.ts"
Cohesion: 0.07
Nodes (63): dynamic, robots(), alternates(), dynamic, sitemap(), absoluteUrl(), brandTitles, contactDetails (+55 more)

### Community 2 - "Locale"
Cohesion: 0.16
Nodes (13): gridLayouts, Lightbox(), aspectClasses, ProjectCard(), ProjectPreview(), handlePointerMove(), paintPointerPosition(), resetPreview() (+5 more)

### Community 3 - "devDependencies"
Cohesion: 0.05
Nodes (43): eslint, eslint-config-next, eslint-config-prettier, husky, jsdom, lint-staged, devDependencies, eslint (+35 more)

### Community 4 - "dependencies"
Cohesion: 0.05
Nodes (43): focus-trap-react, @fontsource-variable/jost, @fontsource-variable/noto-sans-arabic, @hookform/resolvers, lucide-react, next, next-intl, next-sanity (+35 more)

### Community 5 - "videos.ts"
Cohesion: 0.15
Nodes (16): JournalVideo(), VideoCardLabels, arabicTitleByVideoId, definitionBySlug, getVideoEmbedUrl(), getVideoThumbnailUrl(), PortfolioVideo, portfolioVideos (+8 more)

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
Cohesion: 0.10
Nodes (17): POST(), Button(), ContactDialogContext, ContactDialogContextValue, ContactDialogProvider(), ContactMethods(), ContactForm(), ContactFormCopy (+9 more)

### Community 10 - "site.ts"
Cohesion: 0.19
Nodes (7): configuredBasePath, configuredUrl, defaultLocale, normalizeBasePath(), normalizeSiteUrl(), publicBaseUrl, resolvePublicBaseUrl()

### Community 11 - "audit_photos.py"
Cohesion: 0.28
Nodes (12): Image, ImageFont, Path, difference_hash(), display_category(), hamming(), inspect(), label_font() (+4 more)

### Community 12 - "[locale]/layout.tsx"
Cohesion: 0.06
Nodes (20): metadata, generateMetadata(), arabicFont, RootDocument(), siteFont, Footer(), Header(), links (+12 more)

### Community 13 - "arabic-locale.spec.ts"
Cohesion: 0.17
Nodes (5): arabicRoutes, articleSlugs, projectSlugs, serviceSlugs, articles

### Community 14 - "Hard Rules"
Cohesion: 0.04
Nodes (44): 10. No Secrets in React Props, 11. Cookie Security, 12. CORS Only When Needed, 1. No Global Mutable State, 2. Cryptographic Randomness Only, 3. No Hardcoded Secrets, 4. Timing-Safe Secret Comparison, 5. Stream Large Payloads (+36 more)

### Community 15 - "LAYER 2 — QUANTA IMPLEMENTATION"
Cohesion: 0.07
Nodes (28): Anti-Patterns, App shell, Button Rules, Code layouts (preferred starting points), Component Priority, Core Imports, Current Spacing And Token Rules, Data & Charts (LOW — dashboards only) (+20 more)

### Community 16 - "Threat model"
Cohesion: 0.07
Nodes (29): 1. IDOR via Predictable Resource IDs, 2. Server Function Input Manipulation, 3. Test Data Contamination (Live D1), 4. Privilege Escalation via Client State, 5. SSRF via Server Function, 6. Webhook Replay / Forgery, Anonymous Internet User, API Routes (`app/src/routes/api/**`) (+21 more)

### Community 17 - "next.config.ts"
Cohesion: 0.40
Nodes (4): nextConfig, withNextIntl, LegacyRedirect, legacyRedirects

### Community 19 - "rotating-catalogue.tsx"
Cohesion: 0.67
Nodes (3): CatalogueItem, circularOffset(), RotatingCatalogue()

### Community 21 - "Hard rules"
Cohesion: 0.08
Nodes (24): 0a. Vendored packages and template modules, 0b. Supercomputer Design mode inspector, 1. SSR-safe rendering, 2. Server-only code stays server-only, 3. No Higgsfield integration — but a REAL backend of the site's own, 4. Cloudflare bindings via `cloudflare:workers`, 5. Opted-in storage is LIVE — one deploy, one database, 6. `app/app.manifest.json` declares infra — NOTHING is provisioned by default (+16 more)

### Community 38 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 39 - "Appendix B - Canonical Sources (read these before reinventing)"
Cohesion: 0.09
Nodes (21): APPENDICES - Real Source-Backed Reference Material, Appendix A - Install Commands per Design System, Appendix B - Canonical Sources (read these before reinventing), Appendix C - Apple Liquid Glass: Honest Web Approximation, Apple Liquid Glass (Apple platforms only), Atlassian, Bootstrap, Carbon (+13 more)

### Community 40 - "Skill: FNF SDK"
Cohesion: 0.09
Nodes (21): Common Imports, Elements and custom-reference character training, fnf.internal Method Contract, Generation Result Rendering Contract, Job Client Pattern, Job UI Pattern, LLM chat / text — `createLlmClient` (NOT a job), Mandatory Generation Website Checklist (+13 more)

### Community 41 - "5. Component & block directory (copy-paste; the source lands in the repo)"
Cohesion: 0.10
Nodes (20): 1. Generate bespoke AI assets — this is our biggest edge, 2. Signature effects you can build (patterns), 3. Quick "I need X" index, 4. Framework toolkit (npm deps — add to `app/package.json` when used), 5. Component & block directory (copy-paste; the source lands in the repo), 6. SSR pattern (use for every `[C]` / `[W]` item), Animata · `npx shadcn add https://animata.design/r/<category>/<name>.json`, `app/components.json` → `registries` (+12 more)

### Community 42 - "Hard rules"
Cohesion: 0.11
Nodes (17): 0a. Higgsfield packages and template modules, 0b. Supercomputer Design mode inspector, 1. SSR-safe rendering, 2. Server-only code stays server-only, 3. Higgsfield (fnf) calls are BACKEND-ONLY — and auth is MANDATORY, 3a. An app is end-to-end — real backend + real DB, never a mock, 4. Cloudflare bindings via `cloudflare:workers`, 5. Opted-in storage is LIVE — one deploy, one database (+9 more)

### Community 43 - "portfolio-filters.tsx"
Cohesion: 0.18
Nodes (11): PortfolioFilters(), projectCardClasses, VideoCard(), categoryLabel(), categoryOrder, isPortfolioCategory(), labels, filterPortfolioVideos() (+3 more)

### Community 44 - "Skill: Auth Boundary"
Cohesion: 0.13
Nodes (14): Anti-Patterns, Auth UI Rules, Authenticated File Downloads, Choose The Correct Auth Mode, Contract, FNF SDK Interaction, Frontend User Loader Pattern, Login (+6 more)

### Community 45 - "Photography portfolio redesign brief"
Cohesion: 0.13
Nodes (14): Anti-convergence ledger, Asset plan, Concept spine, CTA inventory, Delivery tier, Design read, Locked palette, Locked type (+6 more)

### Community 46 - "Workflow"
Cohesion: 0.15
Nodes (12): 1. Get the essentials from the request, 2. Pick 2–4 reference images, 3. Reference the chosen refs, 4. Generate ONE full-bleed artwork, 5. Produce the two outputs, 6. Deliver / wire into the app, Anti-slop rules (composition), App cover + OG image (3:2, Higgsfield brand style) (+4 more)

### Community 47 - "Skill: Runtime And Infra"
Cohesion: 0.15
Nodes (12): Binary Upload Routes, Cloudflare Bindings, Durable Objects, Live Data Warning, SEO Infrastructure, Server-Only Code, Server Routes, Skill: Runtime And Infra (+4 more)

### Community 48 - "Fit it into the existing website pipeline"
Cohesion: 0.15
Nodes (12): A4 pre-delivery QA, Architecture A — continuous forward flight (default), Architecture B — diorama dives plus aerial connectors, Encode direct MP4s for scrubbing, Fit it into the existing website pipeline, Phase 0 — lock the journey, Phase 1 — make each board a world chapter, Phase 2 — build the seam-locked media chain (+4 more)

### Community 49 - "Photographe Fès - Votre Photographe de Mariage à Fès"
Cohesion: 0.15
Nodes (12): A quoi sert une Vidéo pour un Couple à fès ?, Au-delà de l'Image Fixe : Votre Vidéaste Mariage Maroc, Capturer l'Essence des Lieux de Réception Prestigieux, Contactez Votre Photographe de Mariage à Fès, L'Expertise Locale : Lumière, Lieux et Logistique, L’Élégance Intemporelle : L'Importance d'un Photographe de Mariage à Fès, La Magie de la Médina pour Votre Séance Photo Couple, NOM Films : L'Excellence Cinématographique à Fès (+4 more)

### Community 50 - "content.ts"
Cohesion: 0.19
Nodes (10): JournalArticleContent(), RichText(), mediaBySlug, JournalArticle, JournalBodyBlock, JournalLocaleContent, JournalRichText, JournalVideo (+2 more)

### Community 51 - "4. DESIGN ENGINEERING DIRECTIVES (Bias Correction)"
Cohesion: 0.17
Nodes (12): 4.10 Quotes & Testimonials, 4.11 Page Theme Lock (Light / Dark Mode Consistency), 4.1 Typography, 4.2 Color Calibration, 4.3 Layout Diversification, 4.4 Materiality, Shadows, Cards, 4.5 Interactive UI States, 4.6 Data & Form Patterns (+4 more)

### Community 52 - "7 Principles"
Cohesion: 0.17
Nodes (12): 1. Direct Answer Structure, 2. Entity Clarity, 3. Factual Specificity, 4. Schema-Content Alignment, 5. FAQ Sections, 6. Citation-Friendly Headings, 7 Principles, 7. Topical Authority (+4 more)

### Community 53 - "Photographe Fès - Réussir votre présence sur Réseaux Sociaux"
Cohesion: 0.17
Nodes (11): Comment des photos professionnelles peuvent-elles baisser le coût de mes publicités Meta Ads ?, Formats Verticaux et Vidéo Réseaux Sociaux, L'Enjeu Stratégique de l'Image pour les Entreprises Locales, Le Pouvoir de la Photographie pour le Personal Branding, Passez à l'Action et Convertissez Votre Audience, Photographe Fès - Réussir votre présence sur Réseaux Sociaux, Pourquoi faire appel à un photographe professionnel pour ses réseaux sociaux à Fès ?, Quels formats vidéo produisez-vous pour Instagram et TikTok ? (+3 more)

### Community 54 - "Photographe Fès - Revivez Votre Événement en Photo et Vidéo"
Cohesion: 0.17
Nodes (11): Assurez-vous la couverture sur plusieurs jours pour un séminaire d'entreprise ?, Contactez Photographe Fès pour Sécuriser Votre Prochain Événement, Couverture Vidéo et Aftermovie : Dynamisez votre Communication, Expertise et Connaissance des Lieux B2B : Le Choix de votre Photographe événement à Fès, L'Importance Stratégique d'un Photographe événementiel Fès pour votre Marque, Photographe Fès - Revivez Votre Événement en Photo et Vidéo, Quel type de matériel utilise votre agence audiovisuelle ?, Quels sont vos délais pour la livraison rapide des livrables ? (+3 more)

### Community 55 - "design-recipe — the distilled craft playbook (read on EVERY build)"
Cohesion: 0.18
Nodes (10): 1. Typography, 2. Color, 3. Hero discipline (hard rules), 4. Layout rules (page-wide), 5. Copy rules, 6. Motion rules, 7. Interactive states & forms, 8. Images & icons (+2 more)

### Community 56 - "Audit Procedure"
Cohesion: 0.18
Nodes (11): 10. Social Preview, 1. Heading Hierarchy, 2. Image Alt Text, 3. Link Text Quality, 4. Content-to-Code Ratio, 5. Keyword Alignment, 6. Mobile Readability, 7. Keyboard Navigation (+3 more)

### Community 57 - "Technical SEO"
Cohesion: 0.18
Nodes (11): Canonical URLs, Cloudflare Edge Advantage, Multi-page site, Performance Hints in `__root.tsx`, Pitfalls, robots.txt Server Route, Security Headers in server.ts, Single-page site (landing page) (+3 more)

### Community 58 - "App quickstart — the working critical path"
Cohesion: 0.20
Nodes (9): 1. Auth — the `/api/user` proxy + login/logout, 2. Create the SDK clients (server-side), 3. Submit (with the confirmation gate) → poll → read the URL, 4. Render the result, 5. React wiring (fnf-react hooks), 6. Media upload — binary never goes through JSON, 7. Server functions + bindings, 8. The Quanta components you'll actually use (+1 more)

### Community 59 - "Containers — heavy & long-running work"
Cohesion: 0.20
Nodes (9): 1. Opt in — `app/app.manifest.json`, 2. The image — `app/container/Dockerfile`, 3. The Durable Object — `app/src/server.ts` (the boot is the tricky part), 4. Long jobs — never block a request; keep it alive; have a deadline, 5. Calling Higgsfield (fnf) from the container — the container token, 6. Results & big files, Containers — heavy & long-running work, Gotchas (read before shipping) (+1 more)

### Community 60 - "10. REFERENCE VOCABULARY (Pattern Names the Agent Should Know)"
Cohesion: 0.20
Nodes (10): 10. REFERENCE VOCABULARY (Pattern Names the Agent Should Know), Animation Library Choice, Cards & Containers, Galleries & Media, Hero Paradigms, Layout & Grids, Micro-Interactions & Effects, Navigation & Menus (+2 more)

### Community 61 - "tasteskill: Anti-Slop Frontend Skill"
Cohesion: 0.20
Nodes (10): 13. OUT OF SCOPE, 14. FINAL PRE-FLIGHT CHECK, 1.A Dial Inference (design read → dial values), 1.B Use-Case Presets, 1.C How the Dials Drive Output, 1. THE THREE DIALS (Core Configuration), 2.A When to reach for a real design system (use official packages), 2.B When the brief is an aesthetic, not a system (+2 more)

### Community 62 - "Meta tags & OG"
Cohesion: 0.20
Nodes (10): Canonical URL Pattern, Deriving Values from Intake, Description Rules, Global Meta in `__root.tsx`, Meta tags & OG, Page metadata file (`app/src/app-meta.json`) + Cover video, Per-Route Meta in Page `head()`, Pitfalls (+2 more)

### Community 63 - "Higgsfield website builder (CLI) — two product types, two flows"
Cohesion: 0.20
Nodes (9): Always set a subdomain on create, Cover + metadata — ALWAYS part of building, never publish-only, Higgsfield website builder (CLI) — two product types, two flows, Pick the path, then follow ONE flow end-to-end, Prerequisites, Reference index (what's in this bundle), Talking to the user — no technical/plumbing language, The two types — and the REQUIRED `--type` on create (+1 more)

### Community 64 - "Mohammed Laâchach photography portfolio"
Cohesion: 0.20
Nodes (9): Content editing and image requirements, Environment variables, Installation, Mohammed Laâchach photography portfolio, Prerequisites, Production build and Vercel deployment, Sanity setup and editing, Testing and quality checks (+1 more)

### Community 65 - "Workflow"
Cohesion: 0.22
Nodes (8): 1. Read the cover's content, 2. Design the beats (~5s), all derived from the cover's actual content, 3. Generate, 4. Wire into the app, Cover animator (~5s reveal → `og_video_url`), Deviations, The trick: end-frame reveal, Workflow

### Community 66 - "Skill: FNF React"
Cohesion: 0.22
Nodes (8): Cache Rules, Client Boundary, Generation Feed And Preview Rendering, Package Philosophy, Profile And Workspace, Provider Shape, Request Helpers, Skill: FNF React

### Community 67 - "reference-boards — design the page as IMAGES before writing code (Phase 1)"
Cohesion: 0.22
Nodes (8): Hero-board minimalism rules, Palette bans (hard, also enforced by the Phase 5 gate), Prompt recipe (per board), reference-boards — design the page as IMAGES before writing code (Phase 1), The combinatorial pick (commit BEFORE prompting), The output rule, The re-roll rule (mandatory — LOOK at every board), What each board must communicate

### Community 68 - "The catalog"
Cohesion: 0.22
Nodes (8): A. Film scrub family (scroll plays generated video), Anti-convergence ledger (mechanical, checked in the gate), B. Layered depth family (one image becomes a 3D-feeling scene), C. Canvas/pixel family (the image itself is alive), D. Spatial layout family (the page itself moves unusually), Implementation contracts (all families), The catalog, wow-catalog — Tier-1 experience techniques (pick in Phase 0, build in Phase 4)

### Community 69 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 70 - "Architecture decision record"
Cohesion: 0.22
Nodes (8): ADR-001: Headless, localized Next.js portfolio, Architecture decision record, Consequences, Context, Decision, Dependencies and reasons, Folder structure, Implementation plan

### Community 71 - "9. AI TELLS (Forbidden Patterns)"
Cohesion: 0.25
Nodes (8): 9.A Visual & CSS, 9. AI TELLS (Forbidden Patterns), 9.B Typography, 9.C Layout & Spacing, 9.D Content & Data ("Jane Doe" Effect), 9.E External Resources & Components, 9.F Production-Test Tells (banned outright), 9.G EM-DASH BAN (the single most-violated Tell)

### Community 72 - "Entity SEO"
Cohesion: 0.25
Nodes (8): Consistent NAP, Entity Data Model, Entity SEO, Implementation, Multi-Entity @graph Pattern, Pitfalls, sameAs Strategy, What It Is

### Community 73 - "11. REDESIGN PROTOCOL"
Cohesion: 0.29
Nodes (7): 11.A Detect the Mode (first action), 11.B Audit Before Touching, 11.C Preservation Rules, 11.D Modernisation Levers (priority order), 11.E Decision Tree: Targeted Evolution vs Full Redesign, 11.F What Never Changes Silently, 11. REDESIGN PROTOCOL

### Community 74 - "3. DEFAULT ARCHITECTURE & CONVENTIONS"
Cohesion: 0.29
Nodes (7): 3.A Stack, 3.B State, 3.C Icons, 3.D Emoji Policy, 3. DEFAULT ARCHITECTURE & CONVENTIONS, 3.E Responsiveness & Layout Mechanics, 3.F Dependency Verification (mandatory)

### Community 75 - "6. PERFORMANCE & ACCESSIBILITY GUARDRAILS"
Cohesion: 0.29
Nodes (7): 6.A Hardware Acceleration, 6.B Reduced Motion (mandatory), 6.C Dark Mode (mandatory for any consumer-facing page), 6.D Core Web Vitals Targets, 6.E DOM Cost, 6.F Z-Index Restraint, 6. PERFORMANCE & ACCESSIBILITY GUARDRAILS

### Community 76 - "image-to-code — implement the reference boards faithfully (Phase 3)"
Cohesion: 0.29
Nodes (6): Ambiguity resolution (in order), Anti-drift rules (during implementation), Bespoke chrome (hard rule, gate-checked), Deep board analysis (per section, BEFORE coding it), image-to-code — implement the reference boards faithfully (Phase 3), Structural hygiene

### Community 77 - "Required Fields Per Schema Type"
Cohesion: 0.29
Nodes (7): FAQPage, Organization, Product, ProfessionalService, Required Fields Per Schema Type, SoftwareApplication, WebSite

### Community 78 - "app-layouts — the standard Higgsfield app layouts (`type: "app"` builds ONLY)"
Cohesion: 0.33
Nodes (5): app-layouts — the standard Higgsfield app layouts (`type: "app"` builds ONLY), Cross-template acceptance outcomes (after clone), Invariants (every layout), Reusable UI components (`app/src/components/`), The six layouts (`app/src/layouts/`)

### Community 79 - "App contest — how to enter, and how it shapes the build"
Cohesion: 0.33
Nodes (5): App contest — how to enter, and how it shapes the build, Eligibility (relay if asked), Entering — `higgsfield website contest` (it publishes for you), How entering shapes what you build (bake this in from the start), What it is

### Community 80 - "SEO"
Cohesion: 0.33
Nodes (5): Audit, Fix-and-Recheck Loop, Output Format, SEO, When to Run

### Community 81 - "Schema markup"
Cohesion: 0.33
Nodes (6): Complete Example: Agency Site, Pitfalls, Reusable Component, Schema markup, Schema Type Decision Matrix, Usage Pattern

### Community 82 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 83 - "Photography asset audit"
Cohesion: 0.33
Nodes (5): Delivery rules, Duplicate findings, Library summary, Photography asset audit, Selection decisions

### Community 84 - "asset-system — the Higgsfield-generated visual system (Phase 2)"
Cohesion: 0.40
Nodes (4): asset-system — the Higgsfield-generated visual system (Phase 2), Rules, The asset kit (generate per tier; palette-locked to the boards), The personalization ladder — generate what the user doesn't have

### Community 85 - "0. BRIEF INFERENCE (Read the Room Before Anything Else)"
Cohesion: 0.40
Nodes (5): 0.A Read these signals first, 0.B Output a one-line "Design Read" before generating, 0. BRIEF INFERENCE (Read the Room Before Anything Else), 0.C If the brief is ambiguous, ask one question, do not guess, 0.D Anti-Default Discipline

### Community 86 - "12. THE BLOCK LIBRARY (Contract - Implementations Land Here Iteratively)"
Cohesion: 0.40
Nodes (5): 12.A File Location, 12.B Required Frontmatter, 12.C Required Body Sections, 12.D Block-Library Discipline, 12. THE BLOCK LIBRARY (Contract - Implementations Land Here Iteratively)

### Community 87 - "5. CONTEXT-AWARE PROACTIVITY"
Cohesion: 0.40
Nodes (5): 5.A Sticky-Stack - Canonical Skeleton, 5.B Horizontal-Pan - Canonical Skeleton, 5.C Scroll-Reveal Stagger - Canonical Skeleton (lighter alternative), 5. CONTEXT-AWARE PROACTIVITY, 5.D Forbidden Animation Patterns

### Community 88 - "8. DARK MODE PROTOCOL"
Cohesion: 0.40
Nodes (5): 8.A Token Strategy (pick one, stick to it), 8.B Do Not Prescribe Specific Colors Here, 8.C Default Mode, 8.D Test in Both Modes Before Finishing, 8. DARK MODE PROTOCOL

### Community 89 - "7. DIAL DEFINITIONS (Technical Reference)"
Cohesion: 0.50
Nodes (4): 7. DIAL DEFINITIONS (Technical Reference), DESIGN_VARIANCE (Level 1-10), MOTION_INTENSITY (Level 1-10), VISUAL_DENSITY (Level 1-10)

### Community 90 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 91 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 92 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

## Knowledge Gaps
- **709 isolated node(s):** `lintStagedConfig`, `withNextIntl`, `nextConfig`, `name`, `version` (+704 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **21 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `sharp` connect `scripts` to `structured-data.ts`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **What connects `lintStagedConfig`, `withNextIntl`, `nextConfig` to the rest of the system?**
  _709 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `isLocale` be split into smaller, more focused modules?**
  _Cohesion score 0.09185329438493996 - nodes in this community are weakly interconnected._
- **Should `structured-data.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06771929824561404 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.046511627906976744 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.046511627906976744 - nodes in this community are weakly interconnected._
- **Should `videos.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14761904761904762 - nodes in this community are weakly interconnected._