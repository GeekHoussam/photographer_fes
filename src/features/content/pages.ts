import type { Locale } from "@/config/site";

export type StaticPageKey =
  | "home"
  | "portfolio"
  | "services"
  | "about"
  | "process"
  | "journal"
  | "contact"
  | "privacy"
  | "legal"
  | "thankYou";

type ProcessStep = {
  title: string;
  text: string;
};

type PageCopy = {
  eyebrow: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  introduction: string;
  h2?: string;
  body?: string;
  steps?: ProcessStep[];
};

type PageContent = {
  path: string;
  indexable: boolean;
  fr: PageCopy;
  en: PageCopy;
};

export const staticPageContent: Record<StaticPageKey, PageContent> = {
  home: {
    path: "",
    indexable: true,
    fr: {
      eyebrow: "Mohammed Laâchach",
      metaTitle: "Photographe Fès — Mohammed Laâchach",
      metaDescription:
        "Mohammed Laâchach réalise des photographies de mariage, d’événement, d’hôtellerie et de gastronomie à Fès et au Maroc, ainsi que des projets vidéo.",
      h1: "Photographe et vidéaste à Fès.",
      introduction:
        "Photographie de mariage, d’événement, d’intérieurs et de gastronomie à Fès et au Maroc, avec une approche précise et attentive aux personnes comme aux lieux.",
    },
    en: {
      eyebrow: "Mohammed Laâchach",
      metaTitle: "Photographer in Fez — Mohammed Laâchach",
      metaDescription:
        "Mohammed Laâchach creates wedding, event, hospitality, and food photography in Fez and across Morocco, alongside film projects.",
      h1: "Photographer and filmmaker in Fez.",
      introduction:
        "Wedding, event, interior, and food photography in Fez and across Morocco, with a precise approach attentive to people and place.",
    },
  },
  portfolio: {
    path: "/portfolio",
    indexable: true,
    fr: {
      eyebrow: "Portfolio",
      metaTitle: "Portfolio de photographie à Fès",
      metaDescription:
        "Quatre séries photographiques de Mohammed Laâchach consacrées au mariage, aux événements, aux intérieurs et à la gastronomie à Fès.",
      h1: "Portfolio de photographie à Fès.",
      introduction:
        "Parcourez quatre séries publiées : portraits et détails de mariage, cérémonie institutionnelle, intérieurs marocains et cuisine en action.",
    },
    en: {
      eyebrow: "Portfolio",
      metaTitle: "Photography portfolio in Fez",
      metaDescription:
        "Four photographic series by Mohammed Laâchach covering weddings, events, interiors, and food in Fez.",
      h1: "Photography portfolio in Fez.",
      introduction:
        "Explore four published series: wedding portraits and details, an institutional ceremony, Moroccan interiors, and a working kitchen.",
    },
  },
  services: {
    path: "/services",
    indexable: true,
    fr: {
      eyebrow: "Services",
      metaTitle: "Services de photographie et de vidéo à Fès",
      metaDescription:
        "Photographie de mariage, d’événement, corporate, de produit, culinaire, d’hôtellerie et de portrait, ainsi que production vidéo à Fès et au Maroc.",
      h1: "Services de photographie et de vidéo.",
      introduction:
        "Choisissez le service correspondant à votre projet, puis précisez son usage, son lieu et son calendrier pour recevoir une proposition adaptée.",
    },
    en: {
      eyebrow: "Services",
      metaTitle: "Photography and film services in Fez",
      metaDescription:
        "Wedding, event, corporate, product, food, hospitality, and portrait photography plus film production in Fez and across Morocco.",
      h1: "Photography and film services.",
      introduction:
        "Choose the service that fits your project, then share its intended use, location, and schedule to request a tailored proposal.",
    },
  },
  about: {
    path: "/about",
    indexable: true,
    fr: {
      eyebrow: "À propos",
      metaTitle: "À propos du photographe et vidéaste",
      metaDescription:
        "Découvrez Mohammed Laâchach, photographe et vidéaste basé à Fès, et son approche documentaire des personnes, des lieux et des savoir-faire.",
      h1: "Mohammed Laâchach, photographe et vidéaste.",
      introduction:
        "Basé à Fès, Mohammed Laâchach photographie les personnes, les lieux et les savoir-faire avec une présence discrète et une direction précise.",
      h2: "Une approche documentaire et attentive.",
      body: "Chaque projet commence par comprendre le sujet, le contexte et l’usage des images. Pendant la prise de vue, Mohammed alterne observation et direction pour produire une série lisible, cohérente et fidèle à ce qui se déroule devant l’objectif.",
    },
    en: {
      eyebrow: "About",
      metaTitle: "About the photographer and filmmaker",
      metaDescription:
        "Meet Mohammed Laâchach, a photographer and filmmaker based in Fez, and learn about his documentary approach to people, places, and craft.",
      h1: "Mohammed Laâchach, photographer and filmmaker.",
      introduction:
        "Based in Fez, Mohammed Laâchach photographs people, places, and craft with a quiet presence and precise direction.",
      h2: "A documentary, attentive approach.",
      body: "Each project begins by understanding the subject, context, and intended use of the images. During production, Mohammed combines observation with direction to create a clear, coherent series that remains faithful to what unfolds in front of the camera.",
    },
  },
  process: {
    path: "/process",
    indexable: true,
    fr: {
      eyebrow: "Approche",
      metaTitle: "Déroulement d’un projet photo ou vidéo",
      metaDescription:
        "Les quatre étapes d’un projet avec Mohammed Laâchach : préciser le besoin, préparer la direction visuelle, réaliser les images, puis sélectionner et finaliser la série.",
      h1: "Comment se déroule un projet photo ou vidéo ?",
      introduction:
        "Un cadre en quatre étapes permet d’aligner l’intention, la prise de vue et l’usage final des images, tout en restant adaptable au contexte du projet.",
      h2: "Quatre étapes, du brief à la série finale.",
      body: "Le calendrier et le contenu précis dépendent du sujet. Le formulaire de contact permet de transmettre le lieu, la date et les besoins nécessaires à la préparation d’une proposition.",
      steps: [
        {
          title: "Préciser le besoin",
          text: "Définir le sujet, le lieu, la date, les personnes concernées et l’usage prévu des photographies ou de la vidéo.",
        },
        {
          title: "Préparer la direction",
          text: "Organiser les contraintes utiles et établir une direction visuelle cohérente avec le contexte du projet.",
        },
        {
          title: "Réaliser les images",
          text: "Photographier ou filmer en alternant observation, composition et direction lorsque la situation le demande.",
        },
        {
          title: "Sélectionner et finaliser",
          text: "Construire une sélection cohérente et finaliser les images en fonction de l’usage défini au départ.",
        },
      ],
    },
    en: {
      eyebrow: "Process",
      metaTitle: "How a photography or film project works",
      metaDescription:
        "The four stages of a project with Mohammed Laâchach: define the need, prepare the visual direction, create the images, then select and finish the series.",
      h1: "How does a photography or film project work?",
      introduction:
        "A four-stage framework aligns the intent, production, and final use of the images while remaining adaptable to the project context.",
      h2: "Four stages, from brief to final series.",
      body: "The precise schedule and content depend on the subject. Use the contact form to share the location, date, and requirements needed to prepare a proposal.",
      steps: [
        {
          title: "Define the need",
          text: "Clarify the subject, location, date, people involved, and intended use of the photographs or film.",
        },
        {
          title: "Prepare the direction",
          text: "Organise the relevant constraints and establish a visual direction suited to the project context.",
        },
        {
          title: "Create the images",
          text: "Photograph or film by combining observation, composition, and direction where the situation requires it.",
        },
        {
          title: "Select and finish",
          text: "Build a coherent selection and finish the images for the intended use agreed at the outset.",
        },
      ],
    },
  },
  journal: {
    path: "/journal",
    indexable: true,
    fr: {
      eyebrow: "Journal",
      metaTitle: "Journal photo et vidéo à Fès",
      metaDescription:
        "Trois articles de Mohammed Laâchach sur la photographie de mariage, la couverture événementielle et les contenus pour les réseaux sociaux à Fès.",
      h1: "Journal photo et vidéo.",
      introduction:
        "Trois articles consacrés au mariage, aux événements professionnels et aux contenus pour les réseaux sociaux, illustrés par des photographies et des films de terrain.",
    },
    en: {
      eyebrow: "Journal",
      metaTitle: "Photography and film journal in Fez",
      metaDescription:
        "Three articles by Mohammed Laâchach on wedding photography, event coverage, and social media content in Fez.",
      h1: "Photography and film journal.",
      introduction:
        "Three articles covering weddings, professional events, and social media content, illustrated with field photography and films.",
    },
  },
  contact: {
    path: "/contact",
    indexable: true,
    fr: {
      eyebrow: "Contact",
      metaTitle: "Demande de devis photo ou vidéo",
      metaDescription:
        "Contactez Mohammed Laâchach pour un projet photo ou vidéo à Fès ou au Maroc. Indiquez le type de projet, le lieu, la date et l’usage prévu.",
      h1: "Demander un devis photo ou vidéo.",
      introduction:
        "Présentez le type de projet, le lieu, la date souhaitée et l’usage prévu. Ces informations permettront de préparer une réponse adaptée à votre demande.",
    },
    en: {
      eyebrow: "Contact",
      metaTitle: "Request a photography or film quotation",
      metaDescription:
        "Contact Mohammed Laâchach about photography or film in Fez or elsewhere in Morocco. Share the project type, location, date, and intended use.",
      h1: "Request a photography or film quotation.",
      introduction:
        "Describe the project type, location, preferred date, and intended use. This information will help prepare a relevant response to your enquiry.",
    },
  },
  privacy: {
    path: "/privacy",
    indexable: false,
    fr: {
      eyebrow: "Confidentialité",
      metaTitle: "Politique de confidentialité",
      metaDescription:
        "Informations provisoires sur les données envoyées dans le formulaire de contact de Mohammed Laâchach.",
      h1: "Politique de confidentialité.",
      introduction:
        "Cette version décrit uniquement l’usage actuel du formulaire. Le responsable du traitement, la conservation et les droits applicables doivent encore être validés avant publication définitive.",
      h2: "Données du formulaire de contact.",
      body: "Le formulaire recueille les coordonnées et les informations de projet que vous choisissez d’envoyer afin de répondre à votre demande. Aucune durée de conservation ni information juridique complémentaire n’est affichée tant qu’elle n’a pas été confirmée.",
    },
    en: {
      eyebrow: "Privacy",
      metaTitle: "Privacy policy",
      metaDescription:
        "Provisional information about data submitted through Mohammed Laâchach’s contact form.",
      h1: "Privacy policy.",
      introduction:
        "This version describes only the current use of the form. The data controller, retention period, and applicable rights still require approval before final publication.",
      h2: "Contact form data.",
      body: "The form collects the contact and project information you choose to submit so that the enquiry can be answered. No retention period or additional legal information is displayed until it has been confirmed.",
    },
  },
  legal: {
    path: "/legal",
    indexable: false,
    fr: {
      eyebrow: "Informations légales",
      metaTitle: "Mentions légales",
      metaDescription:
        "Page provisoire des mentions légales du portfolio professionnel de Mohammed Laâchach.",
      h1: "Mentions légales.",
      introduction:
        "Cette page est provisoire tant que les informations obligatoires de l’éditeur et de l’hébergeur n’ont pas été confirmées.",
      h2: "Éditeur et hébergement.",
      body: "Le nom légal, l’adresse professionnelle à publier, les identifiants d’activité, le directeur de publication et les informations d’hébergement seront ajoutés uniquement après validation par le propriétaire du site.",
    },
    en: {
      eyebrow: "Legal information",
      metaTitle: "Legal notice",
      metaDescription:
        "Provisional legal notice for Mohammed Laâchach’s professional photography portfolio.",
      h1: "Legal notice.",
      introduction:
        "This page is provisional until the required publisher and hosting information has been confirmed.",
      h2: "Publisher and hosting.",
      body: "The legal name, publishable business address, business identifiers, publication director, and hosting information will be added only after approval by the site owner.",
    },
  },
  thankYou: {
    path: "/thank-you",
    indexable: false,
    fr: {
      eyebrow: "Message envoyé",
      metaTitle: "Demande reçue",
      metaDescription: "Confirmation de réception de votre demande.",
      h1: "Merci. Votre demande a bien été reçue.",
      introduction: "Vous pouvez maintenant revenir au portfolio.",
    },
    en: {
      eyebrow: "Message sent",
      metaTitle: "Enquiry received",
      metaDescription: "Confirmation that your enquiry has been received.",
      h1: "Thank you. Your enquiry has been received.",
      introduction: "You can now return to the portfolio.",
    },
  },
};

export function getPageContent(key: StaticPageKey, locale: Locale) {
  const entry = staticPageContent[key];
  return {
    ...entry[locale],
    path: entry.path,
    indexable: entry.indexable,
  };
}
