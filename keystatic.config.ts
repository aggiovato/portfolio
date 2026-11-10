import { collection, config, fields, type ComponentSchema } from '@keystatic/core';
import { block, wrapper } from '@keystatic/core/content-components';
import { locales, type Locale } from './src/i18n/config';

/**
 * Keystatic proof of concept (docs/especificacion.md §13): local storage only, mounted in
 * `astro dev` (see astro.config.mjs). It reads and writes the same .mdoc files Astro loads,
 * so src/content.config.ts stays the source of truth; enums here must match that schema.
 */

const select = <T extends string>(label: string, values: readonly T[], defaultValue: T) =>
  fields.select({ label, options: values.map((v) => ({ label: v, value: v })), defaultValue });

// Stored next to the existing screenshots: src/assets/projects/<slug>/<field>.<ext>.
const image = (label: string, isRequired: boolean) =>
  fields.image({
    label,
    directory: 'src/assets/projects',
    publicPath: '../../../assets/projects/',
    validation: { isRequired },
  });

/**
 * Required media (gallery item): image and alt text are both required, as in the Astro schema.
 * Optional media (cover): Keystatic objects cannot be optional or validated conditionally, so the
 * alt text is not enforced here; the Astro schema drops a cover without image (withoutEmptyMedia)
 * and still fails the build when an image has no alt text.
 */
const media = (label: string, { optional = false } = {}): ComponentSchema =>
  fields.object(
    {
      src: image(label, !optional),
      alt: fields.text({
        label: 'Alt text',
        description: optional ? 'Required when an image is set.' : undefined,
        validation: { length: { min: optional ? 0 : 1 } },
      }),
      caption: fields.text({ label: 'Caption' }),
    },
    { label },
  );

const requiredText = (label: string) => fields.text({ label, validation: { length: { min: 1 } } });

const optionalText = (label: string) => fields.text({ label });

/**
 * On phones the content layout stacks every field above the article editor, which then starts
 * thousands of pixels down. The form layout follows the schema order instead. The config is also
 * read on the server (API), where there is no window: entryLayout only affects the UI.
 */
const isPhone = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;

/**
 * fields.url only rejects unsafe schemes and accepts any text ("asdf"), while the Astro schema
 * uses z.url(). Require an absolute http(s) URL; the pattern also runs on empty values, so allow ''.
 */
const link = (label: string) =>
  fields.text({
    label,
    validation: {
      pattern: { regex: /^(https?:\/\/\S+)?$/, message: `${label} must be a full URL (https://…)` },
    },
  });

const projects = (locale: Locale) =>
  collection({
    label: `Projects (${locale})`,
    path: `src/content/projects/${locale}/*`,
    // The file name doubles as the public slug, as in the hand-written files.
    slugField: 'slug',
    format: { contentField: 'content' },
    entryLayout: isPhone ? 'form' : 'content',
    columns: ['title', 'publicationStatus'],
    schema: {
      slug: fields.slug({ name: { label: 'Slug', description: 'Same value in every locale.' } }),
      title: fields.text({ label: 'Title', validation: { length: { min: 1 } } }),
      // Right after the title: on phones (form layout) the article is reachable without scrolling
      // past every field. The desktop content layout moves it to the main area regardless.
      content: fields.markdoc({
        label: 'Case study',
        extension: 'mdoc',
        options: { image: { directory: 'src/assets/projects', publicPath: '../../../assets/projects/' } },
        // Mirrors the tags in markdoc.config.mjs so they can be edited instead of shown as raw blocks.
        components: {
          callout: wrapper({
            label: 'Callout',
            schema: {
              type: select('Type', ['note', 'constraint', 'learning', 'editorial'], 'note'),
              title: fields.text({ label: 'Title' }),
            },
          }),
          decision: block({
            label: 'Decision',
            schema: {
              problem: fields.text({ label: 'Problem', multiline: true }),
              decision: fields.text({ label: 'Decision', multiline: true }),
              alternatives: fields.text({ label: 'Alternatives', multiline: true }),
              tradeoff: fields.text({ label: 'Trade-off', multiline: true }),
              evidence: fields.text({ label: 'Evidence', multiline: true }),
            },
          }),
        },
      }),
      summary: fields.text({
        label: 'Summary',
        multiline: true,
        validation: { length: { min: 1, max: 220 } },
      }),
      tagline: fields.text({ label: 'Tagline (cards)', validation: { length: { max: 70 } } }),
      publicationStatus: select('Publication status', ['draft', 'published', 'archived'], 'draft'),
      projectStatus: select('Project status', ['active', 'completed', 'prototype', 'paused'], 'active'),
      projectType: select('Project type', ['personal', 'open-source', 'professional'], 'personal'),
      featured: fields.checkbox({ label: 'Featured on home' }),
      featuredOrder: fields.integer({ label: 'Featured order' }),
      categories: fields.array(requiredText('Category'), {
        label: 'Categories (max 3)',
        itemLabel: (p) => p.value,
        validation: { length: { max: 3 } },
      }),
      role: fields.array(requiredText('Role'), {
        label: 'Role',
        itemLabel: (p) => p.value,
        validation: { length: { min: 1 } },
      }),
      team: optionalText('Team'),
      periodLabel: fields.text({
        label: 'Period label',
        description: 'E.g. "June 2026 – present".',
        validation: { length: { min: 1 } },
      }),
      publishedAt: fields.date({ label: 'Published at' }),
      updatedAt: fields.date({ label: 'Updated at' }),
      stack: fields.array(
        fields.object({
          name: fields.text({ label: 'Name', validation: { length: { min: 1 } } }),
          layer: select(
            'Layer',
            ['interface', 'api', 'data', 'runtime', 'quality', 'infrastructure', 'tooling'],
            'interface',
          ),
          rationale: fields.text({ label: 'Rationale', multiline: true }),
          usage: select('Usage', ['production', 'prototype', 'exploration'], 'production'),
        }),
        { label: 'Stack', itemLabel: (p) => p.fields.name.value },
      ),
      cover: media('Cover', { optional: true }),
      gallery: fields.array(media('Image'), { label: 'Gallery' }),
      links: fields.object({
        demo: link('Demo URL'),
        code: link('Code URL'),
        docs: link('Docs URL'),
      }),
    },
  });

export default config({
  storage: { kind: 'local' },
  ui: { brand: { name: 'aggiovato' } },
  collections: Object.fromEntries(locales.map((l) => [`projects_${l}`, projects(l)])),
});
