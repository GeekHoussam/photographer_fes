"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { ClientRecord, DocumentSummary, ContactMessage } from "../types";
import { DateValue, EmptyState, Money, StatusBadge } from "./primitives";

export function ClientTable({ items }: { items: ClientRecord[] }) {
  const t = useTranslations("admin");
  if (!items.length) return <EmptyState />;
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {["name", "email", "phone", "city"].map((key) => (
              <th scope="col" key={key}>
                {t(`fields.${key}`)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((client) => (
            <tr key={client.id}>
              <td>
                <Link href={`/admin/clients/${client.id}`}>{client.name}</Link>
                {client.companyName && <small>{client.companyName}</small>}
              </td>
              <td>
                <bdi>{client.email}</bdi>
              </td>
              <td>
                <bdi>{client.phone || "—"}</bdi>
              </td>
              <td>{client.city || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function DocumentTable({
  items,
  resource,
}: {
  items: DocumentSummary[];
  resource: "estimates" | "invoices";
}) {
  const t = useTranslations("admin");
  if (!items.length) return <EmptyState />;
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {["number", "clientId", "status", "total", "issueDate"].map(
              (key) => (
                <th scope="col" key={key}>
                  {t(`fields.${key}`)}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {items.map((doc) => (
            <tr key={doc.id}>
              <td>
                <Link href={`/admin/${resource}/${doc.id}`}>
                  <bdi>{doc.number}</bdi>
                </Link>
              </td>
              <td>{doc.clientName}</td>
              <td>
                <StatusBadge status={doc.status} />
              </td>
              <td>
                <Money value={doc.total} currency={doc.currency} />
              </td>
              <td>
                <DateValue value={doc.issueDate} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function MessageList({ items }: { items: ContactMessage[] }) {
  const t = useTranslations("admin");
  if (!items.length) return <EmptyState />;
  return (
    <div className="admin-message-list">
      {items.map((message) => (
        <Link
          className={`admin-message-row ${!message.isRead ? "is-unread" : ""}`}
          href={`/admin/messages/${message.id}`}
          key={message.id}
        >
          <div className="admin-message-row-heading">
            <strong>{message.name}</strong>
            <DateValue value={message.createdAt} />
          </div>
          <div>
            <bdi>{message.email}</bdi> ·{" "}
            {t(`projectTypes.${message.projectType}`)}
          </div>
          <p>{message.message.slice(0, 150)}</p>
          <StatusBadge status={!message.isRead ? "UNREAD" : message.status} />
        </Link>
      ))}
    </div>
  );
}
