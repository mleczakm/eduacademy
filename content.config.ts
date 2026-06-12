import { defineCollection, z } from 'astro:content';

const courses = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.enum(['Dla dzieci', 'Dla nauczycieli', 'Dla seniorów']),
    tags: z.array(z.string()),
    priceFrom: z.string(),
    image: z.string().optional(),
    pdfFile: z.string().optional(),
  }),
});

const publications = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
  }),
});

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
  }),
});

export const collections = { courses, publications, pages };
