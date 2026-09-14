import { z } from "zod";

export const currencies = ["MAD", "EUR", "USD"] as const;
export const estimateStatuses = [
  "DRAFT",
  "SENT",
  "ACCEPTED",
  "REJECTED",
  "EXPIRED",
] as const;
export const invoiceStatuses = [
  "DRAFT",
  "SENT",
  "PAID",
  "PARTIALLY_PAID",
  "OVERDUE",
  "CANCELLED",
] as const;
export const messageStatuses = ["NEW", "READ", "REPLIED", "ARCHIVED"] as const;
export const idSchema = z.uuid();
const shortText = z.string().trim().max(200);
const optionalText = z.string().trim().max(2000);
const email = z
  .email()
  .max(254)
  .transform((value) => value.toLowerCase());
export const decimal = z.string().regex(/^\d{1,9}(\.\d{1,2})?$/);
const date = z.iso.date();

export const clientSchema = z
  .object({
    name: shortText.min(2),
    companyName: shortText,
    email,
    phone: z.string().trim().max(40),
    address: optionalText,
    city: shortText,
    country: shortText,
    notes: optionalText,
  })
  .strict();

export const itemSchema = z
  .object({
    description: z.string().trim().min(1).max(500),
    quantity: z
      .string()
      .regex(/^\d{1,6}(\.\d{1,3})?$/)
      .refine((value) => Number(value) > 0),
    unitPrice: decimal,
    taxRate: decimal.refine((value) => Number(value) <= 100),
  })
  .strict();

export const documentSchema = z
  .object({
    clientId: idSchema,
    issueDate: date,
    dueDate: date,
    currency: z.enum(currencies),
    items: z.array(itemSchema).min(1).max(50),
    discount: decimal,
    notes: optionalText,
    terms: optionalText,
  })
  .strict()
  .refine((value) => value.dueDate >= value.issueDate, { path: ["dueDate"] });

export const settingsSchema = z
  .object({
    currency: z.enum(currencies),
    issuerName: shortText,
    issuerAddress: optionalText,
    issuerEmail: z.union([email, z.literal("")]),
    issuerRegistration: shortText,
  })
  .strict();

export const loginSchema = z
  .object({ email, password: z.string().min(1).max(256) })
  .strict();
export const passwordSchema = z.string().min(15).max(256);
export const localeSchema = z
  .object({ locale: z.enum(["en", "fr", "ar"]) })
  .strict();
export const replySchema = z
  .object({
    content: z.string().trim().min(1).max(5000),
    requestId: idSchema,
  })
  .strict();
export const querySchema = z.object({
  clientId: z.union([idSchema, z.literal("")]).default(""),
  q: z.string().trim().max(100).default(""),
  status: z.string().max(30).default(""),
  page: z.coerce.number().int().min(1).max(10000).default(1),
});
export type ClientInput = z.infer<typeof clientSchema>;
export type DocumentInput = z.infer<typeof documentSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
export type ListQuery = z.infer<typeof querySchema>;
export type DocumentKind = "ESTIMATE" | "INVOICE";
