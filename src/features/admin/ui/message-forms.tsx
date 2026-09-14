"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { decimal } from "../schema";
import { decimalFromMinor } from "../money";
import { FormActions, FormFeedback, useSave } from "./form-shared";

const replyFormSchema = z.object({
  content: z.string().trim().min(1).max(5000),
});
export function ReplyForm({
  messageId,
  configured,
}: {
  messageId: string;
  configured: boolean;
}) {
  const t = useTranslations("admin");
  const { save, error } = useSave();
  const [request, setRequest] = useState<{
    id: string;
    content: string;
  } | null>(null);
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(replyFormSchema),
    defaultValues: { content: "" },
  });
  return (
    <section className="admin-panel">
      <h2>{t("reply")}</h2>
      <p className="admin-muted">{t("replyHint")}</p>
      {!configured ? (
        <p className="admin-alert">{t("emailUnavailable")}</p>
      ) : (
        <form
          className="admin-form"
          onSubmit={handleSubmit(async (values) => {
            setSent(false);
            const attempt =
              request?.content === values.content
                ? request
                : {
                    id: crypto.randomUUID(),
                    content: values.content,
                  };
            setRequest(attempt);
            if (
              await save(`messages/${messageId}/reply`, "POST", {
                content: values.content,
                requestId: attempt.id,
              })
            ) {
              reset();
              setRequest(null);
              setSent(true);
            }
          })}
        >
          <label>
            {t("fields.content")}
            <textarea
              rows={6}
              {...register("content")}
              aria-invalid={Boolean(errors.content)}
              maxLength={5000}
            />
          </label>
          <FormFeedback
            error={error}
            invalid={Object.keys(errors).length > 0}
          />
          {sent && <p role="status">{t("replySuccess")}</p>}
          <FormActions busy={isSubmitting} label={t("actions.reply")} />
        </form>
      )}
    </section>
  );
}
const paymentSchema = z.object({ amountPaid: decimal });
export function PaymentForm({
  id,
  revision,
  amountPaid,
}: {
  id: string;
  revision: number;
  amountPaid: number;
}) {
  const t = useTranslations("admin");
  const { save, error, saved } = useSave();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: { amountPaid: decimalFromMinor(amountPaid) },
  });
  return (
    <form
      className="admin-form admin-panel no-print"
      onSubmit={handleSubmit((data) =>
        save(`invoices/${id}/payment`, "POST", { ...data, revision }).then(
          () => undefined,
        ),
      )}
    >
      <h2>{t("actions.recordPayment")}</h2>
      <p className="admin-muted">{t("paymentHint")}</p>
      <label>
        {t("fields.amountPaid")}
        <input
          {...register("amountPaid")}
          inputMode="decimal"
          dir="ltr"
          aria-invalid={Boolean(errors.amountPaid)}
        />
      </label>
      <FormFeedback
        error={error}
        saved={saved}
        invalid={Object.keys(errors).length > 0}
      />
      <FormActions busy={isSubmitting} />
    </form>
  );
}
