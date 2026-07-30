import type { Locale } from "@/config/site";
import type { LocalizedText } from "@/types/content";

export function localize(
  value: Partial<LocalizedText> | null | undefined,
  locale: Locale,
): string {
  return (
    value?.[locale]?.trim() || value?.fr?.trim() || value?.en?.trim() || ""
  );
}

export function mapSlug(
  value: { current?: string } | string | null | undefined,
): string {
  if (typeof value === "string") return value;
  return value?.current ?? "";
}
