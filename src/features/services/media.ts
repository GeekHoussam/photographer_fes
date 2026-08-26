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
      en: "Close portrait of a couple on their wedding day in Fez",
      ar: "صورة مقربة لعروسين يوم زفافهما في فاس",
    },
    secondaryAlt: {
      fr: "Bouquet de fleurs blanches tenu par la mariée",
      en: "White bridal bouquet held by the bride",
      ar: "باقة زهور بيضاء تحملها العروس",
    },
  },
  "event-photography": {
    hero: "/images/portfolio/events/DSC02378.webp",
    secondary: "/images/portfolio/events/IMG_0006.webp",
    heroAlt: {
      fr: "Vue large d’une table ronde institutionnelle",
      en: "Wide view of an institutional panel discussion",
      ar: "لقطة واسعة لطاولة مستديرة مؤسساتية",
    },
    secondaryAlt: {
      fr: "Échange entre invités pendant une réception",
      en: "Conversation between guests during a reception",
      ar: "حديث بين ضيوف خلال حفل استقبال",
    },
  },
  "corporate-photography": {
    hero: "/images/portfolio/events/DSC02377.webp",
    secondary: "/images/portfolio/events/IMG_0255-Enhanced-NR.webp",
    heroAlt: {
      fr: "Intervenant prenant la parole devant un public",
      en: "Speaker addressing an audience",
      ar: "متحدث يلقي كلمة أمام جمهور",
    },
    secondaryAlt: {
      fr: "Détail de mains signant un document officiel",
      en: "Close detail of hands signing an official document",
      ar: "لقطة مقربة ليدين توقعان وثيقة رسمية",
    },
  },
  "product-photography": {
    hero: "/images/portfolio/food/DSC02493.webp",
    secondary: "/images/portfolio/food/DSC02443.webp",
    heroAlt: {
      fr: "Assiette marocaine aux légumes et condiments colorés",
      en: "Moroccan plate with colourful vegetables and condiments",
      ar: "طبق مغربي بخضراوات وتوابل ملونة",
    },
    secondaryAlt: {
      fr: "Boisson fraîche à l’orange servie en terrasse",
      en: "Fresh orange drink served on a terrace",
      ar: "مشروب برتقال منعش مقدم على شرفة",
    },
  },
  "food-photography": {
    hero: "/images/portfolio/food/DSC02457.webp",
    secondary: "/images/portfolio/food/DSC02504.webp",
    heroAlt: {
      fr: "Chef devant une flambée en cuisine ouverte",
      en: "Chef standing behind a flame in an open kitchen",
      ar: "طاه يقف خلف لهب في مطبخ مفتوح",
    },
    secondaryAlt: {
      fr: "Table de déjeuner marocaine entièrement dressée",
      en: "Fully set Moroccan lunch table",
      ar: "مائدة غداء مغربية مكتملة الإعداد",
    },
  },
  "hospitality-photography": {
    hero: "/images/portfolio/interiors/DSC02171.webp",
    secondary: "/images/portfolio/interiors/DSC01925.webp",
    heroAlt: {
      fr: "Cour intérieure ornée de zellige et de plâtre sculpté à Fès",
      en: "Interior courtyard with zellige and carved plaster in Fez",
      ar: "فناء داخلي مزين بالزليج والجبس المنقوش في فاس",
    },
    secondaryAlt: {
      fr: "Chambre lumineuse avec détails artisanaux marocains",
      en: "Bright bedroom with Moroccan craft details",
      ar: "غرفة نوم مضيئة بتفاصيل حرفية مغربية",
    },
  },
  "portrait-photography": {
    hero: "/images/portfolio/weddings/Photographe_mariage_fes.webp",
    secondary: "/images/portfolio/events/IMG_0124-Enhanced-NR.webp",
    heroAlt: {
      fr: "Portrait rapproché d’un couple le jour de son mariage à Fès",
      en: "Close portrait of a couple on their wedding day in Fez",
      ar: "صورة مقربة لعروسين يوم زفافهما في فاس",
    },
    secondaryAlt: {
      fr: "Portrait d’un lauréat après une remise de prix",
      en: "Portrait of a recipient after an award presentation",
      ar: "صورة شخصية لفائز بعد حفل توزيع جوائز",
    },
  },
  "video-production": {
    hero: "/images/portfolio/events/DSC02378.webp",
    secondary: "/images/portfolio/food/DSC02470.webp",
    heroAlt: {
      fr: "Vue large d’une table ronde institutionnelle",
      en: "Wide view of an institutional panel discussion",
      ar: "لقطة واسعة لطاولة مستديرة مؤسساتية",
    },
    secondaryAlt: {
      fr: "Cuisinière travaillant devant une flamme vive",
      en: "Cook working in front of a vivid flame",
      ar: "طاهية تعمل أمام لهب متقد",
    },
  },
};

export function serviceMedia(slug: string): ServiceMedia {
  return mediaBySlug[slug] ?? mediaBySlug["event-photography"]!;
}
