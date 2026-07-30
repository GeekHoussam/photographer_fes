export type ServiceMedia = {
  hero: string;
  secondary: string;
};

const mediaBySlug: Record<string, ServiceMedia> = {
  "wedding-photography": {
    hero: "/images/portfolio/weddings/Photographe_mariage_fes.webp",
    secondary: "/images/portfolio/weddings/0F2A6875.webp",
  },
  "event-photography": {
    hero: "/images/portfolio/events/DSC02378.webp",
    secondary: "/images/portfolio/events/IMG_0006.webp",
  },
  "corporate-photography": {
    hero: "/images/portfolio/events/DSC02377.webp",
    secondary: "/images/portfolio/events/IMG_0255-Enhanced-NR.webp",
  },
  "product-photography": {
    hero: "/images/portfolio/food/DSC02493.webp",
    secondary: "/images/portfolio/food/DSC02443.webp",
  },
  "food-photography": {
    hero: "/images/portfolio/food/DSC02457.webp",
    secondary: "/images/portfolio/food/DSC02504.webp",
  },
  "hospitality-photography": {
    hero: "/images/portfolio/interiors/DSC02171.webp",
    secondary: "/images/portfolio/interiors/DSC01925.webp",
  },
  "portrait-photography": {
    hero: "/images/portfolio/weddings/Photographe_mariage_fes.webp",
    secondary: "/images/portfolio/events/IMG_0124-Enhanced-NR.webp",
  },
  "video-production": {
    hero: "/images/portfolio/events/DSC02378.webp",
    secondary: "/images/portfolio/food/DSC02470.webp",
  },
};

export function serviceMedia(slug: string): ServiceMedia {
  return mediaBySlug[slug] ?? mediaBySlug["event-photography"]!;
}
