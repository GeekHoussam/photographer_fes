import { defineQuery } from "next-sanity";

export const featuredProjectsQuery = defineQuery(`
  *[_type == "portfolioProject" && featured == true] | order(sortOrder asc) {
    _id,
    "slug": slug.current,
    title,
    location,
    year,
    summary,
    coverImage,
    "category": category->{"slug": slug.current, title}
  }
`);

export const serviceBySlugQuery = defineQuery(`
  *[_type == "service" && slug.current == $slug][0] {
    _id, title, "slug": slug.current, introduction, heroMedia, description,
    deliverables, process, gallery, faqs[]->{_id, question, answer}, seo
  }
`);
