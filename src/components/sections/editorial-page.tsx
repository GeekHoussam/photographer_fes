import { ButtonLink } from "@/components/common/button";
import { Container } from "@/components/common/container";
import { ResponsiveMedia } from "@/components/common/responsive-media";
import { PageHero } from "./page-hero";

export function EditorialPage({
  locale,
  kind,
}: {
  locale: "fr" | "en";
  kind: "about" | "process" | "privacy" | "legal";
}) {
  const fr = locale === "fr";
  const content = {
    about: {
      eyebrow: fr ? "À propos" : "About",
      title: fr
        ? "Mohammed, derrière l'objectif."
        : "Mohammed, behind the lens.",
      intro: fr
        ? "Un regard construit entre présence documentaire, direction attentive et lumière naturelle."
        : "A point of view shaped by documentary presence, considered direction, and natural light.",
      heading: fr
        ? "Une approche humaine et éditoriale."
        : "A human, editorial approach.",
      body: fr
        ? "Basé à Fès, Mohammed photographie les personnes, les lieux et les savoir-faire avec une approche calme et précise. Il cherche moins à imposer une image qu'à créer les conditions où une présence juste peut apparaître."
        : "Based in Fès, Mohammed photographs people, places, and craft with a calm, precise approach. Rather than imposing an image, he creates the conditions in which a genuine presence can emerge.",
    },
    process: {
      eyebrow: fr ? "Approche" : "Process",
      title: fr
        ? "De l'idée aux images finales."
        : "From the idea to the final images.",
      intro: fr
        ? "Un cadre clair, adaptable à chaque mariage, lieu, marque ou production."
        : "A clear framework, adaptable to every wedding, place, brand, or production.",
      heading: fr
        ? "Préparer avec soin, photographier avec présence."
        : "Prepare with care, photograph with presence.",
      body: fr
        ? "Le travail commence par un échange sur l'intention, les usages et le rythme. Une direction visuelle concise prépare la prise de vue, puis l'édition construit une série cohérente avant la livraison."
        : "The work begins with a conversation about intent, usage, and pace. A concise visual direction prepares the shoot, then the edit builds a coherent series before delivery.",
    },
    privacy: {
      eyebrow: fr ? "Confidentialité" : "Privacy",
      title: fr ? "Politique de confidentialité." : "Privacy policy.",
      intro: fr
        ? "Brouillon structurel à faire valider juridiquement avant publication."
        : "Structural draft requiring legal review before publishing.",
      heading: fr ? "Données du formulaire." : "Form data.",
      body: fr
        ? "Les informations envoyées via le formulaire sont utilisées uniquement pour répondre à la demande. Le responsable de traitement, les durées de conservation et les droits applicables doivent être confirmés."
        : "Information sent through the form is used only to respond to the enquiry. The data controller, retention periods, and applicable rights must be confirmed.",
    },
    legal: {
      eyebrow: fr ? "Informations légales" : "Legal information",
      title: fr ? "Mentions légales." : "Legal notice.",
      intro: fr
        ? "Aucune information d'enregistrement n'est inventée. Contenu à compléter avant lancement."
        : "No registration information is invented. Content must be completed before launch.",
      heading: fr ? "Éditeur et hébergement." : "Publisher and hosting.",
      body: fr
        ? "Le nom légal, l'adresse, les identifiants d'activité, le directeur de publication et les mentions d'hébergement seront ajoutés après validation."
        : "The legal name, address, business identifiers, publication director, and hosting disclosures will be added after approval.",
    },
  }[kind];
  const visual = kind === "about" || kind === "process";

  return (
    <>
      <PageHero
        eyebrow={content.eyebrow}
        title={content.title}
        introduction={content.intro}
        mediaSrc={
          visual
            ? "/images/portfolio/interiors/DSC01919.webp"
            : "/images/portfolio/interiors/DSC02171.webp"
        }
      />
      <section className="section-space bg-ink text-paper">
        <Container className="grid grid-cols-12 gap-y-14 lg:gap-x-12">
          {visual ? (
            <ResponsiveMedia
              src="/images/portfolio/interiors/DSC01919.webp"
              alt={
                fr
                  ? "Salon traditionnel de Fès aux boiseries sculptées"
                  : "Traditional Fès interior with carved woodwork"
              }
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="col-span-12 aspect-[4/5] lg:col-span-6"
            />
          ) : null}
          <div
            className={
              visual
                ? "col-span-12 lg:col-span-5 lg:col-start-8 lg:pt-20"
                : "col-span-12 max-w-3xl lg:col-span-7 lg:col-start-4"
            }
          >
            <p className="eyebrow text-sand">{content.eyebrow}</p>
            <h2 className="font-display mt-7 text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.86] tracking-[-0.04em]">
              {content.heading}
            </h2>
            <p className="mt-9 max-w-2xl text-base leading-8 text-white/52">
              {content.body}
            </p>
            {visual ? (
              <ButtonLink href="/contact" variant="secondary" className="mt-9">
                {fr ? "Parler de votre projet" : "Discuss your project"}
              </ButtonLink>
            ) : null}
          </div>
        </Container>
      </section>
    </>
  );
}
