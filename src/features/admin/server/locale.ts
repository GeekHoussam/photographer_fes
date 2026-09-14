import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { createTranslator } from "next-intl";
import { isLocale } from "@/config/site";

export const adminI18n = cache(async () => {
  const preference = (await cookies()).get("NEXT_LOCALE")?.value;
  const locale = preference && isLocale(preference) ? preference : "fr";
  const messages = {
    admin: (await import(`../../../../messages/admin/${locale}.json`)).default,
  };
  return {
    locale,
    messages,
    t: createTranslator({ locale, messages, namespace: "admin" }),
  };
});
