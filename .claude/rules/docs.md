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
  level: 2                     # 1=index, 2=primary, 3=advanced
related:
  - /composables/selection/create-group
  - /components/forms/checkbox
---
```

## Component Page Structure

1. **H1 title** — component name
2. `<DocsPageFeatures :frontmatter />` — renders badges from frontmatter
3. `<DocsBrowserSupport>` — optional, for native API features
4. **Usage** — brief intro + `::: example` with basic example
5. **Anatomy** — Vue template tree in `` ```vue Anatomy playground `` `` code fence
6. **Architecture** — optional Mermaid diagram
7. **Recipes/Examples** — additional `::: example` sections
8. **Accessibility** — ARIA roles, keyboard interaction, screen reader behavior
9. **FAQ** — `::: faq` container with `???` questions
10. `<DocsApi />` — auto-generated API reference (props/events/slots)

## Composable Page Structure

1. **H1 title** — composable name
2. `<DocsPageFeatures :frontmatter />`
3. **Usage** — code example in `` ```ts collapse `` `` block
4. **Architecture** — Mermaid diagram showing composable hierarchy
5. **Reactivity** — table of reactive properties/methods
6. **Examples** — `::: example` with live demos
7. **FAQ** — `::: faq` container
8. `<DocsApi />` — auto-generated API reference (functions/options/methods/properties)

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
| `forms` | Checkbox, Switch, Radio |
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
