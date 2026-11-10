import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Project contract — docs/especificacion.md §12.
 * One file per locale: `src/content/projects/<locale>/<name>.mdoc`. The entry id is
 * `<locale>/<name>` (stable, links translations); `slug` defines the public URL and is the same
 * in every locale (checked in src/lib/content/project-utils.ts).
 */
const stackItem = z.object({
  name: z.string().min(1),
  layer: z.enum(['interface', 'api', 'data', 'runtime', 'quality', 'infrastructure', 'tooling']),
  rationale: z.string().optional(),
  usage: z.enum(['production', 'prototype', 'exploration']).default('production'),
});

const projects = defineCollection({
  loader: glob({
    pattern: '**/*.mdoc',
    base: './src/content/projects',
    // The default id would be the `slug` field, which is the same in every locale: use the path.
    generateId: ({ entry }) => entry.replace(/\.mdoc$/, ''),
  }),
  schema: ({ image }) =>
    z
      .object({
        slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug: lowercase letters, numbers and hyphens'),
        title: z.string().min(1),
        summary: z.string().min(1).max(220),
        /** Short line for cards (home carousel). Falls back to summary. */
        tagline: z.string().min(1).max(70).optional(),
        publicationStatus: z.enum(['draft', 'published', 'archived']),
        projectStatus: z.enum(['active', 'completed', 'prototype', 'paused']),
        projectType: z.enum(['personal', 'open-source', 'professional']),
        featured: z.boolean().default(false),
        featuredOrder: z.number().int().optional(),
        categories: z.array(z.string()).max(3).default([]),
        role: z.array(z.string()).min(1),
        team: z.string().optional(),
        periodLabel: z.string(),
        publishedAt: z.coerce.date().optional(),
        updatedAt: z.coerce.date().optional(),
        stack: z.array(stackItem).default([]),
        cover: z.object({ src: image(), alt: z.string().min(1), caption: z.string().optional() }).optional(),
        gallery: z
          .array(z.object({ src: image(), alt: z.string().min(1), caption: z.string().optional() }))
          .default([]),
        links: z
          .object({
            demo: z.url().optional(),
            code: z.url().optional(),
            docs: z.url().optional(),
          })
          .default({}),
        seo: z.object({ title: z.string().optional(), description: z.string().optional() }).optional(),
      })
      // Publication rules: nothing is published without a date and a cover (§12).
      .refine((p) => p.publicationStatus !== 'published' || p.publishedAt, {
        message: 'publishedAt is required to publish',
        path: ['publishedAt'],
      })
      .refine((p) => p.publicationStatus !== 'published' || p.cover, {
        message: 'cover is required to publish',
        path: ['cover'],
      }),
});

export const collections = { projects };
