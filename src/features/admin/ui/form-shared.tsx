"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { adminRequest } from "./api-client";
import { ErrorNotice } from "./controls";

export function useSave() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  async function save(
    path: string,
    method: string,
    data: unknown,
    destination?: string,
    resultBase?: string,
  ) {
    setError("");
    setSaved(false);
    try {
      const result = await adminRequest(path, method, data);
      setSaved(true);
      if (resultBase && result.id) router.push(`${resultBase}/${result.id}`);
      else if (destination) router.push(destination);
      router.refresh();
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "unavailable");
      return false;
    }
  }
  return { save, error, saved };
}
export function FormFeedback({
  error,
  saved = false,
  invalid = false,
}: {
  error: string;
  saved?: boolean;
  invalid?: boolean;
}) {
  const t = useTranslations("admin");
  return (
    <>
      {(error || invalid) && <ErrorNotice code={error || "validation"} />}
      {saved && <p role="status">{t("saved")}</p>}
    </>
  );
}
export function FormActions({
  busy,
  cancel,
  label,
}: {
  busy: boolean;
  cancel?: string;
  label?: string;
}) {
  const t = useTranslations("admin");
  return (
    <div className="admin-actions">
      <button className="admin-button" disabled={busy}>
        {busy ? t("working") : (label ?? t("actions.save"))}
      </button>
      {cancel && (
        <Link href={cancel} className="admin-button admin-secondary">
          {t("actions.cancel")}
        </Link>
      )}
    </div>
  );
}
