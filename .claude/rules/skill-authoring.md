---
paths:
  - '.claude/**'
  - 'CLAUDE.md'
---

# Rules, skills and agents

Adapted from the zt-backoffice frontend guide.

| Aspect  | Rules (`.claude/rules/*.md`)                     | Skills (`.claude/skills/<name>/SKILL.md`)         | Agents (`.claude/agents/*.md`)     |
| ------- | ------------------------------------------------ | ------------------------------------------------- | ---------------------------------- |
| Loading | Always, or when a file matching `paths:` is read | When the description matches the task, or `/name` | Delegated explicitly               |
| Purpose | Standards and constraints ("how code must look") | Step-by-step workflows ("how to do task X")       | Isolated, repeatable review passes |

- Rules are short, imperative and checkable; scope them with `paths:` frontmatter unless they apply
  to every task. Prefer a table or checklist over prose.
- A skill has frontmatter `name` (kebab-case, equals the folder) and a `description` that says
  **when** to use it with trigger phrases. Keep `SKILL.md` lean; long references go next to it.
- Do not duplicate: a skill links to the rule that defines the standard instead of restating it.
- Everything under `.claude/` is written in English. Update `CLAUDE.md`'s index when adding one.
- Third-party skills (e.g. `npx skills add …`) are reviewed before being copied in: they run with
  this repo's permissions.
