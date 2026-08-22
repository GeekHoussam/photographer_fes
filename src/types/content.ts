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

export type JournalRichTextSegment =
  | string
  | {
      text: string;
      emphasis: "strong" | "em";
    };

export type JournalRichText = ReadonlyArray<JournalRichTextSegment>;

export type JournalBodyBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; content: JournalRichText }
  | { type: "list"; items: ReadonlyArray<JournalRichText> }
  | { type: "image"; imageIndex: 1 | 2 }
  | { type: "videos"; videoIndexes: ReadonlyArray<number> };

export type JournalVideo = {
  videoId: string;
  youtubeUrl: string;
  aspect: "landscape" | "portrait";
  label: LocalizedText;
};

export type JournalLocaleContent = {
  title: string;
  summary: string;
  metaTitle: string;
  metaDescription: string;
  body: ReadonlyArray<JournalBodyBlock>;
  faqIntroduction: string;
  faqs: ReadonlyArray<{ question: string; answer: JournalRichText }>;
  contactTitle: string;
  contactParagraphs: ReadonlyArray<JournalRichText>;
  contactAction: string;
};

export type JournalArticle = {
  slug: string;
  order: number;
  author: string;
  publishedAt?: string;
  modifiedAt?: string;
  images: readonly [PhotoAsset, PhotoAsset, PhotoAsset];
  videos: ReadonlyArray<JournalVideo>;
  content: Record<Locale, JournalLocaleContent>;
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
  location: LocalizedText;
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
