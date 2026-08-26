import { ArrowUpRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Container } from "@/components/common/container";
import { Link } from "@/i18n/navigation";

const footerLinks = [
  ["portfolio", "/portfolio"],
  ["services", "/services"],
  ["about", "/about"],
  ["journal", "/journal"],
  ["contact", "/contact"],
] as const;

export async function Footer() {
  const [t, navigation, locale] = await Promise.all([
    getTranslations("Footer"),
    getTranslations("Navigation"),
    getLocale(),
  ]);
  const copy = {
    fr: { location: "Fès · Maroc", navigation: "Navigation de pied de page" },
    en: { location: "Fez · Morocco", navigation: "Footer navigation" },
    ar: { location: "فاس · المغرب", navigation: "التنقل في تذييل الصفحة" },
  }[locale as "fr" | "en" | "ar"];

  return (
    <footer className="bg-ink text-paper relative overflow-hidden border-t border-white/10 py-16 sm:py-24">
      <div className="bg-sand/10 pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full blur-3xl" />
      <Container>
        <div className="grid gap-16 lg:grid-cols-[1.4fr_0.6fr]">
          <div>
            <p className="eyebrow text-sand">{copy.location}</p>
            <p className="display-section mt-7 max-w-5xl">
              Mohammed
              <br />
              <em className="font-light text-white/55">Laâchach.</em>
            </p>
            <p className="mt-8 max-w-md text-sm leading-7 text-white/50">
              {t("tagline")}
            </p>
          </div>
          <nav aria-label={copy.navigation} className="lg:pt-20">
            {footerLinks.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="group hover:text-sand flex items-center justify-between border-t border-white/10 py-4 text-sm text-white/70 transition-colors"
              >
                {navigation(label)}
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-20 flex flex-col gap-5 border-t border-white/10 pt-7 text-[0.65rem] tracking-[0.12em] text-white/35 uppercase sm:flex-row sm:items-center sm:justify-between">
          <p>
            <bdi dir="ltr">© {new Date().getFullYear()} Mohammed Laâchach.</bdi>{" "}
            {t("rights")}
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="hover:text-paper transition-colors"
            >
              {t("privacy")}
            </Link>
            <Link href="/legal" className="hover:text-paper transition-colors">
              {t("legal")}
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
