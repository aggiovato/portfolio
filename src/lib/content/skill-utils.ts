/** Pure helpers for the skill tree (no `astro:*` imports, so Vitest covers them directly). */

export interface SkillTree {
  intro: string;
  groups: {
    id: string;
    title: string;
    nodes: { id: string; name: string; summary: string; branches: { name: string; when: string }[] }[];
  }[];
}

/** Ids of every group and node plus each node's branch count, in order: the shape a translation keeps. */
export function treeShape(tree: SkillTree): string[] {
  return tree.groups.flatMap((g) => [g.id, ...g.nodes.map((n) => `${g.id}/${n.id}:${n.branches.length}`)]);
}

/** Fails the build when a translation adds, drops or reorders an area, a technology or a branch. */
export function assertSkillParity(original: SkillTree, translation: SkillTree, locale: string): void {
  const a = treeShape(original);
  const b = treeShape(translation);
  const i = a.findIndex((item, k) => item !== b[k]);
  if (i !== -1 || a.length !== b.length) {
    throw new Error(`skills/${locale}.yaml does not match skills/en.yaml near «${a[i] ?? b[a.length]}».`);
  }
}
