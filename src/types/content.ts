import type { Locale } from "@/config/site";

export type LocalizedText = Record<Locale, string>;

export type LocalizedFaq = {
  question: LocalizedText;
  answer: LocalizedText;
};

export type PhotoAsset = {
  src: string;
  width: number;
  height: number;
  alt: LocalizedText;
};

export type PortfolioCategory =
  | "weddings"
  | "events"
  | "corporate"
  | "hospitality"
  | "food"
  | "products"
  | "portraits"
  | "video";

export type ProjectSummary = {
  slug: string;
  title: LocalizedText;
  category: PortfolioCategory;
  categoryLabel: LocalizedText;
  location: string;
  summary: LocalizedText;
  description: LocalizedText;
  featured: boolean;
  mediaType: "photos" | "videos";
  aspect: "portrait" | "landscape" | "square";
  cover: PhotoAsset;
  gallery: PhotoAsset[];
};

export type ServiceSummary = {
  slug: string;
  title: LocalizedText;
  introduction: LocalizedText;
  overviewTitle: LocalizedText;
  overview: LocalizedText;
  planningPoints: LocalizedText[];
  faqs: LocalizedFaq[];
  relatedProjectSlug?: string;
};
