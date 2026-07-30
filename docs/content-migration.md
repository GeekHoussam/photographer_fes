# Content migration

The current WordPress site is a reference only. Do not copy its code or automatically republish media.

1. Inventory existing URLs, page titles, locale, media ownership, and search performance.
2. Obtain written confirmation that each photo, film, logo, and testimonial may be migrated.
3. Map approved content to Sanity documents; normalize categories and services rather than copying page-builder structure.
4. Write French and English editorial fields separately. Use French as the explicit fallback when an English field is unavailable.
5. Import original media, not compressed thumbnails. Add alt text, caption, credit, hotspot, and project metadata.
6. Review draft documents with Mohammed before publishing.
7. Add verified old-to-new paths to `src/config/redirects.ts` and test them in preview.
8. Crawl the preview for missing media, broken links, accidental placeholders, and indexability before DNS changes.
