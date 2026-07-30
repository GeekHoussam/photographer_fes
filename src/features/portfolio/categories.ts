import type { Locale } from "@/config/site";
import type { PortfolioCategory } from "@/types/content";

export const categoryOrder: PortfolioCategory[] = [
  "weddings",
  "events",
  "hospitality",
  "food",
];

const labels: Record<PortfolioCategory, Record<Locale, string>> = {
  weddings: { fr: "Mariages", en: "Weddings" },
  events: { fr: "Événements", en: "Events" },
  corporate: { fr: "Corporate", en: "Corporate" },
  hospitality: { fr: "Hôtellerie & Airbnb", en: "Hospitality & Airbnb" },
  food: { fr: "Gastronomie", en: "Food" },
  products: { fr: "Produits", en: "Products" },
  portraits: { fr: "Portraits", en: "Portraits" },
  video: { fr: "Vidéo", en: "Video" },
};

export function categoryLabel(category: PortfolioCategory, locale: Locale) {
  return labels[category][locale];
}

export function isPortfolioCategory(
  value: string | null,
): value is PortfolioCategory {
  return value !== null && categoryOrder.includes(value as PortfolioCategory);
}
