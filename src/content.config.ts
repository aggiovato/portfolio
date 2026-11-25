import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { withoutEmptyMedia } from './lib/content/project-utils';
import { projectLinks, projectStatus, releaseSchema } from './lib/content/release';

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
        projectStatus,
        projectType: z.enum(['personal', 'open-source', 'professional']),
        featured: z.boolean().default(false),
        featuredOrder: z.number().int().optional(),
        categories: z.array(z.string()).max(3).default([]),
        role: z.array(z.string()).min(1),
        team: z.string().optional(),
        periodLabel: z.string(),
        publishedAt: z.coerce.date().optional(),
        updatedAt: z.coerce.date().optional(),
        /**
         * The one-minute layer (PRODUCT.md: understood without reading the whole article): the
         * problem, his part and what came of it. Outcome lists shipped, verifiable facts only.
         */
        glance: z.object({
          problem: z.string().min(1).max(170),
          contribution: z.string().min(1).max(170),
          outcome: z.array(z.string().min(1).max(140)).min(1).max(4),
        }),
        stack: z.array(stackItem).default([]),
        // Keystatic saves an empty cover as `{}` (or alt only): that means no cover.
        cover: z.preprocess(
          withoutEmptyMedia,
          z.object({ src: image(), alt: z.string().min(1), caption: z.string().optional() }).optional(),
        ),
        gallery: z
          .array(z.object({ src: image(), alt: z.string().min(1), caption: z.string().optional() }))
          .default([]),
        links: projectLinks.default({}),
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

/**
 * Note contract (spec §7 «/notes/», §12 «notes»): short technical articles. Same file model as
 * projects: `src/content/notes/<locale>/<name>.mdoc`, English original, optional translations with
 * the same file name and slug. Published notes need a date: it orders the index and dates the feed.
 */
const notes = defineCollection({
  loader: glob({
    pattern: '**/*.mdoc',
    base: './src/content/notes',
    generateId: ({ entry }) => entry.replace(/\.mdoc$/, ''),
  }),
  schema: ({ image }) =>
    z
      .object({
        slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug: lowercase letters, numbers and hyphens'),
        title: z.string().min(1),
        summary: z.string().min(1).max(220),
        publicationStatus: z.enum(['draft', 'published', 'archived']),
        publishedAt: z.coerce.date().optional(),
        updatedAt: z.coerce.date().optional(),
        /** Technologies or topics, shown as chips; written as they are named (RxJS, Angular). */
        tags: z.array(z.string().min(1)).max(4).default([]),
        /** Lead image: the index thumbnail and the figure under the article header. */
        cover: z.preprocess(
          withoutEmptyMedia,
          z.object({ src: image(), alt: z.string().min(1), caption: z.string().optional() }).optional(),
        ),
        seo: z.object({ title: z.string().optional(), description: z.string().optional() }).optional(),
      })
      .refine((n) => n.publicationStatus !== 'published' || n.publishedAt, {
        message: 'publishedAt is required to publish',
        path: ['publishedAt'],
      }),
});

/**
 * «What I work with» on the About page: one file per locale (`src/content/skills/<locale>.yaml`,
 * id = locale). Areas → technologies → branches, each branch saying when it is used. Translations
 * keep the same ids and branch counts (src/lib/content/skill-utils.ts).
 */
const id = z.string().regex(/^[a-z0-9-]+$/);
const skills = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/skills' }),
  schema: z.object({
    intro: z.string().min(1),
    groups: z
      .array(
        z.object({
          id,
          title: z.string().min(1),
          nodes: z
            .array(
              z.object({
                id,
                name: z.string().min(1),
                summary: z.string().min(1).max(80),
                branches: z
                  .array(z.object({ name: z.string().min(1), when: z.string().min(1).max(220) }))
                  .min(1),
              }),
            )
            .min(1),
        }),
      )
      .min(1),
  }),
});

/**
 * Latest production release of a project, written only by .github/workflows/project-sync.yml
 * (`src/data/releases/<slug>.json`, entry id = slug). Read through src/lib/content/projects.ts,
 * which applies it over the case study's frontmatter.
 */
const releases = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/data/releases' }),
  schema: releaseSchema,
});

export const collections = { projects, notes, skills, releases };
