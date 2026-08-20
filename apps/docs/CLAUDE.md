# v0 Documentation Site

VitePress-style documentation for @vuetify/v0. SSG build with vite-ssg.

## Commit Convention

**Always use `docs` as the type for changes in this app.** Never use `fix(docs)` or `feat(docs)`.

```
docs: message                  # No scope needed
docs(ComponentName): message   # With scope when specific
```

`pnpm dev` serves on port 8000. Remaining scripts and the stack are in this app's `package.json` and `vite.config.ts`.

## Routing & Layouts

Available layouts: `default`, `fullscreen`, `home` (in `src/layouts/`)

### Independent Routes with Custom Layouts

Files inside a folder with an `index.md` are treated as **nested routes** that inherit the parent's layout. To create a route with its own independent layout, use **dot notation** at the pages root:

```
# WRONG - [id].vue inherits index.md's default layout
pages/
  skillz/
    index.md      → /skillz (default layout)
    [id].vue      → /skillz/:id (NESTED, inherits default layout)

# CORRECT - dot notation creates independent route
pages/
  skillz/
    index.md      → /skillz (default layout)
  skillz.[id].vue → /skillz/:id (independent, uses its own layout)
```

Set layout in Vue files with `definePage()`:
```ts
definePage({
  meta: {
    layout: 'fullscreen',
  },
})
```

## UnoCSS Theme

Uses `presetWind4()` with custom theme colors mapped to CSS variables:

```ts
// Available color utilities: text-primary, bg-surface, border-divider, etc.
colors: {
  primary, secondary, accent, error, info, success, warning,
  background, surface, 'surface-tint', 'surface-variant', divider, pre,
  'on-primary', 'on-secondary', 'on-accent', 'on-error', 'on-info',
  'on-success', 'on-warning', 'on-background', 'on-surface', 'on-surface-variant'
}

// Custom shortcuts
'bg-glass-surface'  // 70% surface with backdrop blur
'bg-glass-warning'  // 70% warning with backdrop blur
```

## Page Frontmatter (Required)

All documentation pages need proper metadata for SEO:

```yaml
---
title: ComponentName - Brief Description
meta:
- name: description
  content: Full description for search engines (150-160 chars ideal)
- name: keywords
  content: comma, separated, keywords
features:
  category: Component | Composable | Guide | Utility
  label: 'E: ComponentName'  # Sidebar label
  github: /components/ComponentName/  # Link to source
---
```

## Path Aliases

- `@` → `src/`
- `@vuetify/v0` → `packages/0/src`
- `#v0` → `packages/0/src`
- `#paper` → `packages/paper/src`

## Live Examples

Feature pages (components/composables): use `::: gn-example` — full authoring rules in `.claude/rules/docs.md`. Do not hand-roll example mounts on those pages.

Design-system pages (`pages/systems/**`): use `::: ds-example`. Same authoring syntax. Emerald examples render inline under `[data-theme="emerald-light"]` / `emerald-dark` via the adapter token sheet (do not import baked `theme.css`). Iframe remains the rule for systems that reset elements (Bulma) — those run against `sandbox/<system>.html`. Examples live in `src/examples/systems/<system>/<component>/`, import from the design system rather than `@vuetify/v0`, and have **no UnoCSS**. Iframe protocol and gotchas in `.claude/rules/docs.md`.

Example files live in `src/examples/`:
```
src/examples/components/{component}/basic.vue
src/examples/composables/{composable}/basic.vue
src/examples/guide/{guide-name}/example.vue
```

## Conventions

- **Always prefer @vuetify/v0 composables** over raw browser APIs or custom implementations. Check `mcp__vuetify-mcp__get_vuetify0_composable_list` before writing event listeners, observers, or state management.
- UnoCSS utilities for all styling
- Prefer markdown for documentation pages
- **Examples**: `::: gn-example` on feature pages (see `.claude/rules/docs.md`); `::: ds-example` on design-system pages
- **Callouts**: Use `> [!TIP]`, `> [!NOTE]`, `> [!WARNING]`, `> [!CAUTION]`, `> [!IMPORTANT]` for alerts (GitHub-aligned). Use `> [!ASKAI] question` to prompt Ask AI—phrase as a question the user would ask (e.g., "How do I add validation?"), not a question to the user. Use `> [!TOUR] tour-id` to embed a clickable tour callout—the tour name and description are pulled from the discovery registry automatically.

The skill-level placement quiz is **not** a callout directive: it is the `AppSkillQuiz` component (rendered under the Skill Levels section of `guide/essentials/using-the-docs.md`), which drives `DocsQuestion` off the central bank in `apps/docs/src/skillz/questions/{track}.json`. Each attempt samples a level-spread subset and builds each question's options from its `answers` + a fresh draw from its own `distractors` pool; completing it suggests a skill level the reader can apply to the docs filter.
- **Vue code in markdown fences**: Indent `<script>` and `<style>` content by 2 spaces for visual alignment with `<template>`
- Examples: `src/examples/components/{component}/` or `src/examples/composables/{composable}/`
- Component docs: `pages/components/{category}/{component}.md`
- Composable docs: `pages/composables/{category}/{composable}.md`

## App Composables

Browse `src/composables/` for the full set. One rule that isn't obvious from the source:

- `useMarkdown` is the **only** runtime markdown → HTML pipeline (GitHub API content, AI responses); it also exports `renderInline` for single lines. Never instantiate `Marked` in a component — extend `useMarkdown` instead.
