import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const courses = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/courses' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['Dla dzieci', 'Dla nauczycieli', 'Dla seniorów']),
    tags: z.array(z.string()),
    priceFrom: z.string(),
    image: z.string().optional(),
    pdfFile: z.string().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
  }),
});

export const collections = { courses, pages };
