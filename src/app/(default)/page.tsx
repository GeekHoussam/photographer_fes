import { defaultLocale } from "@/config/site";

export default function RootPage() {
  return (
    <main className="bg-ink text-paper grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <meta httpEquiv="refresh" content={`0; url=./${defaultLocale}/`} />
        <p className="eyebrow text-sand">Mohammed Laâchach</p>
        <h1 className="font-display mt-6 text-5xl">
          Photographe et vidéaste à Fès
        </h1>
        <a className="mt-8 inline-block underline" href={`./${defaultLocale}/`}>
          Accéder au portfolio en français
        </a>
      </div>
    </main>
  );
}
