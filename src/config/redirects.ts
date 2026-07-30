// Add verified legacy WordPress URL mappings here before launch.
export type LegacyRedirect = {
  source: string;
  destination: string;
  permanent: boolean;
};

export const legacyRedirects: LegacyRedirect[] = [
  {
    source: "/:locale(fr|en)/portfolio/editorial-wedding-placeholder",
    destination: "/:locale/portfolio/weddings-in-fes",
    permanent: true,
  },
  {
    source: "/:locale(fr|en)/portfolio/riad-hospitality-placeholder",
    destination: "/:locale/portfolio/moroccan-interiors",
    permanent: true,
  },
  {
    source: "/:locale(fr|en)/portfolio/culinary-story-placeholder",
    destination: "/:locale/portfolio/culinary-stories",
    permanent: true,
  },
  {
    source: "/:locale(fr|en)/portfolio/portrait-study-placeholder",
    destination: "/:locale/portfolio/weddings-in-fes",
    permanent: true,
  },
  {
    source: "/:locale(fr|en)/portfolio/brand-film-placeholder",
    destination: "/:locale/portfolio/conference-documentary",
    permanent: true,
  },
  {
    source: "/:locale(fr|en)/journal/article-placeholder",
    destination: "/:locale/journal",
    permanent: true,
  },
];
