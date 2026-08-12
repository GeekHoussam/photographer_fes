import type { LocalizedText } from "@/types/content";

export type ServiceMedia = {
  hero: string;
  secondary: string;
  heroAlt: LocalizedText;
  secondaryAlt: LocalizedText;
};

const mediaBySlug: Record<string, ServiceMedia> = {
  "wedding-photography": {
    hero: "/images/portfolio/weddings/Photographe_mariage_fes.webp",
    secondary: "/images/portfolio/weddings/0F2A6875.webp",
    heroAlt: {
      fr: "Portrait rapproché d’un couple le jour de son mariage à Fès",
      en: "Close portrait of a couple on their wedding day in Fès",
    },
    secondaryAlt: {
      fr: "Bouquet de fleurs blanches tenu par la mariée",
      en: "White bridal bouquet held by the bride",
    },
  },
  "event-photography": {
    hero: "/images/portfolio/events/DSC02378.webp",
    secondary: "/images/portfolio/events/IMG_0006.webp",
    heroAlt: {
      fr: "Vue large d’une table ronde institutionnelle",
      en: "Wide view of an institutional panel discussion",
    },
    secondaryAlt: {
      fr: "Échange entre invités pendant une réception",
      en: "Conversation between guests during a reception",
    },
  },
  "corporate-photography": {
    hero: "/images/portfolio/events/DSC02377.webp",
    secondary: "/images/portfolio/events/IMG_0255-Enhanced-NR.webp",
    heroAlt: {
      fr: "Intervenant prenant la parole devant un public",
      en: "Speaker addressing an audience",
    },
    secondaryAlt: {
      fr: "Détail de mains signant un document officiel",
      en: "Close detail of hands signing an official document",
    },
  },
  "product-photography": {
    hero: "/images/portfolio/food/DSC02493.webp",
    secondary: "/images/portfolio/food/DSC02443.webp",
    heroAlt: {
      fr: "Assiette marocaine aux légumes et condiments colorés",
      en: "Moroccan plate with colourful vegetables and condiments",
    },
    secondaryAlt: {
      fr: "Boisson fraîche à l’orange servie en terrasse",
      en: "Fresh orange drink served on a terrace",
    },
  },
  "food-photography": {
    hero: "/images/portfolio/food/DSC02457.webp",
    secondary: "/images/portfolio/food/DSC02504.webp",
    heroAlt: {
      fr: "Chef devant une flambée en cuisine ouverte",
      en: "Chef standing behind a flame in an open kitchen",
    },
    secondaryAlt: {
      fr: "Table de déjeuner marocaine entièrement dressée",
      en: "Fully set Moroccan lunch table",
    },
  },
  "hospitality-photography": {
    hero: "/images/portfolio/interiors/DSC02171.webp",
    secondary: "/images/portfolio/interiors/DSC01925.webp",
    heroAlt: {
      fr: "Cour intérieure ornée de zellige et de plâtre sculpté à Fès",
      en: "Interior courtyard with zellige and carved plaster in Fès",
    },
    secondaryAlt: {
      fr: "Chambre lumineuse avec détails artisanaux marocains",
      en: "Bright bedroom with Moroccan craft details",
    },
  },
  "portrait-photography": {
    hero: "/images/portfolio/weddings/Photographe_mariage_fes.webp",
    secondary: "/images/portfolio/events/IMG_0124-Enhanced-NR.webp",
    heroAlt: {
      fr: "Portrait rapproché d’un couple le jour de son mariage à Fès",
      en: "Close portrait of a couple on their wedding day in Fès",
    },
    secondaryAlt: {
      fr: "Portrait d’un lauréat après une remise de prix",
      en: "Portrait of a recipient after an award presentation",
    },
  },
  "video-production": {
    hero: "/images/portfolio/events/DSC02378.webp",
    secondary: "/images/portfolio/food/DSC02470.webp",
    heroAlt: {
      fr: "Vue large d’une table ronde institutionnelle",
      en: "Wide view of an institutional panel discussion",
    },
    secondaryAlt: {
      fr: "Cuisinière travaillant devant une flamme vive",
      en: "Cook working in front of a vivid flame",
    },
  },
};

export function serviceMedia(slug: string): ServiceMedia {
  return mediaBySlug[slug] ?? mediaBySlug["event-photography"]!;
}
