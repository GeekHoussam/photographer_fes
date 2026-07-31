import type { PhotoAsset, ProjectSummary } from "@/types/content";

function photo(
  src: string,
  width: number,
  height: number,
  fr: string,
  en: string,
): PhotoAsset {
  return { src, width, height, alt: { fr, en } };
}

const weddings = [
  photo(
    "/images/portfolio/weddings/Photographe_mariage_fes.webp",
    4000,
    6000,
    "Portrait rapproché d'un couple le jour de son mariage à Fès",
    "Close portrait of a couple on their wedding day in Fès",
  ),
  photo(
    "/images/portfolio/weddings/0F2A6875.webp",
    2863,
    4295,
    "Bouquet de fleurs blanches tenu par la mariée",
    "White bridal bouquet held by the bride",
  ),
  photo(
    "/images/portfolio/weddings/0F2A6874.webp",
    4000,
    6000,
    "Mains du couple et bouquet pendant un portrait de mariage",
    "The couple's hands and bouquet during a wedding portrait",
  ),
];

const events = [
  photo(
    "/images/portfolio/events/DSC02355.webp",
    7008,
    4672,
    "Cérémonie de signature officielle lors d'un événement à Fès",
    "Official signing ceremony during an event in Fès",
  ),
  photo(
    "/images/portfolio/events/DSC02377.webp",
    7008,
    4672,
    "Intervenant prenant la parole devant le public",
    "Speaker addressing the audience",
  ),
  photo(
    "/images/portfolio/events/DSC02378.webp",
    7008,
    4672,
    "Vue large d'une table ronde institutionnelle",
    "Wide view of an institutional panel discussion",
  ),
  photo(
    "/images/portfolio/events/IMG_0006.webp",
    5644,
    3763,
    "Échange spontané entre invités pendant une réception",
    "Candid conversation between guests during a reception",
  ),
  photo(
    "/images/portfolio/events/IMG_0028-Enhanced-NR.webp",
    6240,
    4160,
    "Prise de parole devant un portrait officiel du roi du Maroc",
    "Speech in front of an official portrait of the King of Morocco",
  ),
  photo(
    "/images/portfolio/events/IMG_0124-Enhanced-NR.webp",
    5628,
    3752,
    "Lauréat souriant après une remise de prix",
    "Smiling recipient after an award presentation",
  ),
  photo(
    "/images/portfolio/events/IMG_0255-Enhanced-NR.webp",
    6240,
    4160,
    "Détail des mains signant un document officiel",
    "Close detail of hands signing an official document",
  ),
  photo(
    "/images/portfolio/events/IMG_0314-Enhanced-NR.webp",
    6240,
    4160,
    "Portrait collectif d'une promotion de diplômés",
    "Group portrait of a graduating class",
  ),
];

const hospitality = [
  photo(
    "/images/portfolio/interiors/DSC02171.webp",
    7020,
    4680,
    "Cour intérieure ornée de zellige et de plâtre sculpté à Fès",
    "Interior courtyard with zellige and carved plaster in Fès",
  ),
  photo(
    "/images/portfolio/interiors/DSC01919.webp",
    7020,
    4680,
    "Salle de réception traditionnelle aux boiseries sculptées",
    "Traditional reception room with carved woodwork",
  ),
  photo(
    "/images/portfolio/interiors/DSC01925.webp",
    7018,
    4678,
    "Chambre lumineuse avec détails artisanaux marocains",
    "Bright bedroom with Moroccan craft details",
  ),
  photo(
    "/images/portfolio/interiors/DSC01170.webp",
    4240,
    2832,
    "Chambre moderne photographiée en lumière naturelle",
    "Modern bedroom photographed in natural light",
  ),
  photo(
    "/images/portfolio/interiors/DSC01201.webp",
    4240,
    2832,
    "Espace repas ouvert aux lignes claires",
    "Open dining space with clean lines",
  ),
  photo(
    "/images/portfolio/interiors/DSC01209.webp",
    4240,
    2832,
    "Salon contemporain baigné de lumière",
    "Contemporary living room filled with light",
  ),
  photo(
    "/images/portfolio/interiors/DSC_7906-2.webp",
    6016,
    4016,
    "Chambre aux tons profonds et à l'éclairage doux",
    "Bedroom in deep tones with soft lighting",
  ),
  photo(
    "/images/portfolio/interiors/DSC_7923.webp",
    6016,
    4016,
    "Grand salon contemporain avec vue sur la salle à manger",
    "Large contemporary living room opening onto the dining area",
  ),
];

const food = [
  photo(
    "/images/portfolio/food/DSC02457.webp",
    4672,
    7008,
    "Chef devant une flambée en cuisine ouverte",
    "Chef standing behind a flame in an open kitchen",
  ),
  photo(
    "/images/portfolio/food/DSC02443.webp",
    4385,
    6578,
    "Boisson fraîche à l'orange servie en terrasse",
    "Fresh orange drink served on a terrace",
  ),
  photo(
    "/images/portfolio/food/DSC02445.webp",
    4492,
    6738,
    "Tables dressées sur une terrasse de restaurant à Fès",
    "Set tables on a restaurant terrace in Fès",
  ),
  photo(
    "/images/portfolio/food/DSC02448.webp",
    7008,
    4672,
    "Suite de tajines en terre cuite sur le passe",
    "Row of clay tagines along the kitchen pass",
  ),
  photo(
    "/images/portfolio/food/DSC02452.webp",
    4672,
    7008,
    "Chef préparant un plat dans la cuisine",
    "Chef preparing a dish in the kitchen",
  ),
  photo(
    "/images/portfolio/food/DSC02470.webp",
    4173,
    6259,
    "Cuisinière travaillant devant une flamme vive",
    "Cook working in front of a vivid flame",
  ),
  photo(
    "/images/portfolio/food/DSC02478.webp",
    5761,
    3841,
    "Ouverture de deux tajines au comptoir",
    "Opening two tagines at the counter",
  ),
  photo(
    "/images/portfolio/food/DSC02480.webp",
    7008,
    4672,
    "Plat marocain présenté dans un tajine en terre cuite",
    "Moroccan dish presented in a clay tagine",
  ),
  photo(
    "/images/portfolio/food/DSC02486.webp",
    4672,
    7008,
    "Salade colorée dressée sur une table textile",
    "Colourful salad plated on a patterned tablecloth",
  ),
  photo(
    "/images/portfolio/food/DSC02493.webp",
    4672,
    7008,
    "Assiette marocaine aux légumes et condiments colorés",
    "Moroccan plate with colourful vegetables and condiments",
  ),
  photo(
    "/images/portfolio/food/DSC02504.webp",
    7008,
    4672,
    "Table de déjeuner marocaine entièrement dressée",
    "Fully set Moroccan lunch table",
  ),
  photo(
    "/images/portfolio/food/DSC02522.webp",
    4672,
    7008,
    "Plat de pâtes photographié sous une lumière de restaurant",
    "Pasta dish photographed under restaurant lighting",
  ),
];

export const portfolioProjects: ProjectSummary[] = [
  {
    slug: "weddings-in-fes",
    title: { fr: "Gestes de mariage", en: "Wedding gestures" },
    category: "weddings",
    categoryLabel: { fr: "Mariages", en: "Weddings" },
    location: "Fès, Maroc",
    year: "2026",
    summary: {
      fr: "Une histoire intime racontée par les mains, les matières et la proximité.",
      en: "An intimate story told through hands, texture, and closeness.",
    },
    featured: true,
    mediaType: "photos",
    aspect: "portrait",
    cover: weddings[0],
    gallery: weddings,
  },
  {
    slug: "conference-documentary",
    title: { fr: "Présences publiques", en: "Public presence" },
    category: "events",
    categoryLabel: { fr: "Événements", en: "Events" },
    location: "Fès, Maroc",
    year: "2026",
    summary: {
      fr: "Des discours aux échanges spontanés, un reportage précis de chaque temps fort.",
      en: "From speeches to candid exchanges, a precise record of every key moment.",
    },
    featured: true,
    mediaType: "photos",
    aspect: "landscape",
    cover: events[0],
    gallery: events,
  },
  {
    slug: "moroccan-interiors",
    title: { fr: "Lieux habités", en: "Lived-in spaces" },
    category: "hospitality",
    categoryLabel: {
      fr: "Hôtellerie & intérieurs",
      en: "Hospitality & interiors",
    },
    location: "Fès, Maroc",
    year: "2026",
    summary: {
      fr: "Architecture, lumière naturelle et détails artisanaux composés avec clarté.",
      en: "Architecture, natural light, and crafted details composed with clarity.",
    },
    featured: true,
    mediaType: "photos",
    aspect: "landscape",
    cover: hospitality[0],
    gallery: hospitality,
  },
  {
    slug: "culinary-stories",
    title: { fr: "Feu et gestes", en: "Fire and craft" },
    category: "food",
    categoryLabel: { fr: "Gastronomie", en: "Food" },
    location: "Fès, Maroc",
    year: "2026",
    summary: {
      fr: "Une séquence culinaire qui relie le lieu, les cuisiniers et l'assiette.",
      en: "A culinary sequence connecting the place, the cooks, and the plate.",
    },
    featured: true,
    mediaType: "photos",
    aspect: "portrait",
    cover: food[0],
    gallery: food,
  },
];

export const signaturePortrait = photo(
  "/images/portfolio/personal/m2.webp",
  2528,
  1696,
  "Mohammed Laâchach tenant une caméra de cinéma sur un plateau",
  "Mohammed Laâchach holding a cinema camera on set",
);
