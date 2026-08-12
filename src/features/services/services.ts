import type { ServiceSummary } from "@/types/content";

export const services: ServiceSummary[] = [
  {
    slug: "wedding-photography",
    title: { fr: "Photographie de mariage", en: "Wedding photography" },
    introduction: {
      fr: "Un reportage de mariage à Fès ou ailleurs au Maroc, attentif à la cérémonie, aux portraits du couple et aux interactions entre les proches.",
      en: "Wedding coverage in Fès or elsewhere in Morocco, attentive to the ceremony, couple portraits, and interactions between guests.",
    },
    overviewTitle: {
      fr: "Préparer les temps importants sans figer la journée.",
      en: "Prepare the important moments without making the day feel staged.",
    },
    overview: {
      fr: "La préparation sert à identifier les lieux, les horaires, les personnes et les moments qui comptent. Pendant le mariage, la prise de vue combine observation des échanges spontanés et direction simple lorsque des portraits sont nécessaires.",
      en: "Preparation identifies the locations, timings, people, and moments that matter. During the wedding, photography combines observation of candid interactions with straightforward direction when portraits are needed.",
    },
    planningPoints: [
      {
        fr: "Date, lieux et horaires principaux",
        en: "Date, locations, and key timings",
      },
      {
        fr: "Cérémonies et personnes à photographier",
        en: "Ceremonies and people to photograph",
      },
      {
        fr: "Usage attendu des photographies ou de la vidéo",
        en: "Intended use of the photographs or film",
      },
    ],
    faqs: [
      {
        question: {
          fr: "Quelles informations transmettre pour un mariage ?",
          en: "What information should I share for a wedding?",
        },
        answer: {
          fr: "Indiquez la date, les lieux, les principaux horaires, les cérémonies prévues et vos besoins en photographie ou vidéo. Ces éléments permettent de comprendre le déroulement avant de préparer une proposition.",
          en: "Share the date, locations, key timings, planned ceremonies, and whether you need photography or film. This provides the context needed before a proposal is prepared.",
        },
      },
      {
        question: {
          fr: "Le mariage peut-il avoir lieu hors de Fès ?",
          en: "Can the wedding take place outside Fès?",
        },
        answer: {
          fr: "Oui, les projets peuvent être étudiés ailleurs au Maroc. Précisez chaque lieu dans votre demande afin que le déplacement soit pris en compte dans la proposition.",
          en: "Yes, projects elsewhere in Morocco can be considered. Include every location in your enquiry so travel can be considered in the proposal.",
        },
      },
    ],
    relatedProjectSlug: "weddings-in-fes",
  },
  {
    slug: "event-photography",
    title: { fr: "Photographie d’événement", en: "Event photography" },
    introduction: {
      fr: "Un reportage photographique des prises de parole, cérémonies, échanges et vues d’ensemble qui permettent de comprendre un événement.",
      en: "Photographic coverage of speeches, ceremonies, interactions, and wider scenes that make an event understandable.",
    },
    overviewTitle: {
      fr: "Documenter le programme et ce qui se passe entre ses temps forts.",
      en: "Document the programme and what happens between its key moments.",
    },
    overview: {
      fr: "Le programme, les intervenants et la configuration du lieu guident la préparation. Le reportage associe les moments officiels, les réactions du public, les échanges informels et les détails utiles au récit de l’événement.",
      en: "The programme, speakers, and venue layout guide preparation. Coverage connects official moments, audience reactions, informal exchanges, and details that help explain the event.",
    },
    planningPoints: [
      { fr: "Programme et horaires", en: "Programme and timings" },
      {
        fr: "Intervenants et séquences prioritaires",
        en: "Speakers and priority sequences",
      },
      {
        fr: "Lieux, accès et usage prévu des images",
        en: "Venues, access, and intended image use",
      },
    ],
    faqs: [
      {
        question: {
          fr: "Que faut-il envoyer avant un événement ?",
          en: "What should be shared before an event?",
        },
        answer: {
          fr: "Transmettez le programme, les horaires, les lieux, la liste des intervenants importants et les usages prévus des images. Signalez aussi les séquences dont l’accès est limité.",
          en: "Send the programme, timings, venues, key speakers, and intended uses of the images. Also identify any sequences with restricted access.",
        },
      },
      {
        question: {
          fr: "Peut-on demander des photographies de prises de parole et du public ?",
          en: "Can coverage include both speakers and the audience?",
        },
        answer: {
          fr: "Oui. Le portfolio montre des prises de parole, une cérémonie officielle, des échanges entre invités et un portrait de groupe. Votre brief doit préciser les moments et les personnes prioritaires.",
          en: "Yes. The portfolio shows speeches, an official ceremony, guest interactions, and a group portrait. Your brief should identify the priority moments and people.",
        },
      },
    ],
    relatedProjectSlug: "conference-documentary",
  },
  {
    slug: "corporate-photography",
    title: { fr: "Photographie corporate", en: "Corporate photography" },
    introduction: {
      fr: "Des portraits, prises de parole, équipes et situations de travail photographiés pour présenter clairement une organisation et ses activités.",
      en: "Portraits, speakers, teams, and working situations photographed to present an organisation and its activities clearly.",
    },
    overviewTitle: {
      fr: "Relier les personnes, le contexte de travail et l’usage des images.",
      en: "Connect people, working context, and the intended use of the images.",
    },
    overview: {
      fr: "Le brief précise qui doit être photographié, dans quels espaces et pour quels supports. Cette préparation permet de conserver une cohérence entre portraits, scènes de travail et images d’événement lorsque plusieurs situations sont réunies.",
      en: "The brief establishes who needs to be photographed, in which spaces, and for which channels. This keeps portraits, working scenes, and event images coherent when several situations are covered together.",
    },
    planningPoints: [
      {
        fr: "Personnes, équipes et activités concernées",
        en: "People, teams, and activities involved",
      },
      {
        fr: "Espaces accessibles pour la prise de vue",
        en: "Spaces available for photography",
      },
      {
        fr: "Supports de communication prévus",
        en: "Intended communication channels",
      },
    ],
    faqs: [
      {
        question: {
          fr: "Comment préparer une séance corporate ?",
          en: "How should a corporate shoot be prepared?",
        },
        answer: {
          fr: "Listez les personnes, les activités, les espaces disponibles et les supports qui utiliseront les images. Indiquez aussi les contraintes d’accès ou d’autorisation propres au site.",
          en: "List the people, activities, available spaces, and channels where the images will be used. Include any site-specific access or permission constraints.",
        },
      },
      {
        question: {
          fr: "Une même demande peut-elle réunir portraits et reportage ?",
          en: "Can one enquiry combine portraits and documentary coverage?",
        },
        answer: {
          fr: "Oui, si les deux besoins sont décrits dans le brief. Précisez le nombre de personnes, les situations à documenter et l’usage final afin d’évaluer le projet dans son ensemble.",
          en: "Yes, when both needs are described in the brief. Share the number of people, situations to document, and intended use so the project can be considered as a whole.",
        },
      },
    ],
    relatedProjectSlug: "conference-documentary",
  },
  {
    slug: "product-photography",
    title: { fr: "Photographie de produit", en: "Product photography" },
    introduction: {
      fr: "Des photographies de produits et d’objets préparées selon leur matière, leur forme, leur contexte et le support sur lequel elles seront utilisées.",
      en: "Product and object photography planned around material, form, context, and the channel where the images will be used.",
    },
    overviewTitle: {
      fr: "Définir le produit, le contexte et le format avant la prise de vue.",
      en: "Define the product, context, and format before production.",
    },
    overview: {
      fr: "Le nombre d’objets, leurs dimensions, l’environnement souhaité et les formats de diffusion orientent la préparation. Le brief permet de distinguer une image isolée d’un produit mis en situation, sans supposer de livrables non confirmés.",
      en: "The number of objects, their dimensions, the desired setting, and distribution formats shape preparation. The brief distinguishes an isolated product image from a product shown in context without assuming unconfirmed deliverables.",
    },
    planningPoints: [
      { fr: "Nombre et dimensions des produits", en: "Product count and size" },
      {
        fr: "Fond neutre ou produit mis en situation",
        en: "Neutral background or contextual setting",
      },
      {
        fr: "Supports et formats de diffusion",
        en: "Distribution channels and formats",
      },
    ],
    faqs: [
      {
        question: {
          fr: "Quelles informations fournir pour des photographies de produit ?",
          en: "What information is needed for product photography?",
        },
        answer: {
          fr: "Indiquez le nombre de produits, leurs dimensions, les matières ou détails importants, le contexte visuel souhaité et les supports sur lesquels les images seront utilisées.",
          en: "Share the number of products, their dimensions, important materials or details, the desired visual context, and where the images will be used.",
        },
      },
      {
        question: {
          fr: "Faut-il préciser les formats d’image dès la demande ?",
          en: "Should image formats be specified in the initial enquiry?",
        },
        answer: {
          fr: "Oui, si vous les connaissez. Les besoins d’un site, d’un catalogue et d’un réseau social peuvent demander des cadrages différents ; les signaler aide à préparer la prise de vue.",
          en: "Yes, when known. A website, catalogue, and social channel may require different framing, so identifying them helps prepare production.",
        },
      },
    ],
    relatedProjectSlug: "culinary-stories",
  },
  {
    slug: "food-photography",
    title: { fr: "Photographie culinaire", en: "Food photography" },
    introduction: {
      fr: "Des images de plats, de gestes en cuisine, de l’équipe et du lieu pour présenter une expérience culinaire dans son contexte.",
      en: "Images of dishes, kitchen craft, the team, and the setting to present a culinary experience in context.",
    },
    overviewTitle: {
      fr: "Photographier l’assiette et le travail qui la précède.",
      en: "Photograph the dish and the work behind it.",
    },
    overview: {
      fr: "La série publiée relie préparation en cuisine, flammes, service, tables dressées et plats terminés. Pour un nouveau projet, la liste des plats, le rythme du service et les espaces accessibles permettent d’organiser une prise de vue cohérente.",
      en: "The published series connects kitchen preparation, flames, service, set tables, and finished dishes. For a new project, the dish list, service pace, and accessible spaces help organise coherent coverage.",
    },
    planningPoints: [
      {
        fr: "Plats et boissons à photographier",
        en: "Dishes and drinks to photograph",
      },
      {
        fr: "Accès à la cuisine, à la salle ou à la terrasse",
        en: "Access to the kitchen, dining room, or terrace",
      },
      {
        fr: "Horaires de préparation et de service",
        en: "Preparation and service timings",
      },
    ],
    faqs: [
      {
        question: {
          fr: "Que préparer pour une séance de photographie culinaire ?",
          en: "What should be prepared for a food photography shoot?",
        },
        answer: {
          fr: "Partagez la liste des plats et boissons, les espaces accessibles, l’ordre de préparation et l’usage prévu des images. Indiquez si le travail en cuisine ou le service doit aussi être documenté.",
          en: "Share the dish and drink list, accessible spaces, preparation order, and intended use of the images. Specify whether kitchen work or service should also be documented.",
        },
      },
      {
        question: {
          fr: "La série peut-elle inclure le restaurant et l’équipe ?",
          en: "Can the series include the restaurant and team?",
        },
        answer: {
          fr: "Oui. Le portfolio culinaire montre la cuisine, les personnes au travail, une terrasse, des tables et des plats. Précisez les éléments à couvrir dans votre demande.",
          en: "Yes. The food portfolio shows the kitchen, people at work, a terrace, tables, and dishes. Identify the elements to cover in your enquiry.",
        },
      },
    ],
    relatedProjectSlug: "culinary-stories",
  },
  {
    slug: "hospitality-photography",
    title: {
      fr: "Hôtellerie, locations et intérieurs",
      en: "Hospitality, rentals, and interiors",
    },
    introduction: {
      fr: "Des photographies d’architecture intérieure, de chambres et d’espaces de réception qui décrivent les volumes, la lumière et les détails d’un lieu.",
      en: "Interior, room, and reception-space photography that describes the scale, light, and details of a property.",
    },
    overviewTitle: {
      fr: "Donner une lecture claire de chaque espace.",
      en: "Give each space a clear visual reading.",
    },
    overview: {
      fr: "La préparation identifie les espaces prioritaires, leur état, les accès et le moment où la lumière convient au lieu. La série publiée montre une cour, des chambres, des salons et des espaces de repas traditionnels comme contemporains.",
      en: "Preparation identifies the priority spaces, their condition, access, and when the available light suits the property. The published series shows a courtyard, bedrooms, living rooms, and traditional and contemporary dining spaces.",
    },
    planningPoints: [
      {
        fr: "Liste des chambres et espaces prioritaires",
        en: "List of priority rooms and spaces",
      },
      {
        fr: "Accès, occupation et préparation du lieu",
        en: "Access, occupancy, and property preparation",
      },
      {
        fr: "Usage des images pour le site ou les plateformes",
        en: "Image use on the website or booking platforms",
      },
    ],
    faqs: [
      {
        question: {
          fr: "Comment préparer un hôtel, un riad ou une location ?",
          en: "How should a hotel, riad, or rental be prepared?",
        },
        answer: {
          fr: "Listez les espaces prioritaires et indiquez leurs horaires d’accès ou d’occupation. Le lieu doit être présenté dans l’état où vous souhaitez qu’il apparaisse sur les images.",
          en: "List the priority spaces and provide their access or occupancy times. The property should be presented in the condition in which you want it to appear in the images.",
        },
      },
      {
        question: {
          fr: "Quels types d’espaces apparaissent dans le portfolio ?",
          en: "What kinds of spaces appear in the portfolio?",
        },
        answer: {
          fr: "La série publiée comprend une cour en zellige, des chambres, des salons et des espaces de repas, avec des intérieurs marocains traditionnels et contemporains.",
          en: "The published series includes a zellige courtyard, bedrooms, living rooms, and dining spaces across traditional and contemporary Moroccan interiors.",
        },
      },
    ],
    relatedProjectSlug: "moroccan-interiors",
  },
  {
    slug: "portrait-photography",
    title: { fr: "Photographie de portrait", en: "Portrait photography" },
    introduction: {
      fr: "Des portraits individuels, de couple ou de groupe préparés selon la personne, le contexte, le lieu et l’usage prévu des images.",
      en: "Individual, couple, or group portraits planned around the people, context, location, and intended use of the images.",
    },
    overviewTitle: {
      fr: "Diriger simplement pour préserver une présence naturelle.",
      en: "Use straightforward direction to retain a natural presence.",
    },
    overview: {
      fr: "Le brief détermine qui sera photographié, dans quel environnement et pour quel support. Pendant la séance, la direction porte sur la position, le regard et la relation au lieu, sans effacer la personnalité du sujet.",
      en: "The brief establishes who will be photographed, in which setting, and for what purpose. During the session, direction addresses position, gaze, and the relationship to the location without obscuring the subject’s personality.",
    },
    planningPoints: [
      { fr: "Nombre de personnes", en: "Number of people" },
      {
        fr: "Lieu et contexte du portrait",
        en: "Portrait location and context",
      },
      { fr: "Usage prévu des images", en: "Intended use of the images" },
    ],
    faqs: [
      {
        question: {
          fr: "Quelles informations donner pour une séance de portrait ?",
          en: "What information should I share for a portrait session?",
        },
        answer: {
          fr: "Précisez le nombre de personnes, le lieu envisagé, le contexte du portrait et les supports sur lesquels les images seront utilisées.",
          en: "Share the number of people, proposed location, portrait context, and the channels where the images will be used.",
        },
      },
      {
        question: {
          fr: "Le portfolio montre-t-il des portraits individuels et de groupe ?",
          en: "Does the portfolio show individual and group portraits?",
        },
        answer: {
          fr: "Oui. Les séries publiées présentent notamment un couple, des intervenants et un groupe de diplômés dans des contextes différents.",
          en: "Yes. The published series includes a couple, speakers, and a graduating group in different contexts.",
        },
      },
    ],
    relatedProjectSlug: "weddings-in-fes",
  },
  {
    slug: "video-production",
    title: { fr: "Production vidéo", en: "Film production" },
    introduction: {
      fr: "Des projets vidéo préparés à partir du sujet, des séquences nécessaires, du lieu, du rythme souhaité et du support de diffusion.",
      en: "Film projects planned around the subject, required sequences, location, intended pace, and distribution channel.",
    },
    overviewTitle: {
      fr: "Définir le récit et les séquences avant de filmer.",
      en: "Define the narrative and required sequences before filming.",
    },
    overview: {
      fr: "Une demande vidéo doit préciser le message, les personnes ou lieux à filmer, le calendrier et les supports prévus. Ces informations permettent d’évaluer la préparation, la prise de vue et le montage sans annoncer de format ou de durée non confirmés.",
      en: "A film enquiry should identify the message, people or places to record, schedule, and intended channels. This makes it possible to assess preparation, filming, and editing without promising an unconfirmed format or duration.",
    },
    planningPoints: [
      {
        fr: "Message et public visé",
        en: "Message and intended audience",
      },
      {
        fr: "Personnes, lieux et séquences à filmer",
        en: "People, places, and sequences to film",
      },
      {
        fr: "Supports de diffusion et calendrier",
        en: "Distribution channels and schedule",
      },
    ],
    faqs: [
      {
        question: {
          fr: "Que faut-il préciser dans une demande vidéo ?",
          en: "What should a film enquiry include?",
        },
        answer: {
          fr: "Décrivez le sujet, le public visé, les personnes ou lieux à filmer, les séquences indispensables, le calendrier et les supports de diffusion prévus.",
          en: "Describe the subject, intended audience, people or places to film, essential sequences, schedule, and planned distribution channels.",
        },
      },
      {
        question: {
          fr: "Le portfolio contient-il déjà un projet vidéo publié ?",
          en: "Does the portfolio already contain a published film project?",
        },
        answer: {
          fr: "Non. Aucun projet vidéo n’est publié pour le moment ; le filtre Vidéos du portfolio l’indique clairement. Une demande peut néanmoins être transmise avec un brief précis.",
          en: "No. No film project is currently published, and the Videos filter states this clearly. You can still submit an enquiry with a precise brief.",
        },
      },
    ],
  },
];
