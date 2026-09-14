import Link from "next/link";
import { requireAdmin } from "../../server/auth";
import { getOverview } from "../../server/overview";
import { adminI18n } from "../../server/locale";
import { PageHeading } from "../primitives";
import { DocumentTable, MessageList } from "../tables";

export async function OverviewPage() {
  const actor = await requireAdmin();
  const { t } = await adminI18n();
  const data = await getOverview(actor);
  const destinations: Record<string, string> = {
    clients: "clients",
    estimates: "estimates",
    pendingEstimates: "estimates?status=SENT",
    invoices: "invoices",
    paidInvoices: "invoices?status=PAID",
    unpaidInvoices: "invoices",
    unreadMessages: "messages?status=UNREAD",
  };
  return (
    <>
      <PageHeading title={t("welcome")} intro={t("overviewIntro")} />
      <div className="admin-stat-grid">
        {Object.entries(data.counts).map(([key, value]) => (
          <Link
            href={`/admin/${destinations[key]}`}
            className="admin-stat"
            key={key}
          >
            <span>{t(`stats.${key}`)}</span>
            <strong>{value}</strong>
          </Link>
        ))}
      </div>
      <section className="admin-panel">
        <div className="admin-section-heading">
          <h2>{t("recentMessages")}</h2>
          <Link href="/admin/messages">{t("actions.viewAll")}</Link>
        </div>
        <MessageList items={data.messages} />
      </section>
      <section className="admin-panel">
        <div className="admin-section-heading">
          <h2>{t("recentEstimates")}</h2>
          <Link href="/admin/estimates">{t("actions.viewAll")}</Link>
        </div>
        <DocumentTable items={data.estimates} resource="estimates" />
      </section>
      <section className="admin-panel">
        <div className="admin-section-heading">
          <h2>{t("recentInvoices")}</h2>
          <Link href="/admin/invoices">{t("actions.viewAll")}</Link>
        </div>
        <DocumentTable items={data.invoices} resource="invoices" />
      </section>
    </>
  );
}
