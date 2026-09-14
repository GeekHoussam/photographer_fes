"use client";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { adminRequest } from "./api-client";

export function ErrorNotice({ code }: { code: string }) {
  const t = useTranslations("admin");
  return (
    <p role="alert" className="admin-alert">
      {t(t.has(`errors.${code}`) ? `errors.${code}` : "errors.unavailable")}
    </p>
  );
}
export function LanguageSelector() {
  const locale = useLocale();
  const t = useTranslations("admin");
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <div>
      <label className="admin-language">
        <span className="sr-only">{t("language")}</span>
        <select
          aria-label={t("language")}
          value={locale}
          disabled={busy}
          onChange={async (event) => {
            setBusy(true);
            setError("");
            try {
              await adminRequest("preferences", "PATCH", {
                locale: event.target.value,
              });
              router.refresh();
            } catch (e) {
              setError(e instanceof Error ? e.message : "unavailable");
            } finally {
              setBusy(false);
            }
          }}
        >
          <option value="en">EN</option>
          <option value="fr">FR</option>
          <option value="ar">AR</option>
        </select>
      </label>
      {error && <ErrorNotice code={error} />}
    </div>
  );
}
export function MutationButton({
  path,
  method = "PATCH",
  data = {},
  children,
  confirmation,
  redirectTo,
  resultBase,
  danger = false,
}: {
  path: string;
  method?: string;
  data?: unknown;
  children: ReactNode;
  confirmation?: string;
  redirectTo?: string;
  resultBase?: string;
  danger?: boolean;
}) {
  const router = useRouter();
  const t = useTranslations("admin");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <div className="admin-inline-action">
      <button
        type="button"
        className={`admin-button ${danger ? "admin-danger" : "admin-secondary"}`}
        disabled={busy}
        onClick={async () => {
          if (confirmation && !window.confirm(confirmation)) return;
          setBusy(true);
          setError("");
          try {
            const result = await adminRequest(path, method, data);
            if (resultBase && result.id)
              router.push(`${resultBase}/${result.id}`);
            else if (redirectTo) router.push(redirectTo);
            router.refresh();
          } catch (e) {
            setError(e instanceof Error ? e.message : "unavailable");
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? t("working") : children}
      </button>
      {error && <ErrorNotice code={error} />}
    </div>
  );
}
export function MarkMessageRead({
  id,
  isRead,
}: {
  id: string;
  isRead: boolean;
}) {
  const router = useRouter();
  const attempted = useRef(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;
    if (isRead) return;
    void adminRequest(`messages/${id}`, "PATCH", { isRead: true })
      .then(() => router.refresh())
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "unavailable"),
      );
  }, [id, isRead, router]);
  return error ? <ErrorNotice code={error} /> : null;
}
export function PrintButton() {
  const t = useTranslations("admin");
  return (
    <button
      className="admin-button admin-secondary"
      onClick={() => window.print()}
    >
      {t("actions.print")}
    </button>
  );
}
