import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-07-11";

export const sanityConfigured = Boolean(
  projectId && projectId !== "replace-with-sanity-project-id",
);

export const sanityClient = createClient({
  projectId: projectId ?? "replaceMe",
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});
