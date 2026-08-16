import Image from "next/image";
import { Container } from "@/components/common/container";

export function PageHero({
  eyebrow,
  title,
  introduction,
  mediaSrc = "/images/portfolio/interiors/DSC02171.webp",
}: {
  eyebrow: string;
  title: string;
  introduction?: string;
  mediaSrc?: string;
}) {
  return (
    <header className="theme-lock-dark ambient-grid bg-ink text-paper relative flex min-h-[78svh] items-end overflow-hidden pt-36 pb-14 sm:pt-44 sm:pb-20 lg:items-start">
      <Image
        src={mediaSrc}
        alt=""
        fill
        loading="eager"
        fetchPriority="high"
        sizes="100vw"
        className="object-cover object-center opacity-38 saturate-[0.75]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,9,7,0.97)_0%,rgba(9,9,7,0.72)_55%,rgba(9,9,7,0.25)_100%)]" />
      <div className="from-ink absolute inset-0 bg-gradient-to-t via-transparent to-black/25" />
      <Container className="relative grid grid-cols-12 gap-y-10 lg:items-end lg:gap-x-12">
        <div className="col-span-12 lg:col-span-8">
          <p className="eyebrow text-sand">{eyebrow}</p>
          <h1 className="balance display-page mt-7 max-w-[12ch]">{title}</h1>
        </div>
        {introduction ? (
          <div className="col-span-12 border-t border-white/15 pt-6 sm:col-span-7 lg:col-span-4 lg:col-start-9">
            <p className="text-base leading-8 text-white/58 sm:text-lg">
              {introduction}
            </p>
          </div>
        ) : null}
      </Container>
    </header>
  );
}
