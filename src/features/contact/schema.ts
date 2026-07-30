import { z } from "zod";

export const projectTypes = [
  "wedding",
  "event",
  "corporate",
  "product",
  "food",
  "hospitality",
  "portrait",
  "video",
  "other",
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(254),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  projectType: z.enum(projectTypes),
  preferredDate: z.string().max(30).optional().or(z.literal("")),
  location: z.string().trim().min(2).max(120),
  budget: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().min(20).max(3000),
  consent: z
    .boolean()
    .refine((value) => value, { message: "Consent is required" }),
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
