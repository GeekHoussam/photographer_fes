import { defineArrayMember, defineField, defineType } from "sanity";

const localizedString = defineType({
  name: "localizedString",
  title: "Localized string",
  type: "object",
  fields: [
    defineField({
      name: "fr",
      title: "Français",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "en", title: "English", type: "string" }),
  ],
});

const localizedText = defineType({
  name: "localizedText",
  title: "Localized text",
  type: "object",
  fields: [
    defineField({
      name: "fr",
      title: "Français",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "en", title: "English", type: "text", rows: 4 }),
  ],
});

const localizedPortableText = defineType({
  name: "localizedPortableText",
  title: "Localized rich text",
  type: "object",
  fields: [
    defineField({
      name: "fr",
      title: "Français",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
    defineField({
      name: "en",
      title: "English",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
    }),
  ],
});

const accessibleImage = defineType({
  name: "accessibleImage",
  title: "Image with alt text",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "caption", title: "Caption", type: "localizedString" }),
  ],
  validation: (rule) => rule.required(),
});

const video = defineType({
  name: "video",
  title: "Video",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "url", type: "url" }),
    defineField({ name: "file", type: "file", options: { accept: "video/*" } }),
    defineField({
      name: "poster",
      type: "accessibleImage",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "transcript", type: "localizedText" }),
  ],
  validation: (rule) =>
    rule.custom((value) =>
      value?.url || value?.file ? true : "Provide a video URL or file",
    ),
});

const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "title",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      type: "localizedText",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "image", type: "accessibleImage" }),
    defineField({ name: "noIndex", type: "boolean", initialValue: false }),
  ],
});

const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({
      name: "question",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "answer",
      type: "localizedPortableText",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: "question.fr", subtitle: "question.en" } },
});

const category = defineType({
  name: "portfolioCategory",
  title: "Portfolio category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title.fr" },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "description", type: "localizedText" }),
    defineField({ name: "sortOrder", type: "number", initialValue: 100 }),
  ],
  preview: { select: { title: "title.fr", subtitle: "title.en" } },
});

const project = defineType({
  name: "portfolioProject",
  title: "Portfolio project",
  type: "document",
  fields: [
    defineField({
      name: "internalTitle",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Public title",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "internalTitle" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "client",
      type: "reference",
      to: [{ type: "client" }],
    }),
    defineField({
      name: "category",
      type: "reference",
      to: [{ type: "portfolioCategory" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "date", type: "date" }),
    defineField({
      name: "year",
      type: "number",
      validation: (rule) => rule.integer().min(1900).max(2200),
    }),
    defineField({
      name: "coverImage",
      type: "accessibleImage",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "gallery",
      type: "array",
      of: [defineArrayMember({ type: "accessibleImage" })],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "videos",
      type: "array",
      of: [defineArrayMember({ type: "video" })],
    }),
    defineField({
      name: "summary",
      type: "localizedText",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "body", type: "localizedPortableText" }),
    defineField({
      name: "services",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "service" }] })],
    }),
    defineField({ name: "featured", type: "boolean", initialValue: false }),
    defineField({ name: "sortOrder", type: "number", initialValue: 100 }),
    defineField({
      name: "seo",
      type: "seo",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "internalTitle",
      subtitle: "category.title.fr",
      media: "coverImage",
    },
  },
});

const service = defineType({
  name: "service",
  title: "Service",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title.fr" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "introduction",
      type: "localizedText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroMedia",
      type: "accessibleImage",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      type: "localizedPortableText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "deliverables",
      type: "array",
      of: [defineArrayMember({ type: "localizedString" })],
    }),
    defineField({
      name: "process",
      type: "array",
      of: [defineArrayMember({ type: "localizedString" })],
    }),
    defineField({
      name: "gallery",
      type: "array",
      of: [defineArrayMember({ type: "accessibleImage" })],
    }),
    defineField({
      name: "relatedProjects",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "portfolioProject" }],
        }),
      ],
    }),
    defineField({
      name: "faqs",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "faq" }] })],
    }),
    defineField({
      name: "seo",
      type: "seo",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title.fr", subtitle: "title.en", media: "heroMedia" },
  },
});

const journalArticle = defineType({
  name: "journalArticle",
  title: "Journal article",
  type: "document",
  fields: [
    defineField({
      name: "title",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title.fr" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      type: "localizedText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      type: "localizedPortableText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "coverImage",
      type: "accessibleImage",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "seo",
      type: "seo",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title.fr", subtitle: "publishedAt", media: "coverImage" },
  },
});

const testimonial = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      type: "localizedText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "role", type: "localizedString" }),
    defineField({
      name: "approved",
      type: "boolean",
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: "name", subtitle: "quote.fr" } },
});

const client = defineType({
  name: "client",
  title: "Client",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "logo", type: "image" }),
    defineField({ name: "website", type: "url" }),
    defineField({ name: "approved", type: "boolean", initialValue: false }),
  ],
  preview: { select: { title: "name", media: "logo" } },
});

const simpleSingleton = (
  name: string,
  title: string,
  fields: ReturnType<typeof defineField>[],
) => defineType({ name, title, type: "document", fields });

const siteSettings = simpleSingleton("siteSettings", "Site settings", [
  defineField({
    name: "siteName",
    type: "string",
    validation: (rule) => rule.required(),
  }),
  defineField({ name: "description", type: "localizedText" }),
  defineField({ name: "businessEmail", type: "email" }),
  defineField({ name: "phone", type: "string" }),
  defineField({ name: "address", type: "text" }),
  defineField({
    name: "serviceArea",
    type: "array",
    of: [defineArrayMember({ type: "string" })],
  }),
  defineField({
    name: "socialLinks",
    type: "array",
    of: [
      defineArrayMember({
        type: "object",
        fields: [
          defineField({ name: "label", type: "string" }),
          defineField({ name: "url", type: "url" }),
        ],
      }),
    ],
  }),
  defineField({ name: "defaultSeo", type: "seo" }),
]);

const navigation = simpleSingleton("navigation", "Navigation", [
  defineField({
    name: "title",
    type: "string",
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "items",
    type: "array",
    of: [
      defineArrayMember({
        type: "object",
        fields: [
          defineField({ name: "label", type: "localizedString" }),
          defineField({ name: "href", type: "string" }),
        ],
      }),
    ],
  }),
]);

const homepage = simpleSingleton("homepage", "Homepage", [
  defineField({
    name: "heroTitle",
    type: "localizedString",
    validation: (rule) => rule.required(),
  }),
  defineField({ name: "heroIntroduction", type: "localizedText" }),
  defineField({ name: "heroImage", type: "accessibleImage" }),
  defineField({ name: "showreel", type: "video" }),
  defineField({
    name: "featuredProjects",
    type: "array",
    of: [
      defineArrayMember({
        type: "reference",
        to: [{ type: "portfolioProject" }],
      }),
    ],
  }),
  defineField({ name: "seo", type: "seo" }),
]);

const photographerProfile = simpleSingleton(
  "photographerProfile",
  "Photographer profile",
  [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "portrait", type: "accessibleImage" }),
    defineField({ name: "shortBio", type: "localizedText" }),
    defineField({ name: "biography", type: "localizedPortableText" }),
    defineField({ name: "seo", type: "seo" }),
  ],
);

export const schemaTypes = [
  localizedString,
  localizedText,
  localizedPortableText,
  accessibleImage,
  video,
  seo,
  siteSettings,
  navigation,
  homepage,
  photographerProfile,
  category,
  project,
  service,
  journalArticle,
  testimonial,
  client,
  faq,
];
