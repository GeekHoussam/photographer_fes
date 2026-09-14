"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  clientSchema,
  settingsSchema,
  loginSchema,
  currencies,
  type ClientInput,
  type SettingsInput,
} from "../schema";
import type { ClientRecord } from "../types";
import { FormActions, FormFeedback, useSave } from "./form-shared";

export function LoginForm() {
  const t = useTranslations("admin");
  const { save, error } = useSave();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  return (
    <form
      className="admin-form"
      onSubmit={handleSubmit((values) =>
        save("auth/login", "POST", values, "/admin").then(() => undefined),
      )}
      noValidate
    >
      <label>
        {t("fields.email")}
        <input
          type="email"
          autoComplete="username"
          dir="ltr"
          {...register("email")}
          aria-invalid={Boolean(errors.email)}
        />
      </label>
      <label>
        {t("fields.password")}
        <input
          type="password"
          autoComplete="current-password"
          dir="ltr"
          {...register("password")}
          aria-invalid={Boolean(errors.password)}
        />
      </label>
      <FormFeedback error={error} invalid={Object.keys(errors).length > 0} />
      <FormActions busy={isSubmitting} label={t("login")} />
    </form>
  );
}
export function ClientForm({ client }: { client?: ClientRecord }) {
  const t = useTranslations("admin");
  const { save, error } = useSave();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ClientInput>({
    resolver: zodResolver(clientSchema),
    defaultValues: client
      ? {
          name: client.name,
          companyName: client.companyName,
          email: client.email,
          phone: client.phone,
          address: client.address,
          city: client.city,
          country: client.country,
          notes: client.notes,
        }
      : {
          name: "",
          companyName: "",
          email: "",
          phone: "",
          address: "",
          city: "",
          country: "",
          notes: "",
        },
  });
  return (
    <form
      className="admin-form admin-panel"
      noValidate
      onSubmit={handleSubmit((values) =>
        save(
          client ? `clients/${client.id}` : "clients",
          client ? "PATCH" : "POST",
          values,
          undefined,
          "/admin/clients",
        ).then(() => undefined),
      )}
    >
      <div className="admin-form-grid">
        {(
          [
            "name",
            "companyName",
            "email",
            "phone",
            "address",
            "city",
            "country",
            "notes",
          ] as const
        ).map((key) => (
          <label key={key}>
            {t(`fields.${key}`)}
            {key === "notes" || key === "address" ? (
              <textarea
                rows={key === "notes" ? 4 : 2}
                {...register(key)}
                aria-invalid={Boolean(errors[key])}
              />
            ) : (
              <input
                {...register(key)}
                type={key === "email" ? "email" : "text"}
                dir={key === "email" || key === "phone" ? "ltr" : undefined}
                aria-invalid={Boolean(errors[key])}
                required={key === "name" || key === "email"}
              />
            )}
          </label>
        ))}
      </div>
      <FormFeedback error={error} invalid={Object.keys(errors).length > 0} />
      <FormActions
        busy={isSubmitting}
        cancel={client ? `/admin/clients/${client.id}` : "/admin/clients"}
      />
    </form>
  );
}
export function SettingsForm({ settings }: { settings: SettingsInput }) {
  const t = useTranslations("admin");
  const { save, error, saved } = useSave();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SettingsInput>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings,
  });
  return (
    <form
      className="admin-form admin-panel"
      noValidate
      onSubmit={handleSubmit((values) =>
        save("settings", "PATCH", values).then(() => undefined),
      )}
    >
      <label>
        {t("defaultCurrency")}
        <select {...register("currency")}>
          {currencies.map((currency) => (
            <option key={currency}>{currency}</option>
          ))}
        </select>
      </label>
      <div className="admin-form-grid">
        {(
          [
            "issuerName",
            "issuerAddress",
            "issuerEmail",
            "issuerRegistration",
          ] as const
        ).map((key) => (
          <label key={key}>
            {t(`fields.${key}`)}
            {key === "issuerAddress" ? (
              <textarea
                rows={3}
                {...register(key)}
                aria-invalid={Boolean(errors[key])}
              />
            ) : (
              <input
                {...register(key)}
                type={key === "issuerEmail" ? "email" : "text"}
                aria-invalid={Boolean(errors[key])}
              />
            )}
          </label>
        ))}
      </div>
      <p className="admin-muted">{t("billingHint")}</p>
      <FormFeedback
        error={error}
        saved={saved}
        invalid={Object.keys(errors).length > 0}
      />
      <FormActions busy={isSubmitting} />
    </form>
  );
}
