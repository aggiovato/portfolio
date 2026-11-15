import { describe, expect, it } from 'vitest';
import { assertSkillParity, treeShape, type SkillTree } from '../../src/lib/content/skill-utils';

const aTree = (branches = 2): SkillTree => ({
  intro: 'Intro',
  groups: [
    {
      id: 'frontend',
      title: 'Frontend',
      nodes: [
        {
          id: 'angular',
          name: 'Angular',
          summary: 'Main framework.',
          branches: Array.from({ length: branches }, (_, i) => ({ name: `B${i}`, when: 'When.' })),
        },
      ],
    },
  ],
});

describe('skill tree parity', () => {
  it('describes the shape by ids and branch counts, not by translated text', () => {
    expect(treeShape(aTree())).toEqual(['frontend', 'frontend/angular:2']);
  });

  it('accepts a translation with the same shape', () => {
    const es = aTree();
    es.groups[0]!.title = 'Interfaz';
    es.groups[0]!.nodes[0]!.branches[0]!.name = 'Enrutamiento';
    expect(() => assertSkillParity(aTree(), es, 'es')).not.toThrow();
  });

  it('fails when a translation drops a branch or renames an id', () => {
    expect(() => assertSkillParity(aTree(), aTree(1), 'es')).toThrow(/frontend\/angular:2/);
    const renamed = aTree();
    renamed.groups[0]!.nodes[0]!.id = 'ng';
    expect(() => assertSkillParity(aTree(), renamed, 'it')).toThrow(/skills\/it\.yaml/);
  });

  it('fails when a translation adds a technology', () => {
    const extra = aTree();
    extra.groups[0]!.nodes.push({ ...extra.groups[0]!.nodes[0]!, id: 'react' });
    expect(() => assertSkillParity(aTree(), extra, 'es')).toThrow(/frontend\/react:2/);
  });
});
