import {
  serializeJsonLd,
  type JsonLdDocument,
} from "@/lib/seo/structured-data";

export function JsonLd({ data }: { data: JsonLdDocument }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
