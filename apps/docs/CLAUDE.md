# v0 Documentation Site

VitePress-style documentation for @vuetify/v0. SSG build with vite-ssg.

## Commit Convention

**Always use `docs` as the type for changes in this app.** Never use `fix(docs)` or `feat(docs)`.

```
docs: message                  # No scope needed
docs(ComponentName): message   # With scope when specific
```

## Commands

```bash
pnpm dev       # Start on port 8000
pnpm build     # SSG build
pnpm preview   # Preview build
```

## Stack

- **SSG**: vite-ssg (generates static HTML)
- **Routing**: unplugin-vue-router (file-based) + vite-plugin-vue-layouts-next
- **Markdown**: unplugin-vue-markdown + Shiki + Mermaid
- **Styling**: UnoCSS with `presetWind4()` (Tailwind v4 syntax, integrated reset)
- **State**: Pinia
- **PWA**: vite-plugin-pwa

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

## Structure

```
src/
├── components/
│   ├── app/          # App shell (AppHeader, AppDrawer, etc.)
│   ├── docs/         # Doc components (DocsExample, DocsApi, DocsToc, etc.)
│   └── home/         # Homepage components
├── composables/      # App-specific composables
├── examples/         # Live examples loaded by DocsExample
│   ├── components/   # examples/components/{component}/
│   └── composables/  # examples/composables/{composable}/
├── layouts/          # Page layouts
├── pages/            # File-based routing (.vue and .md)
│   ├── api/          # Dynamic API reference pages ([name].vue)
│   ├── components/   # disclosure, primitives, providers, semantic
│   ├── composables/  # foundation, forms, plugins, registration, selection, system, transformers, utilities
│   ├── guide/        # How-to guides
│   ├── introduction/ # Getting started, FAQ, contributing
│   ├── storybook/    # Storybook embed
│   └── utilities/    # Utility docs
├── plugins/          # Vue plugins
├── stores/           # Pinia stores
└── utilities/        # Helpers

build/
├── api-names.ts      # Shared API name discovery for SSG routes
├── generate-api.ts   # virtual:api - component/composable API extraction
├── generate-nav.ts   # virtual:nav - navigation structure
├── generate-search-index.ts  # Search index generation
└── markdown.ts       # Markdown processing
```

## Path Aliases

- `@` → `src/`
- `@vuetify/v0` → `packages/0/src`
- `#v0` → `packages/0/src`
- `#paper` → `packages/paper/src`

## Key Components

| Component | Purpose |
|-----------|---------|
| `DocsCallout` | GitHub-style callouts (`> [!TIP]`, `> [!WARNING]`, `> [!ERROR]`, `> [!ASKAI]`) |
| `DocsExample` | Live examples from `examples/` with code |
| `DocsMarkup` | Syntax-highlighted code blocks |
| `DocsApi` | Auto-generated API tables with inline/links toggle |
| `DocsApiLinks` | Card grid linking to dedicated API pages |
| `DocsToc` | Auto-generated table of contents |
| `DocsCodeGroup` | Tabbed code examples |
| `DocsMermaid` | Mermaid diagram renderer |
| `DocsPageFeatures` | Renders frontmatter features badge |
| `DocsBackToTop` | Scroll-to-top button |
| `DocsBackmatter` | Page footer with last commit info |
| `DocsNavigator` | Prev/next page navigation |
| `DocsReleases` | Release changelog display |

## Live Examples with DocsExample

To add interactive examples to documentation pages:

**1. Create the example file** in `src/examples/`:
```
src/examples/components/{component}/basic.vue
src/examples/composables/{composable}/basic.vue
src/examples/guide/{guide-name}/example.vue
```

**2. Import in the markdown page** using `<script setup>`:
```vue
<script setup>
import BasicExample from '@/examples/components/tabs/basic.vue'
import BasicExampleRaw from '@/examples/components/tabs/basic.vue?raw'
</script>
```

**3. Use DocsExample** with the component as slot and raw code as prop:
```vue
<DocsExample file="basic.vue" :code="BasicExampleRaw">
  <BasicExample />
</DocsExample>
```

| Prop | Purpose |
|------|---------|
| `file` | Filename shown in UI (e.g., `basic.vue`) |
| `:code` | Raw source string for syntax highlighting |
| slot | The actual Vue component to render |

> [!WARNING]
> Do NOT use just `<DocsExample file="path/to/example" />`. This won't render the component or show code. Always import both the component and its `?raw` version.

## Conventions

- **Always prefer @vuetify/v0 composables** over raw browser APIs or custom implementations. Check `mcp__vuetify-mcp__get_vuetify0_composable_list` before writing event listeners, observers, or state management.
- UnoCSS utilities for all styling
- Prefer markdown for documentation pages
- **Callouts**: Use `> [!TIP]`, `> [!WARNING]`, `> [!ERROR]` for alerts. Use `> [!ASKAI] question` to prompt Ask AI—phrase as a question the user would ask (e.g., "How do I add validation?"), not a question to the user. Use `> [!TOUR] tour-id` to embed a clickable tour callout—the tour name and description are pulled from the discovery registry automatically.
- **Vue code in markdown fences**: Indent `<script>` and `<style>` content by 2 spaces for visual alignment with `<template>`
- Examples: `src/examples/components/{component}/` or `src/examples/composables/{composable}/`
- Component docs: `pages/components/{category}/{component}.md`
- Composable docs: `pages/composables/{category}/{composable}.md`

## App Composables

| Composable | Purpose |
|------------|---------|
| `useHighlighter` | Shiki code highlighting |
| `useHighlightCode` | Code block highlighting |
| `useToc` | Table of contents generation |
| `useScrollSpy` | Active section tracking |
| `useScrollPersist` | Scroll position persistence |
| `useClipboard` | Copy to clipboard |
| `useThemeToggle` | Dark/light mode toggle |
| `useAsk` | AI Q&A chat with page context |

## Virtual Modules

| Module | Purpose |
|--------|---------|
| `virtual:api` | Component/composable API data extracted at build time |
| `virtual:nav` | Navigation structure generated from pages |

Import via `import data from 'virtual:api'`. Types in `vite-env.d.ts`.
