import type { Locale } from "@/config/site";

export const videoCategoryDefinitions = [
  {
    slug: "commercial-advertising",
    workbookCategory: "Commercial / Advertising",
    label: {
      fr: "Commercial / Publicité",
      en: "Commercial / Advertising",
      ar: "إعلان تجاري",
    },
  },
  {
    slug: "corporate-event",
    workbookCategory: "Corporate Event",
    label: {
      fr: "Événement corporate",
      en: "Corporate Event",
      ar: "فعالية للشركات",
    },
  },
  {
    slug: "corporate-film",
    workbookCategory: "Corporate Film",
    label: {
      fr: "Film corporate",
      en: "Corporate Film",
      ar: "فيلم للشركات",
    },
  },
  {
    slug: "documentary",
    workbookCategory: "Documentary",
    label: { fr: "Documentaire", en: "Documentary", ar: "وثائقي" },
  },
  {
    slug: "event",
    workbookCategory: "Event",
    label: { fr: "Événement", en: "Event", ar: "فعالية" },
  },
  {
    slug: "showreel",
    workbookCategory: "Showreel",
    label: { fr: "Showreel", en: "Showreel", ar: "شريط استعراضي" },
  },
  {
    slug: "travel",
    workbookCategory: "Travel",
    label: { fr: "Voyage", en: "Travel", ar: "سفر" },
  },
  {
    slug: "music-video",
    workbookCategory: "Video Clip / Music Video",
    label: {
      fr: "Clip vidéo / Vidéo musicale",
      en: "Video Clip / Music Video",
      ar: "فيديو كليب / فيديو موسيقي",
    },
  },
  {
    slug: "wedding",
    workbookCategory: "Wedding",
    label: { fr: "Mariage", en: "Wedding", ar: "حفل زفاف" },
  },
] as const;

export type VideoCategory = (typeof videoCategoryDefinitions)[number]["slug"];
export type VideoContentType = "long-form" | "short";
type ThumbnailQuality = "maxresdefault" | "sddefault" | "hqdefault";

export type PortfolioVideo = {
  title: string;
  titleByLocale: Record<Locale, string>;
  videoId: string;
  youtubeUrl: string;
  category: VideoCategory;
  workbookCategory: (typeof videoCategoryDefinitions)[number]["workbookCategory"];
  thumbnailUrl: string;
  contentType: VideoContentType;
};

type SourceVideo = readonly [
  title: string,
  videoId: string,
  category: VideoCategory,
  contentType: VideoContentType,
  thumbnailQuality: ThumbnailQuality,
];

// Generated from nomfilms_youtube_video_inventory.xlsx in workbook order.
const sourceVideos = [
  [
    "Smedian 2025 - Photographe des Événements au Maroc",
    "hwRnxpTd0Sw",
    "event",
    "long-form",
    "maxresdefault",
  ],
  [
    "Wedding Video Editor - Lisa & Fabien 4K",
    "0SQLAEjS8rg",
    "wedding",
    "long-form",
    "maxresdefault",
  ],
  [
    "Wedding Video Editor - Vanessa & Sylvain 4K",
    "yG7k5c7H0TQ",
    "wedding",
    "long-form",
    "maxresdefault",
  ],
  [
    "Belgium Queen In Casablanca",
    "Oc5_dA0wNbc",
    "event",
    "long-form",
    "maxresdefault",
  ],
  [
    "Film Institutionnel Maroc - ITSA SH (analyses physico-chimiques)",
    "eo6C0Xbxm0g",
    "corporate-film",
    "long-form",
    "maxresdefault",
  ],
  [
    "Soutenance Doctorate Maroc - Multi-camera",
    "fNeOPXDlj-c",
    "event",
    "long-form",
    "maxresdefault",
  ],
  [
    "INWI - WORKING TOGETHER | Best Of",
    "VJlS_f4391s",
    "corporate-event",
    "long-form",
    "maxresdefault",
  ],
  [
    "EFA - Remise Des Diplômes 2018 | NOM Films",
    "5R2yrSbta6E",
    "event",
    "long-form",
    "maxresdefault",
  ],
  [
    "Wedding Filmmaker Morocco - Widad & Anas",
    "pgkUHijHiPc",
    "wedding",
    "long-form",
    "maxresdefault",
  ],
  [
    "EHTP ENTREPRISES 2018 - Best Of",
    "gz4gsmoSbXo",
    "corporate-event",
    "long-form",
    "maxresdefault",
  ],
  [
    "NOM FILMS 2020 Compilation",
    "_krTO4_MECg",
    "showreel",
    "long-form",
    "maxresdefault",
  ],
  [
    "الرابطة المحمدية للعلماء - الكلمة الافتتاحية للمنتدى الاقليمي - ا.د احمد عبادي",
    "BAn5dW6SQhM",
    "event",
    "long-form",
    "maxresdefault",
  ],
  [
    "Film Événementiel Maroc - Tournée INWI Business x CFCIM",
    "M1A0xXfhSJc",
    "corporate-event",
    "long-form",
    "sddefault",
  ],
  [
    "المعاهد الفلاحية بجهة خنيفرة - بني ملال",
    "m13WS5HmRSw",
    "corporate-film",
    "long-form",
    "maxresdefault",
  ],
  [
    "Morocco Trip 2023 - ADAMA | by NOM Films",
    "jJ_Hd2FnfBk",
    "travel",
    "long-form",
    "maxresdefault",
  ],
  [
    "Ummah Relief Supporting Moroccans Under Earthquake - by NOM Films",
    "EPsGVE1K9Z4",
    "documentary",
    "long-form",
    "hqdefault",
  ],
  [
    "Association Droit et justice - Mdiq Event Best Of",
    "j41rP5oVH34",
    "event",
    "long-form",
    "maxresdefault",
  ],
  [
    "Best Of MAROC WEB FTOUR - Ftour Ramadan avec Amine Raghib à Fès",
    "XPqQsqrK83Y",
    "corporate-event",
    "long-form",
    "maxresdefault",
  ],
  [
    "Sodap Maroc x Super Cérame | BEST OF Compétition National",
    "phuGhBW6lfI",
    "corporate-event",
    "long-form",
    "maxresdefault",
  ],
  [
    "Orange x Sofrecom - BEST OF",
    "qLhCXIvQOa8",
    "corporate-event",
    "long-form",
    "maxresdefault",
  ],
  [
    "Docker Motocycles - Journée des revendeurs 2019 - Best of",
    "ATPE1M7cf6w",
    "corporate-event",
    "long-form",
    "maxresdefault",
  ],
  [
    "Morocco Cinematic Showcase - NOM FILMS",
    "oS5dLwFFseA",
    "showreel",
    "long-form",
    "maxresdefault",
  ],
  [
    "Cremai 2023 - Lesaffre Maroc | NOM Films",
    "HnID1mKUrxg",
    "corporate-event",
    "long-form",
    "maxresdefault",
  ],
  [
    "احمد السعيد - شحال غزالة (فيديو كليب حصري)",
    "eemIo-p32_c",
    "music-video",
    "long-form",
    "maxresdefault",
  ],
  [
    "CREDIT DU MAROC - Film Événementiel (BEST OF)",
    "wYD_2Hi7XFc",
    "corporate-event",
    "long-form",
    "maxresdefault",
  ],
  [
    "SPAB Maroc - Etapes de Production - Film Entreprise",
    "gfPBbFgK1GE",
    "corporate-film",
    "long-form",
    "maxresdefault",
  ],
  [
    "MAZARS Best of Formation  - By NOM FILMS",
    "vdKDtVcRKcE",
    "corporate-event",
    "long-form",
    "sddefault",
  ],
  [
    "FILM PUBLICITAIRE - VROOM - by NOM FILMS",
    "AxG6DcoIGfQ",
    "commercial-advertising",
    "long-form",
    "maxresdefault",
  ],
  [
    "FILM INSTITUTIONNEL au Maroc",
    "wFmxkMxjINs",
    "corporate-film",
    "long-form",
    "maxresdefault",
  ],
  [
    "Festival national des arts de la rue la 3eme Edition Fès - by NOM FILMS",
    "sevSTusXx6c",
    "event",
    "long-form",
    "maxresdefault",
  ],
  [
    "FILM CORPORATE | GIANTLINK - by NOM FILMS",
    "oLs8aa-z5Ro",
    "corporate-film",
    "long-form",
    "maxresdefault",
  ],
  [
    "MOROCCAN DOCUMENTARY - NEJMA (TRUE STORY)",
    "XxmZcJGFnM8",
    "documentary",
    "long-form",
    "maxresdefault",
  ],
  [
    "CFCIM x Soirée 1000e de conjoncture - NOM FILMS",
    "cGewLNvFHRs",
    "corporate-event",
    "long-form",
    "maxresdefault",
  ],
  [
    "SHOWCASE 2020 - NOM FILMS",
    "6IvFhB1KiII",
    "showreel",
    "long-form",
    "maxresdefault",
  ],
  [
    "This is MOROCCO under CoronaVirus - Cinematography",
    "ZnyEmw-TlxQ",
    "documentary",
    "long-form",
    "maxresdefault",
  ],
  [
    "Morocco Cinematography - Travel in Morocco 2020",
    "CPEDCDXkiQw",
    "travel",
    "long-form",
    "maxresdefault",
  ],
  [
    "الرابطة المحمدية للعلماء 2019",
    "XtqmKDqIWeo",
    "event",
    "long-form",
    "hqdefault",
  ],
  [
    "Restaurant Benthai Fes - Showreel",
    "WB6RlTIxtEA",
    "commercial-advertising",
    "short",
    "maxresdefault",
  ],
  [
    "Fez Medina Rooftop - POV VIDEO",
    "e7CMRHCQVqQ",
    "commercial-advertising",
    "short",
    "maxresdefault",
  ],
  [
    "Restaurant Benthai - Les Deux Ftour - Japonais et Thai",
    "_eECOnRUsEY",
    "commercial-advertising",
    "short",
    "maxresdefault",
  ],
  [
    "Restaurant Benthai - Ramadan Ftour Thailand's",
    "MkdqPhVj0B4",
    "commercial-advertising",
    "short",
    "maxresdefault",
  ],
  [
    "Restaurant Benthai - Ramadan Ftour Japonais",
    "2HNDtgh8cQE",
    "commercial-advertising",
    "short",
    "maxresdefault",
  ],
  [
    "Fez Medina Rooftop - Jus d'ORANGE",
    "D3-Y-Iipomo",
    "commercial-advertising",
    "short",
    "maxresdefault",
  ],
  [
    "Fez Medina Rooftop - Jus 1",
    "Yv7AHKH1Eck",
    "commercial-advertising",
    "short",
    "maxresdefault",
  ],
] as const satisfies readonly SourceVideo[];

const arabicTitleByVideoId = {
  hwRnxpTd0Sw: "Smedian 2025 — مصور فعاليات في المغرب",
  "0SQLAEjS8rg": "مونتاج فيديو زفاف — Lisa وFabien 4K",
  yG7k5c7H0TQ: "مونتاج فيديو زفاف — Vanessa وSylvain 4K",
  Oc5_dA0wNbc: "ملكة بلجيكا في الدار البيضاء",
  eo6C0Xbxm0g: "فيلم مؤسساتي في المغرب — ITSA SH (تحاليل فيزيائية وكيميائية)",
  "fNeOPXDlj-c": "مناقشة أطروحة دكتوراه في المغرب — تصوير متعدد الكاميرات",
  VJlS_f4391s: "INWI — العمل معًا | أفضل اللقطات",
  "5R2yrSbta6E": "EFA — حفل تخرج 2018 | NOM Films",
  pgkUHijHiPc: "صانع أفلام زفاف في المغرب — Widad وAnas",
  gz4gsmoSbXo: "EHTP ENTREPRISES 2018 — أفضل اللقطات",
  _krTO4_MECg: "تجميعة NOM FILMS لعام 2020",
  BAn5dW6SQhM:
    "الرابطة المحمدية للعلماء - الكلمة الافتتاحية للمنتدى الاقليمي - ا.د احمد عبادي",
  M1A0xXfhSJc: "فيلم فعالية في المغرب — جولة INWI Business وCFCIM",
  m13WS5HmRSw: "المعاهد الفلاحية بجهة خنيفرة - بني ملال",
  jJ_Hd2FnfBk: "رحلة في المغرب 2023 — ADAMA | من إنتاج NOM Films",
  EPsGVE1K9Z4:
    "Ummah Relief تدعم المتضررين من الزلزال في المغرب — من إنتاج NOM Films",
  j41rP5oVH34: "جمعية الحق والعدالة — أفضل لقطات فعالية المضيق",
  XPqQsqrK83Y: "أفضل لقطات MAROC WEB FTOUR — فطور رمضان مع Amine Raghib في فاس",
  phuGhBW6lfI: "Sodap Maroc وSuper Cérame | أفضل لقطات المسابقة الوطنية",
  qLhCXIvQOa8: "Orange وSofrecom — أفضل اللقطات",
  ATPE1M7cf6w: "Docker Motocycles — يوم الموزعين 2019 — أفضل اللقطات",
  oS5dLwFFseA: "عرض سينمائي للمغرب — NOM FILMS",
  HnID1mKUrxg: "فعالية Cremai 2023 — Lesaffre Maroc | NOM Films",
  "eemIo-p32_c": "احمد السعيد - شحال غزالة (فيديو كليب حصري)",
  wYD_2Hi7XFc: "CREDIT DU MAROC — فيلم فعالية (أفضل اللقطات)",
  gfPBbFgK1GE: "SPAB Maroc — مراحل الإنتاج — فيلم شركة",
  vdKDtVcRKcE: "MAZARS — أفضل لقطات التدريب — من إنتاج NOM FILMS",
  AxG6DcoIGfQ: "فيلم إعلاني — VROOM — من إنتاج NOM FILMS",
  wFmxkMxjINs: "فيلم مؤسساتي في المغرب",
  sevSTusXx6c:
    "المهرجان الوطني لفنون الشارع، الدورة الثالثة في فاس — من إنتاج NOM FILMS",
  "oLs8aa-z5Ro": "فيلم للشركات | GIANTLINK — من إنتاج NOM FILMS",
  XxmZcJGFnM8: "وثائقي مغربي — NEJMA (قصة حقيقية)",
  cGewLNvFHRs: "CFCIM — الأمسية الاقتصادية رقم 1000 — NOM FILMS",
  "6IvFhB1KiII": "شريط استعراضي 2020 — NOM FILMS",
  "ZnyEmw-TlxQ": "المغرب في ظل فيروس كورونا — تصوير سينمائي",
  CPEDCDXkiQw: "تصوير سينمائي للمغرب — رحلة في المغرب 2020",
  XtqmKDqIWeo: "الرابطة المحمدية للعلماء 2019",
  WB6RlTIxtEA: "مطعم Benthai فاس — شريط استعراضي",
  e7CMRHCQVqQ: "سطح المدينة العتيقة في فاس — فيديو من منظور الشخص الأول",
  _eECOnRUsEY: "مطعم Benthai — إفطاران ياباني وتايلاندي",
  MkdqPhVj0B4: "مطعم Benthai — إفطار رمضان التايلاندي",
  "2HNDtgh8cQE": "مطعم Benthai — إفطار رمضان الياباني",
  "D3-Y-Iipomo": "سطح المدينة العتيقة في فاس — عصير برتقال",
  Yv7AHKH1Eck: "سطح المدينة العتيقة في فاس — عصير 1",
} satisfies Record<(typeof sourceVideos)[number][1], string>;

const definitionBySlug = new Map(
  videoCategoryDefinitions.map((definition) => [definition.slug, definition]),
);

export const videoCategoryOrder = videoCategoryDefinitions.map(
  ({ slug }) => slug,
);

export function getVideoEmbedUrl(videoId: string) {
  return `https://www.youtube-nocookie.com/embed/${videoId}`;
}

export function getVideoThumbnailUrl(
  videoId: string,
  quality: ThumbnailQuality = "hqdefault",
) {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

export const portfolioVideos: PortfolioVideo[] = sourceVideos.map(
  ([title, videoId, category, contentType, thumbnailQuality]) => {
    const definition = definitionBySlug.get(category);
    if (!definition) throw new Error(`Unknown video category: ${category}`);

    return {
      title,
      titleByLocale: {
        fr: title,
        en: title.replace(/F(?:[èé]|e[\u0300\u0301])s/giu, "Fez"),
        ar: arabicTitleByVideoId[videoId],
      },
      videoId,
      youtubeUrl:
        contentType === "short"
          ? `https://www.youtube.com/shorts/${videoId}`
          : `https://www.youtube.com/watch?v=${videoId}`,
      category,
      workbookCategory: definition.workbookCategory,
      thumbnailUrl: getVideoThumbnailUrl(videoId, thumbnailQuality),
      contentType,
    };
  },
);

export function isVideoCategory(value: string | null): value is VideoCategory {
  return value !== null && videoCategoryOrder.includes(value as VideoCategory);
}

export function videoCategoryLabel(category: VideoCategory, locale: Locale) {
  return definitionBySlug.get(category)?.label[locale] ?? category;
}

export function filterPortfolioVideos(category: VideoCategory | null) {
  return category
    ? portfolioVideos.filter((video) => video.category === category)
    : portfolioVideos;
}
