"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { Button } from "@/components/common/button";
import {
  contactSchema,
  projectTypes,
  type ContactInput,
} from "@/features/contact/schema";

const fieldClass =
  "mt-2 min-h-14 w-full rounded-xl border border-white/12 bg-white/[0.035] px-4 py-3 text-base text-paper outline-none transition-all placeholder:text-white/25 hover:border-white/25 focus:border-sand focus:bg-white/[0.06]";

export function ContactForm() {
  const locale = useLocale();
  const fr = locale === "fr";
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setError,
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      projectType: "wedding",
      preferredDate: "",
      location: "",
      budget: "",
      message: "",
      consent: false,
      website: "",
    },
  });

  async function submit(values: ContactInput) {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!response.ok)
      setError("root", {
        message: fr
          ? "L'envoi a échoué. Veuillez réessayer plus tard."
          : "Sending failed. Please try again later.",
      });
  }

  if (isSubmitSuccessful) {
    return (
      <div
        role="status"
        className="border-sand/50 bg-surface rounded-2xl border p-8"
      >
        <h2 className="font-display text-4xl">
          {fr ? "Merci pour votre message." : "Thank you for your message."}
        </h2>
        <p className="mt-4 text-white/50">
          {fr
            ? "Votre demande a bien été transmise."
            : "Your enquiry has been sent."}
        </p>
      </div>
    );
  }

  const errorText = fr ? "Vérifiez ce champ." : "Please check this field.";
  return (
    <form
      onSubmit={handleSubmit(submit)}
      noValidate
      className="grid gap-6 sm:grid-cols-2"
    >
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>
      <Field
        label={fr ? "Nom" : "Name"}
        id="name"
        error={errors.name?.message && errorText}
      >
        <input
          id="name"
          autoComplete="name"
          className={fieldClass}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "name-error" : undefined}
          {...register("name")}
        />
      </Field>
      <Field
        label="Email"
        id="email"
        error={errors.email?.message && errorText}
      >
        <input
          id="email"
          type="email"
          autoComplete="email"
          className={fieldClass}
          aria-invalid={Boolean(errors.email)}
          {...register("email")}
        />
      </Field>
      <Field
        label={fr ? "Téléphone ou WhatsApp" : "Phone or WhatsApp"}
        id="phone"
      >
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          className={fieldClass}
          {...register("phone")}
        />
      </Field>
      <Field
        label={fr ? "Type de projet" : "Project type"}
        id="projectType"
        error={errors.projectType?.message && errorText}
      >
        <select
          id="projectType"
          className={fieldClass}
          {...register("projectType")}
        >
          {projectTypes.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </Field>
      <Field
        label={fr ? "Date souhaitée" : "Preferred date"}
        id="preferredDate"
      >
        <input
          id="preferredDate"
          type="date"
          className={fieldClass}
          {...register("preferredDate")}
        />
      </Field>
      <Field
        label={fr ? "Lieu" : "Location"}
        id="location"
        error={errors.location?.message && errorText}
      >
        <input id="location" className={fieldClass} {...register("location")} />
      </Field>
      <Field label={fr ? "Budget estimé" : "Estimated budget"} id="budget">
        <input
          id="budget"
          className={fieldClass}
          placeholder={fr ? "Facultatif" : "Optional"}
          {...register("budget")}
        />
      </Field>
      <div className="hidden sm:block" aria-hidden="true" />
      <Field
        label={fr ? "Votre message" : "Your message"}
        id="message"
        error={
          errors.message?.message &&
          (fr
            ? "Ajoutez au moins 20 caractères."
            : "Please add at least 20 characters.")
        }
        className="sm:col-span-2"
      >
        <textarea
          id="message"
          rows={7}
          className={fieldClass}
          aria-invalid={Boolean(errors.message)}
          {...register("message")}
        />
      </Field>
      <label className="flex items-start gap-3 sm:col-span-2">
        <input
          type="checkbox"
          className="accent-sand mt-1 h-5 w-5"
          {...register("consent")}
        />
        <span className="text-sm leading-6">
          {fr
            ? "J'accepte que mes informations soient utilisées pour répondre à cette demande."
            : "I agree that my information may be used to respond to this enquiry."}
          {errors.consent ? (
            <span className="block text-red-300">{errorText}</span>
          ) : null}
        </span>
      </label>
      {errors.root ? (
        <p role="alert" className="text-red-300 sm:col-span-2">
          {errors.root.message}
        </p>
      ) : null}
      <div className="sm:col-span-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? fr
              ? "Envoi…"
              : "Sending…"
            : fr
              ? "Envoyer la demande"
              : "Send enquiry"}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  id,
  error,
  className = "",
  children,
}: {
  label: string;
  id: string;
  error?: string | false;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="text-sm font-semibold text-white/72">
        {label}
      </label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 text-sm text-red-300"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
