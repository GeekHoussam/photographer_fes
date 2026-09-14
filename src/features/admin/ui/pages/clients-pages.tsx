import Link from "next/link";
import { requireAdmin } from "../../server/auth";
import { getClient, listClients } from "../../server/clients";
import { listDocuments } from "../../server/documents";
import { listMessages } from "../../server/messages";
import { adminI18n } from "../../server/locale";
import { Details, Filters, PageHeading, Pagination } from "../primitives";
import { ClientForm } from "../basic-forms";
import { MutationButton } from "../controls";
import { ClientTable, DocumentTable, MessageList } from "../tables";
import {
  readQuery,
  recordOr404,
  type DetailProps,
  type SearchProps,
} from "./shared";

export async function ClientsPage(props: SearchProps) {
  const actor = await requireAdmin();
  const { t } = await adminI18n();
  const query = await readQuery(props);
  const data = await listClients(actor, query);
  return (
    <>
      <PageHeading
        title={t("nav.clients")}
        action={
          <Link className="admin-button" href="/admin/clients/new">
            {t("newClient")}
          </Link>
        }
      />
      <Filters path="/admin/clients" query={query} />
      <section className="admin-panel">
        <ClientTable items={data.items} />
        <Pagination {...data} path="/admin/clients" query={query} />
      </section>
    </>
  );
}
export async function NewClientPage() {
  await requireAdmin();
  const { t } = await adminI18n();
  return (
    <>
      <PageHeading title={t("newClient")} />
      <ClientForm />
    </>
  );
}
export async function EditClientPage({ params }: DetailProps) {
  const actor = await requireAdmin();
  const { id } = await params;
  const { t } = await adminI18n();
  const client = await recordOr404(() => getClient(actor, id));
  return (
    <>
      <PageHeading title={t("editClient")} />
      <ClientForm client={client} />
    </>
  );
}
export async function ClientDetailPage({ params }: DetailProps) {
  const actor = await requireAdmin();
  const { id } = await params;
  const { t } = await adminI18n();
  const client = await recordOr404(() => getClient(actor, id));
  const [estimates, invoices, messages] = await Promise.all([
    listDocuments(actor, "ESTIMATE", {}, id),
    listDocuments(actor, "INVOICE", {}, id),
    listMessages(actor, {}, client.email),
  ]);
  return (
    <>
      <PageHeading
        title={client.name}
        intro={t("clientDetails")}
        action={
          <div className="admin-actions">
            <Link className="admin-button" href={`/admin/clients/${id}/edit`}>
              {t("actions.edit")}
            </Link>
            <MutationButton
              path={`clients/${id}`}
              method="DELETE"
              confirmation={t("confirm.deleteClient")}
              redirectTo="/admin/clients"
              danger
            >
              {t("actions.delete")}
            </MutationButton>
          </div>
        }
      />
      <section className="admin-panel">
        <Details
          entries={(
            [
              "companyName",
              "email",
              "phone",
              "address",
              "city",
              "country",
              "notes",
            ] as const
          ).map((key) => [
            t(`fields.${key}`),
            <span
              key={key}
              dir={key === "email" || key === "phone" ? "ltr" : undefined}
            >
              {client[key]}
            </span>,
          ])}
        />
      </section>
      <section className="admin-panel">
        <div className="admin-section-heading">
          <h2>{t("nav.estimates")}</h2>
          <Link href={`/admin/estimates?clientId=${id}`}>
            {t("actions.viewAll")}
          </Link>
        </div>
        <DocumentTable items={estimates.items} resource="estimates" />
      </section>
      <section className="admin-panel">
        <div className="admin-section-heading">
          <h2>{t("nav.invoices")}</h2>
          <Link href={`/admin/invoices?clientId=${id}`}>
            {t("actions.viewAll")}
          </Link>
        </div>
        <DocumentTable items={invoices.items} resource="invoices" />
      </section>
      <section className="admin-panel">
        <div className="admin-section-heading">
          <h2>{t("relatedMessages")}</h2>
          <Link href={`/admin/messages?q=${encodeURIComponent(client.email)}`}>
            {t("actions.viewAll")}
          </Link>
        </div>
        <MessageList items={messages.items} />
      </section>
    </>
  );
}
