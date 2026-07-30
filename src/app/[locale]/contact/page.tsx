import { Container } from "@/components/common/container";
import { ContactForm } from "@/components/forms/contact-form";
import { PageHero } from "@/components/sections/page-hero";
import { isLocale } from "@/config/site";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const fr = locale === "fr";
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          fr ? "Racontez-moi votre projet." : "Tell me about your project."
        }
        introduction={
          fr
            ? "Les coordonnées publiques seront affichées après validation. Utilisez le formulaire pour une demande de disponibilité ou de devis."
            : "Public contact details will appear after approval. Use the form for availability or quotation enquiries."
        }
        mediaSrc="/images/portfolio/interiors/DSC02171.webp"
      />
      <section className="section-space bg-ink text-paper">
        <Container className="grid grid-cols-12 gap-y-14 lg:gap-x-12">
          <div className="col-span-12 lg:col-span-4">
            <p className="eyebrow text-sand">
              {fr ? "Votre demande" : "Your enquiry"}
            </p>
            <p className="mt-7 max-w-sm leading-8 text-white/48">
              {fr
                ? "Précisez la date, le lieu et l'intention. Aucun prix n'est inventé : une proposition adaptée sera préparée après échange."
                : "Share the date, location, and intent. No pricing is invented: a tailored proposal will be prepared after discussion."}
            </p>
          </div>
          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <ContactForm />
          </div>
        </Container>
      </section>
    </>
  );
}
