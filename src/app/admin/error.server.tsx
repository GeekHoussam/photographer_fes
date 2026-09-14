"use client";
import { useTranslations } from "next-intl";
export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("admin");
  return (
    <section className="admin-panel" role="alert">
      <h1>{t("errorTitle")}</h1>
      <p>{t("errorHint")}</p>
      <button className="admin-button" onClick={reset}>
        {t("actions.retry")}
      </button>
    </section>
  );
}
