import type { Locale } from "@/config/site";
import type { PortfolioCategory } from "@/types/content";

export const categoryOrder: PortfolioCategory[] = [
  "weddings",
  "events",
  "hospitality",
  "food",
];

const labels: Record<PortfolioCategory, Record<Locale, string>> = {
  weddings: { fr: "Mariages", en: "Weddings", ar: "حفلات الزفاف" },
  events: { fr: "Événements", en: "Events", ar: "الفعاليات" },
  corporate: { fr: "Corporate", en: "Corporate", ar: "الشركات" },
  hospitality: {
    fr: "Hôtellerie & Airbnb",
    en: "Hospitality & Airbnb",
    ar: "الضيافة وAirbnb",
  },
  food: { fr: "Gastronomie", en: "Food", ar: "الأطعمة" },
  products: { fr: "Produits", en: "Products", ar: "المنتجات" },
  portraits: { fr: "Portraits", en: "Portraits", ar: "الصور الشخصية" },
  video: { fr: "Vidéo", en: "Video", ar: "الفيديو" },
};

export function categoryLabel(category: PortfolioCategory, locale: Locale) {
  return labels[category][locale];
}

export function isPortfolioCategory(
  value: string | null,
): value is PortfolioCategory {
  return value !== null && categoryOrder.includes(value as PortfolioCategory);
}
