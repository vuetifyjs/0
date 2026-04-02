---
paths: apps/docs/**
---

# Documentation Pages

Documentation lives in `apps/docs/src/`. File-based routing with markdown + Vue.

## Page Types

| Type | Path | Label prefix |
|------|------|-------------|
| Component | `pages/components/{category}/{name}.md` | `C: Name` |
| Composable | `pages/composables/{category}/{name}.md` | `E: name` |
| Guide | `pages/guide/{category}/{name}.md` | — |

## Frontmatter

```yaml
---
title: Name - Brief SEO description
meta:
  - name: description
    content: 150-160 char description
  - name: keywords
    content: comma, separated, keywords
features:
  category: Component | Composable
  label: 'C: Dialog'          # or 'E: createSelection'
  github: /components/Dialog/  # source path under packages/0/src/
  renderless: false            # components only
  level: 2                     # See "Skill Levels" section below
related:
  - /composables/selection/create-group
  - /components/forms/checkbox
---
```

## Page Intro

Every page must have a **1-2 sentence intro** immediately after `<DocsPageFeatures>`. The intro should be a brief, plain description of what the composable/component does — not a feature list, not multiple paragraphs, not bullet points.

```markdown
<!-- GOOD: brief, one sentence -->
Manage feature flags and variations across your application.

<!-- GOOD: two short sentences when needed -->
Headless notification management built on createRegistry and createQueue.
Supports push notifications, severity levels, auto-dismiss toasts, and adapter integration.

<!-- BAD: verbose, clause-heavy -->
The `useBreakpoints` composable provides comprehensive responsive design capabilities
through reactive viewport dimension detection, automatically tracking window size changes
and exposing named breakpoint state via a configurable threshold system.

<!-- BAD: list/bullets as intro -->
- Reactive viewport tracking
- Named breakpoints
- SSR-safe
```

## Adapter Sections

Composables that accept an `adapter` option must have an **Adapters** section documenting:

1. What the adapter does (one sentence)
2. The adapter interface name
3. Built-in implementations as a table
4. A code example showing custom adapter usage

```markdown
## Adapters

Adapters let you swap the underlying implementation without changing your application code.

| Adapter | Import | Description |
|---------|--------|-------------|
| `Vuetify0LoggerAdapter` | `@vuetify/v0` | Console-based (default) |
| `PinoLoggerAdapter` | `@vuetify/v0/logger/adapters/pino` | Pino integration |
| `ConsolaLoggerAdapter` | `@vuetify/v0/logger/adapters/consola` | Consola integration |
```

**Canonical import path** for adapters is the domain subpath: `@vuetify/v0/{domain}/adapters/{name}`.

## Component Page Structure

1. **H1 title** — component name
2. `<DocsPageFeatures :frontmatter />` — renders badges from frontmatter
3. `<DocsBrowserSupport>` — optional, for native API features
4. **Usage** — brief intro + code fence (not a live example)
5. **Anatomy** — Vue template tree in `` ```vue playground collapse `` `` code fence
6. **Architecture** — optional Mermaid diagram
7. **Examples** — `::: example` blocks, each with 2+ files
8. **Recipes** — code fences or single-file `::: example` blocks
9. **Accessibility** — ARIA roles, keyboard interaction, screen reader behavior
10. **FAQ** — `::: faq` container with `???` questions
11. `<DocsApi />` — auto-generated API reference (props/events/slots)

## Section Content Rules

| Section | Component pages | Composable pages |
|---------|----------------|-----------------|
| **Usage** | `::: example` with basic.vue | Code fence |
| **Anatomy** | `` ```vue playground collapse `` `` | — |
| **Examples** | `::: example` with 2+ files | `::: example` with 2+ files |
| **Recipes** | Code fence or single-file `::: example` | Code fence or single-file `::: example` |

## Composable Page Structure

1. **H1 title** — composable name
2. `<DocsPageFeatures :frontmatter />`
3. **Intro** — 1-2 sentence description (see Page Intro rules)
4. **Usage** — code example in `` ```ts collapse `` `` block
5. **Architecture** — Mermaid diagram showing composable hierarchy
6. **Adapters** — if the composable accepts adapters (see Adapter Sections rules)
7. **Reactivity** — table of reactive properties/methods
8. **Examples** — `::: example` with live demos
9. **FAQ** — `::: faq` container
10. `<DocsApi />` — auto-generated API reference (functions/options/methods/properties)

## Examples

Example files live in `apps/docs/src/examples/{type}/{name}/`.

### Single file

```markdown
::: example
/components/dialog/basic
:::
```

### Collapsed

```markdown
::: example collapse
/components/dialog/basic
:::
```

### Multi-file with ordering

```markdown
::: example
/composables/create-context/context.ts 1
/composables/create-context/Provider.vue 2
/composables/create-context/Consumer.vue 3
/composables/create-context/app.vue 4

### Title

Description paragraph.

| File | Role |
|------|------|
| `context.ts` | Creates the context |
| `Provider.vue` | Provides the context |
:::
```

### Example file conventions

- Use UnoCSS utility classes, no custom CSS
- Import from `@vuetify/v0`
- Keep examples minimal and focused
- One concept per example file

## Markdown Directives

| Syntax | Purpose |
|--------|---------|
| `::: example` | Live interactive example |
| `::: code-group` | Tabbed code blocks |
| `::: faq` | FAQ section with `???` questions |
| `> [!TIP]` | Informational callout |
| `> [!WARNING]` | Cautionary callout |
| `> [!ERROR]` | Error/danger callout |
| `` ```vue Anatomy playground `` `` | Live anatomy preview |
| `` ```ts collapse `` `` | Collapsible code block |
| `` ```ts no-filename `` `` | Hide filename in code block |

## API Reference

Auto-generated at build time — no manual API tables needed.

- **Components**: `vue-component-meta` extracts props, events, slots from SFC `defineProps`/`defineSlots`/`defineEmits`
- **Composables**: `ts-morph` extracts functions, options, methods, properties from exports
- Rendered by `<DocsApi />` at page bottom
- Cached in `.cache/api-cache.json`

## Skill Levels

Every page needs a `features.level` (1, 2, or 3). The level is determined by the **highest prerequisite** across Vue knowledge, v0 knowledge, and web platform knowledge.

| Level | Label | Vue | v0 | Web Platform |
|-------|-------|-----|-----|-------------|
| **1** | Beginner | Templates, props, events, slots | None | Basic HTML/CSS/JS |
| **2** | Intermediate | Composition API (ref, computed, watch), composables, provide/inject, v-model | Uses composables, follows examples | Common patterns (forms, modals, keyboard) |
| **3** | Advanced | effectScope, SSR/hydration internals, plugin authoring, advanced TS generics | Understands architecture (context, trinity, registry) | Specialized browser APIs (observers), ARIA |

### How to assign

Ask: **"What must the reader already know to use this page?"**

- **Level 1**: Orientation — "What is v0?" No v0 experience needed. Index pages, introduction, tooling, meta pages.
- **Level 2**: Consumption — "How do I use this in my app?" Reader uses composables and components. Most component and composable pages.
- **Level 3**: Extension — "How do I build on top of v0?" Reader understands internals or needs advanced Vue/browser knowledge. Foundation composables, registration primitives, framework-building guides, observer composables.

### Edge cases

- A composable that **wraps** an advanced concept into a simple API (e.g., `useToggleScope` wraps effectScope, `useHydration` wraps SSR) stays Level 2 — the abstraction is the point.
- A composable that **exposes** advanced concepts (e.g., `createContext` exposes provide/inject architecture, `createNested` exposes tree traversal strategies) is Level 3.

## Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Doc file | kebab-case | `expansion-panel.md` |
| Example folder | kebab-case of component | `examples/components/checkbox/` |
| Example file | kebab-case | `basic.vue`, `file-picker.vue` |
| Category folders | kebab-case | `disclosure/`, `forms/`, `selection/` |

## Component Categories

| Category | Components |
|----------|-----------|
| `disclosure` | Dialog, ExpansionPanel, Popover, Tabs |
| `forms` | Checkbox, Switch, Radio, Slider, Select |
| `primitives` | Atom |
| `semantic` | Avatar, Pagination, Breadcrumbs |
| `providers` | (context providers) |

## Composable Categories

| Category | Composables |
|----------|------------|
| `foundation` | createContext, createTrinity, createPlugin |
| `registration` | createRegistry, createTokens |
| `selection` | createSelection, createSingle, createGroup, createStep |
| `forms` | createForm |
| `plugins` | useTheme, useLocale, useLogger, useFeatures, usePermissions |
| `system` | useBreakpoints, useMediaQuery, useStorage, useHydration |
| `utilities` | useEventListener, useHotkey, useClickOutside, useLazy |
| `reactivity` | useToggleScope, useProxyModel |
| `transformers` | toReactive, toArray |
