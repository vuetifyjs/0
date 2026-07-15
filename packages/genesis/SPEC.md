# @paper/genesis — Design Spec

## Identity

A focused **docs-primitives library**: Vue 3 components that documentation sites need (live examples, callouts, code groups, API tables, atomic primitives). Headless on the parts that vary across consumers — code highlighting and icons are slot-injected.

Genesis is a **thin component layer over v0's theme system**. Components consume `var(--v0-*)` tokens directly so they inherit whatever theme v0 has applied to the page. There is no Genesis-specific token namespace, no Genesis-specific theme plugin, no Genesis-specific stylesheet. Drop the package into any v0-themed app and components blend with the page's chrome.

## Package shape

```
packages/genesis/
├── package.json          # name: @paper/genesis ; deps: @vuetify/v0 only
├── SPEC.md               # this document
├── src/
│   ├── index.ts          # re-exports components
│   └── components/
│       ├── index.ts
│       ├── GnDocsExample/
│       ├── GnDocsExampleDescription/
│       ├── GnDocsExamplePreview/
│       ├── GnDocsExampleCode/
│       ├── GnDocsExampleTabs/
│       ├── GnDocsExamplePanel/
│       ├── GnDocsExampleActions/
│       ├── GnDocsCallout/
│       └── GnPeek/
```

No `GnDocsIcon`, no `adapter.ts`, no `plugin.ts`, no `theme.ts`. Genesis is just components.

## Theme inheritance

Every component's scoped `<style>` references v0 tokens with sensible standalone fallbacks. Examples:

```css
.genesis-docs-example {
  background: var(--v0-surface, #fff);
  color: var(--v0-on-surface, #1a1c1e);
  border: 1px solid color-mix(in srgb, var(--v0-on-surface, currentcolor) 14%, transparent);
}
```

When v0's theme plugin is installed (any paper-DS-or-v0-themed app), `--v0-surface` etc. resolve via the cascade and Genesis inherits the active theme. When Genesis is used in a v0-less app, the fallbacks provide a reasonable light-theme appearance.

| v0 token consumed | Used for |
|---|---|
| `--v0-surface` | Outer component background |
| `--v0-surface-tint` | Preview wrap, tab strip |
| `--v0-on-surface` | Primary text + computed divider via color-mix |
| `--v0-on-surface-variant` | Muted text |
| `--v0-primary` | Active tab, filename badge, peek pill |
| `--v0-on-primary` | Text on primary |
| `--v0-pre` | Code pane background |

## Components

### `GnDocsExample` — root orchestrator

```ts
interface GnDocsExampleProps {
  id?: string                  // anchor id for deep linking
  code?: string                // single-file source
  language?: string            // single-file language (default: 'vue')
  fileName?: string            // single-file filename
  files?: GnDocsExampleFile[]  // multi-file (overrides code/language/fileName)
  fileOrders?: (number | undefined)[]
  title?: string               // description heading
  collapse?: boolean           // collapsible description
  peek?: boolean               // truncated code with expand button
  peekLines?: number           // default 6
  disableResize?: boolean      // skip splitter affordance
  hideWidthIndicator?: boolean // hide drag-width indicator
}
```

### Sub-components

| Component | Responsibility |
|---|---|
| `GnDocsExampleDescription` | Heading + optional collapsible body; emits anchor-click |
| `GnDocsExamplePreview` | Wraps preview slot in `Splitter.Root` unless `disableResize`; exposes `reset()`; surfaces drag width on the consumer slot |
| `GnDocsExampleCode` | Single code pane; peek truncation; `<slot :code :language :file-name>` for highlighter (default: `<pre>` fallback) |
| `GnDocsExampleTabs` | Tab list + overflow dropdown for hidden tabs; reset and combine action buttons; `<slot name="reset-icon">`, `<slot name="combine-icon">`, `<slot name="split-icon">` with inline-SVG defaults |
| `GnDocsExamplePanel` | Wraps one file's code pane content; provides the structural row inside a tab |
| `GnDocsExampleActions` | Toolbar host; renders an `aria-label`-ed group around action buttons |

### `GnPeek` — standalone peek toggle

A bottom-anchored expand/collapse pill (squircle, `--v0-primary`). **Not** a `GnDocsExample` sub-component — it's a top-level Genesis primitive, consumed by `GnDocsExampleDescription`, `GnDocsExample` (single-file peek mode), and docs-site code blocks.

```ts
interface GnPeekProps {
  expandedLabel?: string   // default: 'Collapse'
  collapsedLabel?: string  // default: 'Expand'
}
```

`v-model:expanded` drives state. The default slot exposes `{ expanded }` for the label; a separate `icon` slot defaults to an inline chevron that rotates 180° when expanded. Both slots are overridable.

### `GnDocsCallout` — admonition shell

A presentational admonition box (info / tip / warning / caution / important). Pure shell — no interactivity, no app dependencies. Consumers layer behavior on top (the v0 docs site keeps the `askai` / `discord` / `tour` interactive callout types in its own `DocsCallout` wrapper, which delegates the five standard types to this component).

```ts
interface GnDocsCalloutProps {
  type?: 'tip' | 'note' | 'warning' | 'caution' | 'important' // default: 'note'
}
```

`type` drives three things: the severity color, the default icon, and the default title. Color comes from a per-type v0 severity token consumed via the cascade with a standalone fallback — `tip → --v0-success`, `note → --v0-info`, `warning → --v0-warning`, `caution → --v0-error`, `important → --v0-accent`. These severity tokens are supplied by the consuming app (they are not part of v0's core token set); without them the hardcoded fallbacks render a reasonable standalone appearance.

| Slot | Exposes | Default |
|---|---|---|
| `icon` | `{ type }` | inline MDI SVG per type |
| `title` | `{ type }` | capitalized type name |
| default | — | callout body |

## Icon strategy

Action buttons expose icon slots with inline `<svg>` defaults using MDI paths.

| Component | Slots | Default icon |
|---|---|---|
| `GnDocsExample` | `reset-icon` (single-file mode reset button) | refresh |
| `GnDocsExampleTabs` | `reset-icon`, `combine-icon`, `split-icon` | refresh / unfold-less / unfold-more |
| `GnPeek` | `icon` (chevron, rotates when expanded) | chevron-down |

```vue
<GnDocsExampleTabs>
  <template #reset-icon><MyIcon name="refresh" /></template>
  <template #combine-icon><MyIcon name="merge" /></template>
</GnDocsExampleTabs>
```

Zero-config works (defaults render); consumer can override per slot.

## Code highlighting

Consumer-injected via the default slot on `GnDocsExampleCode`:

```vue
<GnDocsExampleCode v-slot="{ code, language }" :code :language>
  <ShikiBlock :code :language />
</GnDocsExampleCode>
```

Genesis ships a `<pre>` fallback only. The dev workspace's `DevShikiBlock.vue` and apps/docs's `useHighlightCode` both demonstrate Shiki integration.

## Non-goals

- Genesis-specific token namespace — components consume v0 tokens via the cascade
- Genesis plugin / adapter / theme — none shipped; v0's theme system is the source of truth
- Playground / Bin / "open in" actions — docs-site concern
- Bundled Shiki — slot consumption only
- Icon library — slot defaults with inline SVG
- Paper composables / V0Paper — not used
- Buttons / forms / dialogs — out of scope
- Tests — only when explicitly requested

## Future — per-example theme override

The next architectural step (not yet implemented):

```vue
<GnDocsExample theme="corporateIndigo">
  <!-- preview slot renders as if v0's theme were corporateIndigo, regardless of the page's theme -->
</GnDocsExample>
```

Implementation sketch: `GnDocsExample` wraps its preview slot in `<div :data-theme="theme">` when the `theme` prop is set, scoping the v0 cascade for that subtree. The available theme names come from v0's `useTheme()` registry.

## Phase 2 roadmap

In priority order:

1. ~~`GnDocsCallout` (TIP / WARNING / ERROR / INFO admonitions)~~ — shipped; see below.
2. `GnDocsCodeGroup` (tabbed code blocks)
3. `GnDocsKbd`, `GnDocsBadge`, `GnDocsCard` (atomic primitives)
4. `GnDocsApi` (API reference tables with prop / event / slot sections + hover popovers)
5. Per-example theme override prop on `GnDocsExample`

## Architectural lessons (Phase 1 → revised)

The original Phase 1 shipped Genesis as a "paper DS with its own theme namespace" (`--gn-*`, `createGenesisPlugin`, `createGenesisThemePlugin`, `genesis` and `genesis-dark` themes). Real-world integration in apps/docs surfaced that:

- Components and the example content rendered inside them must share **one** theme cascade — otherwise the chrome and the inner example look like they're from different apps when the page's theme changes.
- A future feature where `GnDocsExample` renders a preview in a specific theme requires the theme system to be v0's (so the available theme names come from v0's registry, and the preview's `data-theme` override actually re-themes the example's UI).
- v0's `createPluginContext` install gate is keyed by namespace — having Genesis own `'genesis:theme'` worked but added complexity (extra stylesheet, extra plugin install) for no real benefit once we accepted that components should consume v0 tokens anyway.

Conclusion: paper DSs that ship docs primitives should be **v0-token-consuming component libraries**, not parallel theme systems. The Paper conversation remains open (Emerald may still benefit from a token layer of its own for brand-driven components like `EmButton`), but Genesis specifically wants the thin layer.
