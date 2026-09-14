"use client";
import { useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations, useLocale } from "next-intl";
import {
  documentSchema,
  currencies,
  type DocumentInput,
  type DocumentKind,
} from "../schema";
import type { ClientRecord, FinancialDocument } from "../types";
import { calculateDocument, decimalFromMinor, formatMoney } from "../money";
import { FormActions, FormFeedback, useSave } from "./form-shared";

export function DocumentForm({
  kind,
  document,
  clients,
  defaultCurrency,
}: {
  kind: DocumentKind;
  document?: FinancialDocument;
  clients: ClientRecord[];
  defaultCurrency: DocumentInput["currency"];
}) {
  const t = useTranslations("admin");
  const locale = useLocale();
  const { save, error } = useSave();
  const resource = kind === "ESTIMATE" ? "estimates" : "invoices";
  const [options, setOptions] = useState(clients);
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DocumentInput>({
    resolver: zodResolver(documentSchema),
    defaultValues: document
      ? {
          clientId: document.clientId,
          issueDate: document.issueDate,
          dueDate: document.dueDate,
          currency: document.currency,
          discount: decimalFromMinor(document.discount),
          notes: document.notes,
          terms: document.terms,
          items: document.items.map(
            ({ description, quantity, unitPrice, taxRate }) => ({
              description,
              quantity,
              unitPrice,
              taxRate,
            }),
          ),
        }
      : {
          clientId: "",
          issueDate: today,
          dueDate: today,
          currency: defaultCurrency,
          discount: "0.00",
          notes: "",
          terms: "",
          items: [
            { description: "", quantity: "1", unitPrice: "0.00", taxRate: "0" },
          ],
        },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const values = useWatch({ control });
  let preview: ReturnType<typeof calculateDocument> | undefined;
  try {
    const parsed = documentSchema.safeParse(values);
    if (parsed.success) preview = calculateDocument(parsed.data);
  } catch {
    /* Invalid draft values are reported by the form and server. */
  }
  const selectedClient = values.clientId;
  const mergedOptions =
    document && !options.some((client) => client.id === document.clientId)
      ? [{ ...document.client, id: document.clientId }, ...options]
      : options;
  return (
    <form
      className="admin-form"
      noValidate
      onSubmit={handleSubmit((data) =>
        save(
          document ? `${resource}/${document.id}` : resource,
          document ? "PATCH" : "POST",
          document ? { document: data, revision: document.revision } : data,
          undefined,
          `/admin/${resource}`,
        ).then(() => undefined),
      )}
    >
      <section className="admin-panel">
        <h2>{t("details")}</h2>
        <div className="admin-client-search">
          <label>
            {t("searchClients")}
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              maxLength={100}
            />
          </label>
          <button
            type="button"
            className="admin-button admin-secondary"
            disabled={searching}
            onClick={async () => {
              setSearching(true);
              setSearchError("");
              try {
                const response = await fetch(
                  `/api/admin/clients?q=${encodeURIComponent(search)}`,
                  { cache: "no-store" },
                );
                if (!response.ok) throw new Error();
                const result = await response.json();
                setOptions((previous) => {
                  const selected = previous.find(
                    (item) => item.id === selectedClient,
                  );
                  return selected &&
                    !result.items.some(
                      (item: ClientRecord) => item.id === selected.id,
                    )
                    ? [selected, ...result.items]
                    : result.items;
                });
              } catch {
                setSearchError("unavailable");
              } finally {
                setSearching(false);
              }
            }}
          >
            {t(searching ? "working" : "actions.search")}
          </button>
        </div>
        <FormFeedback error={searchError} />
        <div className="admin-form-grid">
          <label>
            {t("fields.clientId")}
            <select
              {...register("clientId")}
              aria-invalid={Boolean(errors.clientId)}
              required
            >
              <option value="">—</option>
              {mergedOptions.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} · {client.email}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t("fields.currency")}
            <select {...register("currency")}>
              {currencies.map((currency) => (
                <option key={currency}>{currency}</option>
              ))}
            </select>
          </label>
          <label>
            {t("fields.issueDate")}
            <input
              type="date"
              {...register("issueDate")}
              aria-invalid={Boolean(errors.issueDate)}
            />
          </label>
          <label>
            {t(kind === "ESTIMATE" ? "fields.expiryDate" : "fields.dueDate")}
            <input
              type="date"
              {...register("dueDate")}
              aria-invalid={Boolean(errors.dueDate)}
            />
          </label>
        </div>
        <p className="admin-muted">{t("numberHint")}</p>
      </section>
      <section className="admin-panel">
        <h2>{t("items")}</h2>
        <p className="admin-muted">{t("financialHint")}</p>
        <div className="admin-line-items">
          {fields.map((field, index) => (
            <fieldset key={field.id}>
              <legend>
                {t("items")} {index + 1}
              </legend>
              <div className="admin-item-grid">
                {(
                  ["description", "quantity", "unitPrice", "taxRate"] as const
                ).map((key) => (
                  <label key={key}>
                    {t(`fields.${key}`)}
                    <input
                      {...register(`items.${index}.${key}`)}
                      inputMode={key === "description" ? "text" : "decimal"}
                      dir={key === "description" ? undefined : "ltr"}
                      aria-invalid={Boolean(errors.items?.[index]?.[key])}
                    />
                  </label>
                ))}
                <button
                  className="admin-button admin-secondary"
                  type="button"
                  disabled={fields.length === 1}
                  aria-label={`${t("actions.removeItem")} ${index + 1}`}
                  onClick={() => remove(index)}
                >
                  {t("actions.removeItem")}
                </button>
              </div>
            </fieldset>
          ))}
        </div>
        <button
          className="admin-button admin-secondary"
          type="button"
          disabled={fields.length >= 50}
          onClick={() =>
            append({
              description: "",
              quantity: "1",
              unitPrice: "0.00",
              taxRate: "0",
            })
          }
        >
          {t("actions.addItem")}
        </button>
      </section>
      <section className="admin-panel">
        <div className="admin-form-grid">
          <label>
            {t("fields.discount")}
            <input
              inputMode="decimal"
              dir="ltr"
              {...register("discount")}
              aria-invalid={Boolean(errors.discount)}
            />
          </label>
          <div className="admin-total-preview" aria-live="polite">
            {preview &&
              (["subtotal", "tax", "total"] as const).map((key) => (
                <p key={key}>
                  <span>{t(`fields.${key}`)}</span>
                  <bdi>
                    {formatMoney(
                      preview[key],
                      values.currency ?? defaultCurrency,
                      locale,
                    )}
                  </bdi>
                </p>
              ))}
          </div>
          <label>
            {t("fields.notes")}
            <textarea rows={4} {...register("notes")} />
          </label>
          <label>
            {t("fields.terms")}
            <textarea rows={4} {...register("terms")} />
          </label>
        </div>
      </section>
      <FormFeedback error={error} invalid={Object.keys(errors).length > 0} />
      <FormActions
        busy={isSubmitting}
        cancel={
          document ? `/admin/${resource}/${document.id}` : `/admin/${resource}`
        }
      />
    </form>
  );
}
