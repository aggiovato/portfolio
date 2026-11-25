/**
 * Project release facts: what another repository's pipeline tells the portfolio when one of its
 * versions reaches production (.github/workflows/project-release.yml sends it,
 * project-sync.yml records it in src/data/releases/<slug>.json).
 *
 * Pure module (no `astro:content`): the `releases` collection, the sync script
 * (scripts/project-sync.mjs, run by Node directly) and Vitest share the same schema.
 * Only locale-independent facts live here; the case study's prose stays in its .mdoc files.
 */
import { z } from 'astro/zod';

export const projectStatus = z.enum(['active', 'completed', 'prototype', 'paused']);

/** Outbound links of a case study, shared by the .mdoc frontmatter and the release facts. */
export const projectLinks = z.object({
  /** A working demo of the product itself. */
  demo: z.url().optional(),
  /** An interactive playground (not the product running): labelled as such. */
  playground: z.url().optional(),
  code: z.url().optional(),
  docs: z.url().optional(),
  /** Where to install it (a marketplace, a store, a package page). */
  install: z.url().optional(),
});

export const releaseSchema = z.strictObject({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug: lowercase letters, numbers and hyphens'),
  status: projectStatus.optional(),
  /** Stable versions only: pre-releases never reach the portfolio. */
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'x.y.z, without a leading v'),
  /** Day the version reached production (YYYY-MM-DD). */
  releasedAt: z.iso.date(),
  links: projectLinks.strict().default({}),
  /** Where the facts came from, for auditing; never shown. */
  source: z.strictObject({
    repository: z.string().regex(/^[\w.-]+\/[\w.-]+$/),
    commit: z.string().regex(/^[0-9a-f]{7,40}$/),
    run: z.url(),
  }),
});

export type Release = z.infer<typeof releaseSchema>;

/** The case study fields a release overrides, plus the version it adds. */
export interface ReleasableData {
  projectStatus: z.infer<typeof projectStatus>;
  links: z.infer<typeof projectLinks>;
  updatedAt?: Date;
}

/**
 * A case study with its latest release applied: the release's status and links win over the
 * frontmatter (links merge, so a link only the .mdoc has stays), and `updatedAt` moves to the
 * release day when that is later. Without a release the data is returned as it is.
 */
export function applyRelease<T extends ReleasableData>(data: T, release?: Release): T & { version?: string } {
  if (!release) return data;
  const releasedAt = new Date(release.releasedAt);
  return {
    ...data,
    projectStatus: release.status ?? data.projectStatus,
    links: { ...data.links, ...release.links },
    updatedAt: data.updatedAt && data.updatedAt > releasedAt ? data.updatedAt : releasedAt,
    version: release.version,
  };
}

export type SyncPlan =
  | { action: 'invalid'; errors: string[] }
  | { action: 'skip'; slug: string; reason: string }
  | { action: 'unchanged'; slug: string; version: string }
  | { action: 'write'; slug: string; version: string; content: string };

/**
 * What the sync does with an incoming payload: reject it, skip a project without a case study,
 * leave an identical record alone (a re-run), or write the new record. `current` is the file's
 * text today, if any.
 */
export function planSync(
  payload: unknown,
  opts: { hasCaseStudy: (slug: string) => boolean; current?: string },
): SyncPlan {
  const parsed = releaseSchema.safeParse(payload);
  if (!parsed.success) {
    return {
      action: 'invalid',
      errors: parsed.error.issues.map((i) => `${i.path.join('.') || '(root)'}: ${i.message}`),
    };
  }
  const release = parsed.data;
  if (!opts.hasCaseStudy(release.slug)) {
    return {
      action: 'skip',
      slug: release.slug,
      reason: `no case study for "${release.slug}" in src/content/projects/en/`,
    };
  }
  const content = `${JSON.stringify(release, null, 2)}\n`;
  if (content === opts.current) return { action: 'unchanged', slug: release.slug, version: release.version };
  return { action: 'write', slug: release.slug, version: release.version, content };
}
