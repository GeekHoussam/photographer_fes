import Link from "next/link";
import { requireAdmin } from "../../server/auth";
import { getDocument, listDocuments } from "../../server/documents";
import { listClients } from "../../server/clients";
import { getSettings } from "../../server/settings";
import { adminI18n } from "../../server/locale";
import {
  estimateStatuses,
  invoiceStatuses,
  type DocumentKind,
} from "../../schema";
import { DocumentTable } from "../tables";
import {
  Details,
  DateValue,
  Filters,
  Money,
  PageHeading,
  Pagination,
  StatusBadge,
} from "../primitives";
import { DocumentForm } from "../document-form";
import { MutationButton, PrintButton } from "../controls";
import { PaymentForm } from "../message-forms";
import {
  readQuery,
  recordOr404,
  type DetailProps,
  type SearchProps,
} from "./shared";

async function DocumentsPage({
  kind,
  ...props
}: SearchProps & { kind: DocumentKind }) {
  const actor = await requireAdmin();
  const { t } = await adminI18n();
  const query = await readQuery(props);
  const resource = kind === "ESTIMATE" ? "estimates" : "invoices";
  const raw = await props.searchParams;
  const clientId = typeof raw.clientId === "string" ? raw.clientId : undefined;
  const data = await recordOr404(() =>
    listDocuments(actor, kind, query, clientId),
  );
  return (
    <>
      <PageHeading
        title={t(`nav.${resource}`)}
        action={
          <Link className="admin-button" href={`/admin/${resource}/new`}>
            {t(kind === "ESTIMATE" ? "newEstimate" : "newInvoice")}
          </Link>
        }
      />
      <Filters
        path={`/admin/${resource}`}
        query={query}
        statuses={kind === "ESTIMATE" ? estimateStatuses : invoiceStatuses}
      />
      <section className="admin-panel">
        <DocumentTable items={data.items} resource={resource} />
        <Pagination {...data} path={`/admin/${resource}`} query={query} />
      </section>
    </>
  );
}
async function DocumentEditor({
  kind,
  params,
}: {
  kind: DocumentKind;
  params?: DetailProps["params"];
}) {
  const actor = await requireAdmin();
  const { t } = await adminI18n();
  const id = params ? (await params).id : undefined;
  const [clients, settings, document] = await Promise.all([
    listClients(actor),
    getSettings(actor),
    id ? recordOr404(() => getDocument(actor, kind, id)) : undefined,
  ]);
  return (
    <>
      <PageHeading
        title={t(
          document
            ? "editDocument"
            : kind === "ESTIMATE"
              ? "newEstimate"
              : "newInvoice",
        )}
      />
      {document && document.status !== "DRAFT" ? (
        <p className="admin-alert">{t("draftHint")}</p>
      ) : (
        <DocumentForm
          kind={kind}
          document={document}
          clients={clients.items}
          defaultCurrency={settings.currency}
        />
      )}
    </>
  );
}
async function DocumentDetail({
  kind,
  params,
}: DetailProps & { kind: DocumentKind }) {
  const actor = await requireAdmin();
  const { id } = await params;
  const { t } = await adminI18n();
  const doc = await recordOr404(() => getDocument(actor, kind, id));
  const resource = kind === "ESTIMATE" ? "estimates" : "invoices";
  const statusAction = (
    status: string,
    label: string,
    confirmation?: string,
  ) => (
    <MutationButton
      path={`${resource}/${id}/status`}
      data={{ status, revision: doc.revision }}
      confirmation={confirmation}
    >
      {label}
    </MutationButton>
  );
  return (
    <>
      <div className="no-print">
        <PageHeading
          title={doc.number}
          intro={t(`nav.${resource}`)}
          action={<PrintButton />}
        />
        <div className="admin-actions">
          {doc.status === "DRAFT" && (
            <>
              <Link
                className="admin-button"
                href={`/admin/${resource}/${id}/edit`}
              >
                {t("actions.edit")}
              </Link>
              {statusAction(
                "SENT",
                t("actions.markSent"),
                t("confirm.markSent"),
              )}
              <MutationButton
                path={`${resource}/${id}`}
                method="DELETE"
                data={{ revision: doc.revision }}
                confirmation={t("confirm.deleteDocument")}
                redirectTo={`/admin/${resource}`}
                danger
              >
                {t("actions.delete")}
              </MutationButton>
            </>
          )}
          {kind === "ESTIMATE" && doc.status === "SENT" && (
            <>
              {statusAction("ACCEPTED", t("actions.accept"))}
              {statusAction("REJECTED", t("actions.reject"))}
            </>
          )}
          {kind === "ESTIMATE" && doc.status === "ACCEPTED" && (
            <MutationButton
              path={`estimates/${id}/convert`}
              method="POST"
              resultBase="/admin/invoices"
            >
              {t("actions.convert")}
            </MutationButton>
          )}
          {kind === "INVOICE" &&
            ["SENT", "PARTIALLY_PAID", "OVERDUE"].includes(doc.status) &&
            statusAction("PAID", t("actions.markPaid"), t("confirm.markPaid"))}
          {kind === "INVOICE" &&
            ["DRAFT", "SENT", "OVERDUE"].includes(doc.status) &&
            doc.amountPaid === 0 &&
            statusAction(
              "CANCELLED",
              t("actions.cancelInvoice"),
              t("confirm.cancelInvoice"),
            )}
        </div>
        <p className="admin-muted">
          {t("draftHint")} {t("printHint")}
        </p>
      </div>
      <article className="admin-panel admin-document">
        <div className="admin-document-heading">
          <div>
            <h2>{doc.issuer.issuerName || t("billing")}</h2>
            <p>{doc.issuer.issuerAddress}</p>
            <p>
              <bdi>{doc.issuer.issuerEmail}</bdi>
            </p>
            <p>{doc.issuer.issuerRegistration}</p>
          </div>
          <div>
            <p>{t(`nav.${resource}`)}</p>
            <h2 dir="ltr">{doc.number}</h2>
            <StatusBadge status={doc.status} />
          </div>
        </div>
        <Details
          entries={[
            [
              t("fields.clientId"),
              <div key="client">
                <strong>{doc.client.name}</strong>
                <p>{doc.client.companyName}</p>
                <p>
                  {[doc.client.address, doc.client.city, doc.client.country]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                <bdi>{doc.client.email}</bdi>
              </div>,
            ],
            [
              t("fields.issueDate"),
              <DateValue key="issued" value={doc.issueDate} />,
            ],
            [
              t(kind === "ESTIMATE" ? "fields.expiryDate" : "fields.dueDate"),
              <DateValue key="due" value={doc.dueDate} />,
            ],
          ]}
        />
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                {[
                  "description",
                  "quantity",
                  "unitPrice",
                  "taxRate",
                  "total",
                ].map((key) => (
                  <th key={key} scope="col">
                    {t(`fields.${key}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {doc.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.description}</td>
                  <td>
                    <bdi>{item.quantity}</bdi>
                  </td>
                  <td>
                    <bdi>
                      {item.unitPrice} {doc.currency}
                    </bdi>
                  </td>
                  <td>
                    <bdi>{item.taxRate}%</bdi>
                  </td>
                  <td>
                    <Money value={item.total} currency={doc.currency} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <dl className="admin-document-totals">
          {(["subtotal", "discount", "tax", "total"] as const).map((key) => (
            <div key={key}>
              <dt>{t(`fields.${key}`)}</dt>
              <dd>
                <Money value={doc[key]} currency={doc.currency} />
              </dd>
            </div>
          ))}
          {kind === "INVOICE" && (
            <>
              <div>
                <dt>{t("fields.amountPaid")}</dt>
                <dd>
                  <Money value={doc.amountPaid} currency={doc.currency} />
                </dd>
              </div>
              <div>
                <dt>{t("fields.balance")}</dt>
                <dd>
                  <Money
                    value={doc.total - doc.amountPaid}
                    currency={doc.currency}
                  />
                </dd>
              </div>
            </>
          )}
        </dl>
        {doc.notes && (
          <section>
            <h3>{t("fields.notes")}</h3>
            <p className="admin-preserve">{doc.notes}</p>
          </section>
        )}
        {doc.terms && (
          <section>
            <h3>{t("fields.terms")}</h3>
            <p className="admin-preserve">{doc.terms}</p>
          </section>
        )}
        {doc.sourceEstimateId && (
          <p className="no-print">
            <Link href={`/admin/estimates/${doc.sourceEstimateId}`}>
              {t("sourceEstimate")}
            </Link>
          </p>
        )}
      </article>
      {kind === "INVOICE" &&
        ["SENT", "PARTIALLY_PAID", "OVERDUE"].includes(doc.status) && (
          <PaymentForm
            key={doc.revision}
            id={id}
            revision={doc.revision}
            amountPaid={doc.amountPaid}
          />
        )}
    </>
  );
}
export const EstimatesPage = (props: SearchProps) => (
  <DocumentsPage {...props} kind="ESTIMATE" />
);
export const InvoicesPage = (props: SearchProps) => (
  <DocumentsPage {...props} kind="INVOICE" />
);
export const NewEstimatePage = () => <DocumentEditor kind="ESTIMATE" />;
export const NewInvoicePage = () => <DocumentEditor kind="INVOICE" />;
export const EditEstimatePage = (props: DetailProps) => (
  <DocumentEditor {...props} kind="ESTIMATE" />
);
export const EditInvoicePage = (props: DetailProps) => (
  <DocumentEditor {...props} kind="INVOICE" />
);
export const EstimateDetailPage = (props: DetailProps) => (
  <DocumentDetail {...props} kind="ESTIMATE" />
);
export const InvoiceDetailPage = (props: DetailProps) => (
  <DocumentDetail {...props} kind="INVOICE" />
);
