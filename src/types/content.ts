import type { Locale } from "@/config/site";

export type LocalizedText = Record<Locale, string>;

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
  year: string;
  summary: LocalizedText;
  featured: boolean;
  aspect: "portrait" | "landscape" | "square";
  cover: PhotoAsset;
  gallery: PhotoAsset[];
};

export type ServiceSummary = {
  slug: string;
  title: LocalizedText;
  introduction: LocalizedText;
};
