"use client";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";
import type { ListQuery } from "../schema";
import { formatMoney } from "../money";

export function PageHeading({
  title,
  intro,
  action,
}: {
  title: string;
  intro?: string;
  action?: ReactNode;
}) {
  return (
    <div className="admin-page-heading">
      <div>
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
      </div>
      {action}
    </div>
  );
}
export function EmptyState({ filtered = false }: { filtered?: boolean }) {
  const t = useTranslations("admin");
  return (
    <div className="admin-empty">
      <p>{t(filtered ? "noResults" : "noRecords")}</p>
      <span>{t("emptyHint")}</span>
    </div>
  );
}
export function StatusBadge({ status }: { status: string }) {
  const t = useTranslations("admin");
  return (
    <span className={`admin-status status-${status.toLowerCase()}`}>
      {t.has(`statuses.${status}`) ? t(`statuses.${status}`) : status}
    </span>
  );
}
export function Money({
  value,
  currency,
}: {
  value: number;
  currency: string;
}) {
  const locale = useLocale();
  return (
    <bdi className="admin-money">{formatMoney(value, currency, locale)}</bdi>
  );
}
export function DateValue({
  value,
  withTime = false,
}: {
  value: string;
  withTime?: boolean;
}) {
  const locale = useLocale();
  const date = new Date(value.length === 10 ? `${value}T12:00:00Z` : value);
  return (
    <time dateTime={value}>
      {new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        ...(withTime ? { timeStyle: "short" as const } : {}),
        timeZone: "Africa/Casablanca",
      }).format(date)}
    </time>
  );
}
export function Filters({
  path,
  query,
  statuses = [],
}: {
  path: string;
  query: ListQuery;
  statuses?: readonly string[];
}) {
  const t = useTranslations("admin");
  return (
    <form action={path} className="admin-filters">
      {query.clientId && (
        <input type="hidden" name="clientId" value={query.clientId} />
      )}
      <label>
        <span className="sr-only">{t("actions.search")}</span>
        <input
          name="q"
          defaultValue={query.q}
          placeholder={t("actions.search")}
          maxLength={100}
        />
      </label>
      {statuses.length > 0 && (
        <label>
          <span className="sr-only">{t("fields.status")}</span>
          <select name="status" defaultValue={query.status}>
            <option value="">{t("statuses.ALL")}</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {t(`statuses.${status}`)}
              </option>
            ))}
          </select>
        </label>
      )}
      <button className="admin-button admin-secondary">
        {t("actions.search")}
      </button>
      {(query.q || query.status || query.clientId) && (
        <Link href={path}>{t("actions.clear")}</Link>
      )}
    </form>
  );
}
export function Pagination({
  total,
  page,
  pageSize,
  path,
  query,
}: {
  total: number;
  page: number;
  pageSize: number;
  path: string;
  query?: Partial<ListQuery>;
}) {
  const t = useTranslations("admin");
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const href = (p: number) =>
    `${path}?${new URLSearchParams({ q: query?.q ?? "", status: query?.status ?? "", clientId: query?.clientId ?? "", page: String(p) })}`;
  return (
    <div className="admin-pagination">
      <span>
        {t("count", { count: total })} · {t("page", { page, pages })}
      </span>
      <div>
        {page > 1 && <Link href={href(page - 1)}>{t("actions.previous")}</Link>}
        {page < pages && <Link href={href(page + 1)}>{t("actions.next")}</Link>}
      </div>
    </div>
  );
}
export function Details({ entries }: { entries: [string, ReactNode][] }) {
  return (
    <dl className="admin-details">
      {entries.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}
