# v0 Documentation Site

VitePress-style documentation for @vuetify/v0. SSG build with vite-ssg.

## Commands

```bash
pnpm dev       # Start on port 8000
pnpm build     # SSG build
pnpm preview   # Preview build
```

## Stack

- **SSG**: vite-ssg (generates static HTML)
- **Routing**: unplugin-vue-router (file-based)
- **Markdown**: unplugin-vue-markdown + Shiki + Mermaid
- **Styling**: UnoCSS with `presetWind4()` (Tailwind v4 syntax, integrated reset)
- **State**: Pinia
- **PWA**: vite-plugin-pwa

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
'glass-surface'  // 70% surface with backdrop blur
'glass-warning'  // 70% warning with backdrop blur
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

## Conventions

- **Always prefer @vuetify/v0 composables** over raw browser APIs or custom implementations. Check `mcp__vuetify-mcp__get_vuetify0_composable_list` before writing event listeners, observers, or state management.
- UnoCSS utilities for all styling
- Prefer markdown for documentation pages
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
