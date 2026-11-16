/**
 * What a `{% diagram %}` tag draws: one of the marble diagrams (`id`, src/lib/diagrams/specs.ts) or
 * a file under src/assets/notes/ (`src`, e.g. "my-note/flow.svg"): an SVG drawn anywhere (Figma,
 * Excalidraw, a diagram tool) or a raster image. Exactly one of the two. Pure, for Vitest.
 */

export type DiagramSource =
  { kind: 'marble'; id: string } | { kind: 'svg'; path: string } | { kind: 'image'; path: string };

const IMAGE = /\.(png|jpe?g|webp|avif)$/i;

export function diagramSource(props: { id?: string; src?: string }): DiagramSource {
  const id = props.id?.trim();
  const src = props.src?.trim().replace(/^\.?\//, '');
  if (id && src) throw new Error('A diagram takes `id` (a marble diagram) or `src` (a file), not both.');
  if (id) return { kind: 'marble', id };
  if (!src)
    throw new Error('A diagram needs `id` (a marble diagram) or `src` (a file in src/assets/notes/).');
  if (src.includes('..')) throw new Error(`Diagram src «${src}» must stay inside src/assets/notes/.`);
  if (/\.svg$/i.test(src)) return { kind: 'svg', path: src };
  if (IMAGE.test(src)) return { kind: 'image', path: src };
  throw new Error(`Diagram src «${src}» must be an .svg, .png, .jpg, .webp or .avif file.`);
}

/**
 * An SVG file ready to inline: decorative markup stripped of scripts and its own size, labelled as
 * one image with the figure's alt. Requires a viewBox, so it can scale to the column.
 */
export function inlineSvg(markup: string, alt: string, path: string): string {
  const open = markup.match(/<svg\b[^>]*>/i)?.[0];
  if (!open) throw new Error(`Diagram src «${path}» is not an SVG.`);
  if (!/\bviewBox=/i.test(open)) throw new Error(`Diagram src «${path}» needs a viewBox to scale.`);
  const label = alt.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  const tag = open
    .replace(/\s(width|height|role|aria-label)="[^"]*"/gi, '')
    .replace(/^<svg/i, `<svg role="img" aria-label="${label}"`);
  return markup
    .slice(markup.indexOf(open))
    .replace(open, tag)
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '');
}
