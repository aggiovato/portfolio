/**
 * /llms.txt (llmstxt.org): a Markdown summary of the site for AI assistants, with links to what
 * matters. Built from the same content as the pages, in English (the default locale), so it stays
 * current with every release. Pure, so Vitest covers it; the endpoint is src/pages/llms.txt.ts.
 */

export interface LlmsLink {
  title: string;
  url: string;
  summary?: string;
}

export interface LlmsInput {
  /** H1: the person and the brand. */
  title: string;
  /** Blockquote: one-sentence description of the site. */
  description: string;
  /** Free paragraphs after the description (who he is, how he works). */
  about: string[];
  coreStack: readonly string[];
  projects: LlmsLink[];
  notes: LlmsLink[];
  /** About, contact, profiles and email. */
  contact: LlmsLink[];
  /** Other languages, feeds and the sitemap: useful but skippable («Optional» in the format). */
  optional: LlmsLink[];
}

const item = ({ title, url, summary }: LlmsLink) => `- [${title}](${url})${summary ? `: ${summary}` : ''}`;

const section = (heading: string, links: LlmsLink[]) =>
  links.length ? [`## ${heading}`, '', ...links.map(item), ''] : [];

export function buildLlms(input: LlmsInput): string {
  return [
    `# ${input.title}`,
    '',
    `> ${input.description}`,
    '',
    ...input.about.flatMap((p) => [p, '']),
    `Core stack: ${input.coreStack.join(', ')}.`,
    '',
    ...section('Case studies', input.projects),
    ...section('Notes', input.notes),
    ...section('About and contact', input.contact),
    ...section('Optional', input.optional),
  ]
    .join('\n')
    .trimEnd()
    .concat('\n');
}
