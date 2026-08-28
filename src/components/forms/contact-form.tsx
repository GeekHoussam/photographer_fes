"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { Button } from "@/components/common/button";
import type { Locale } from "@/config/site";
import {
  contactSchema,
  projectTypes,
  type ContactInput,
} from "@/features/contact/schema";

const fieldClass =
  "contact-form-control mt-2 min-h-14 w-full rounded-xl border border-white/12 bg-white/[0.035] px-4 py-3 text-base text-paper outline-none transition-all placeholder:text-white/25 hover:border-white/25 focus:border-sand focus:bg-white/[0.06]";

type ContactFormCopy = {
  subject: (name: string) => string;
  mailLabels: {
    name: string;
    phone: string;
    project: string;
    date: string;
    location: string;
    budget: string;
  };
  sendFailure: string;
  successTitle: string;
  mailOpened: string;
  sent: string;
  error: string;
  name: string;
  phone: string;
  projectType: string;
  preferredDate: string;
  location: string;
  budget: string;
  optional: string;
  message: string;
  messageError: string;
  consent: string;
  sending: string;
  submit: string;
  projectTypes: Record<(typeof projectTypes)[number], string>;
};

const contactFormCopy: Record<Locale, ContactFormCopy> = {
  fr: {
    subject: (name) => `Demande photo — ${name}`,
    mailLabels: {
      name: "Nom",
      phone: "Téléphone",
      project: "Projet",
      date: "Date",
      location: "Lieu",
      budget: "Budget",
    },
    sendFailure: "L'envoi a échoué. Veuillez réessayer plus tard.",
    successTitle: "Merci pour votre message.",
    mailOpened: "Votre application e-mail a été ouverte avec votre message.",
    sent: "Votre demande a bien été transmise.",
    error: "Vérifiez ce champ.",
    name: "Nom",
    phone: "Téléphone ou WhatsApp",
    projectType: "Type de projet",
    preferredDate: "Date souhaitée",
    location: "Lieu",
    budget: "Budget estimé",
    optional: "Facultatif",
    message: "Votre message",
    messageError: "Ajoutez au moins 20 caractères.",
    consent:
      "J'accepte que mes informations soient utilisées pour répondre à cette demande.",
    sending: "Envoi…",
    submit: "Envoyer la demande",
    projectTypes: {
      wedding: "Mariage",
      event: "Événement",
      corporate: "Corporate",
      product: "Produit",
      food: "Gastronomie",
      hospitality: "Hôtellerie ou intérieur",
      portrait: "Portrait",
      video: "Vidéo",
      other: "Autre projet",
    },
  },
  en: {
    subject: (name) => `Photography enquiry — ${name}`,
    mailLabels: {
      name: "Name",
      phone: "Phone",
      project: "Project",
      date: "Date",
      location: "Location",
      budget: "Budget",
    },
    sendFailure: "Sending failed. Please try again later.",
    successTitle: "Thank you for your message.",
    mailOpened: "Your email application has opened with your message.",
    sent: "Your enquiry has been sent.",
    error: "Please check this field.",
    name: "Name",
    phone: "Phone or WhatsApp",
    projectType: "Project type",
    preferredDate: "Preferred date",
    location: "Location",
    budget: "Estimated budget",
    optional: "Optional",
    message: "Your message",
    messageError: "Please add at least 20 characters.",
    consent:
      "I agree that my information may be used to respond to this enquiry.",
    sending: "Sending…",
    submit: "Send enquiry",
    projectTypes: {
      wedding: "Wedding",
      event: "Event",
      corporate: "Corporate",
      product: "Product",
      food: "Food",
      hospitality: "Hospitality or interior",
      portrait: "Portrait",
      video: "Film",
      other: "Other project",
    },
  },
  ar: {
    subject: (name) => `طلب تصوير — ${name}`,
    mailLabels: {
      name: "الاسم",
      phone: "الهاتف",
      project: "المشروع",
      date: "التاريخ",
      location: "المكان",
      budget: "الميزانية",
    },
    sendFailure: "تعذر الإرسال. يرجى المحاولة مرة أخرى لاحقًا.",
    successTitle: "شكرًا على رسالتك.",
    mailOpened: "فُتح تطبيق البريد الإلكتروني ومعه رسالتك.",
    sent: "تم إرسال طلبك بنجاح.",
    error: "يرجى التحقق من هذا الحقل.",
    name: "الاسم",
    phone: "الهاتف أو WhatsApp",
    projectType: "نوع المشروع",
    preferredDate: "التاريخ المفضل",
    location: "المكان",
    budget: "الميزانية التقديرية",
    optional: "اختياري",
    message: "رسالتك",
    messageError: "يرجى إضافة 20 حرفًا على الأقل.",
    consent: "أوافق على استخدام معلوماتي للرد على هذا الطلب.",
    sending: "جارٍ الإرسال…",
    submit: "إرسال الطلب",
    projectTypes: {
      wedding: "حفل زفاف",
      event: "فعالية",
      corporate: "شركة",
      product: "منتج",
      food: "أطعمة",
      hospitality: "ضيافة أو فضاء داخلي",
      portrait: "صور شخصية",
      video: "فيديو",
      other: "مشروع آخر",
    },
  },
};

export function ContactForm({
  idPrefix = "contact-form",
  variant = "default",
}: {
  idPrefix?: string;
  variant?: "default" | "dialog";
}) {
  const locale = useLocale() as Locale;
  const copy = contactFormCopy[locale];
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
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
    if (contactEmail) {
      const subject = copy.subject(values.name);
      const labels = copy.mailLabels;
      const body = [
        `${labels.name}: ${values.name}`,
        `Email: ${values.email}`,
        `${labels.phone}: ${values.phone || "—"}`,
        `${labels.project}: ${copy.projectTypes[values.projectType]}`,
        `${labels.date}: ${values.preferredDate || "—"}`,
        `${labels.location}: ${values.location}`,
        `${labels.budget}: ${values.budget || "—"}`,
        "",
        values.message,
      ].join("\n");
      window.location.assign(
        `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
      );
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Contact request failed");
    } catch {
      setError("root", {
        message: copy.sendFailure,
      });
    }
  }

  if (isSubmitSuccessful) {
    return (
      <div
        role="status"
        className="border-sand/50 bg-surface rounded-2xl border p-8"
      >
        <h2 className="font-display text-4xl">{copy.successTitle}</h2>
        <p className="mt-4 text-white/50">
          {contactEmail ? copy.mailOpened : copy.sent}
        </p>
      </div>
    );
  }

  const errorText = copy.error;
  const fieldId = (name: string) => `${idPrefix}-${name}`;
  return (
    <form
      onSubmit={handleSubmit(submit)}
      noValidate
      className={`contact-form grid gap-6 sm:grid-cols-2 ${variant === "dialog" ? "contact-form--dialog" : ""}`}
    >
      <div className="hidden" aria-hidden="true">
        <label htmlFor={fieldId("website")}>Website</label>
        <input
          id={fieldId("website")}
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>
      <Field
        label={copy.name}
        id={fieldId("name")}
        error={errors.name?.message && errorText}
      >
        <input
          id={fieldId("name")}
          autoComplete="name"
          aria-required="true"
          className={fieldClass}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={
            errors.name ? `${fieldId("name")}-error` : undefined
          }
          {...register("name")}
        />
      </Field>
      <Field
        label="Email"
        id={fieldId("email")}
        error={errors.email?.message && errorText}
      >
        <input
          id={fieldId("email")}
          type="email"
          dir="ltr"
          autoComplete="email"
          aria-required="true"
          className={fieldClass}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={
            errors.email ? `${fieldId("email")}-error` : undefined
          }
          {...register("email")}
        />
      </Field>
      <Field label={copy.phone} id={fieldId("phone")}>
        <input
          id={fieldId("phone")}
          type="tel"
          dir="ltr"
          autoComplete="tel"
          className={fieldClass}
          {...register("phone")}
        />
      </Field>
      <Field
        label={copy.projectType}
        id={fieldId("projectType")}
        error={errors.projectType?.message && errorText}
      >
        <select
          id={fieldId("projectType")}
          aria-required="true"
          aria-invalid={Boolean(errors.projectType)}
          aria-describedby={
            errors.projectType ? `${fieldId("projectType")}-error` : undefined
          }
          className={fieldClass}
          {...register("projectType")}
        >
          {projectTypes.map((value) => (
            <option key={value} value={value}>
              {copy.projectTypes[value]}
            </option>
          ))}
        </select>
      </Field>
      <Field label={copy.preferredDate} id={fieldId("preferredDate")}>
        <input
          id={fieldId("preferredDate")}
          type="date"
          dir="ltr"
          className={fieldClass}
          {...register("preferredDate")}
        />
      </Field>
      <Field
        label={copy.location}
        id={fieldId("location")}
        error={errors.location?.message && errorText}
      >
        <input
          id={fieldId("location")}
          aria-required="true"
          aria-invalid={Boolean(errors.location)}
          aria-describedby={
            errors.location ? `${fieldId("location")}-error` : undefined
          }
          className={fieldClass}
          {...register("location")}
        />
      </Field>
      <Field label={copy.budget} id={fieldId("budget")}>
        <input
          id={fieldId("budget")}
          className={fieldClass}
          placeholder={copy.optional}
          dir="auto"
          {...register("budget")}
        />
      </Field>
      {variant === "default" ? (
        <div className="hidden sm:block" aria-hidden="true" />
      ) : null}
      <Field
        label={copy.message}
        id={fieldId("message")}
        error={errors.message?.message && copy.messageError}
        className="sm:col-span-2"
      >
        <textarea
          id={fieldId("message")}
          rows={variant === "dialog" ? 4 : 7}
          aria-required="true"
          className={fieldClass}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={
            errors.message ? `${fieldId("message")}-error` : undefined
          }
          {...register("message")}
        />
      </Field>
      <label className="contact-form-consent flex items-start gap-3 sm:col-span-2">
        <input
          type="checkbox"
          id={fieldId("consent")}
          aria-required="true"
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={
            errors.consent ? `${fieldId("consent")}-error` : undefined
          }
          className="accent-sand mt-1 h-5 w-5"
          {...register("consent")}
        />
        <span className="text-sm leading-6">
          {copy.consent}
          {errors.consent ? (
            <span
              id={`${fieldId("consent")}-error`}
              className="block text-red-300"
            >
              {errorText}
            </span>
          ) : null}
        </span>
      </label>
      {errors.root ? (
        <p
          role="alert"
          className="contact-form-root-error text-red-300 sm:col-span-2"
        >
          {errors.root.message}
        </p>
      ) : null}
      <div className="contact-form-actions sm:col-span-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className={variant === "dialog" ? "w-full sm:w-auto" : ""}
        >
          {isSubmitting ? copy.sending : copy.submit}
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
