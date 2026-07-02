# @paper/genesis — Design Spec

## Identity

A focused **docs-primitives library**: Vue 3 components that documentation sites need (live examples, callouts, code groups, API tables, atomic primitives). Headless on the parts that vary across consumers — code highlighting and icons are slot-injected.

Genesis is a **thin component layer over v0's theme system**. Components consume `var(--v0-*)` tokens directly so they inherit whatever theme v0 has applied to the page. There is no Genesis-specific *theme* token namespace (the few `--gn-*` custom properties are consumer-tunable layout knobs, not tokens), no Genesis-specific theme plugin, no Genesis-specific stylesheet. Drop the package into any v0-themed app and components blend with the page's chrome.

## Package shape

```
packages/genesis/
├── package.json          # name: @paper/genesis ; deps: @vuetify/v0 only
├── SPEC.md               # this document
├── src/
│   ├── index.ts          # re-exports components
│   └── components/
│       ├── index.ts
│       ├── GnActionButton/
│       ├── GnDocsBadge/
│       ├── GnDocsExample/    # GnDocsExample.vue + Description / Preview / Code / Tabs / Panel / Actions SFCs
│       ├── GnDotGrid/
│       └── GnPeek/
```

No `GnDocsIcon`, no `adapter.ts`, no `plugin.ts`, no `theme.ts`. Genesis is just components.

## Theme inheritance

Every component's `<style>` (scoped, except where a multi-root child blocks scoping — see `GnActionButton`) references v0 tokens with sensible standalone fallbacks; purely structural sub-components (`GnDocsExamplePanel`, `GnDocsExampleActions`) have no chrome to theme and reference no tokens. Tokens can also enter through prop defaults — `GnDotGrid`'s `color` prop defaults to `var(--v0-on-background)` while its style block is token-free. Examples:

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
| `--v0-on-background` | `GnDotGrid` dots/lines (via its `color` prop default, not its stylesheet) |

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
  collapse?: boolean           // accepted for API compatibility; the description always collapses
  peek?: boolean               // truncated code with expand button
  peekLines?: number           // default 6
  disableResize?: boolean      // skip splitter affordance
  hideWidthIndicator?: boolean // hide drag-width indicator
  theme?: string               // scope a v0 theme to the preview (via data-theme)
  showPlayground?: boolean     // "open in playground" button (multi-file toolbar)
  showBin?: boolean            // "open in bin" button (multi-file toolbar)
}
```

### Sub-components

| Component | Responsibility |
|---|---|
| `GnDocsExampleDescription` | Heading + optional collapsible body; emits anchor-click |
| `GnDocsExamplePreview` | Wraps preview slot in `Splitter.Root` unless `disableResize`; exposes `reset()`; surfaces drag width on the consumer slot |
| `GnDocsExampleCode` | Single code pane; peek truncation; `<slot :code :language :file-name>` for highlighter (default: `<pre>` fallback) |
| `GnDocsExampleTabs` | Tab list + overflow dropdown for hidden tabs; reset, combine, and opt-in playground/bin action buttons; `<slot name="reset-icon">`, `<slot name="playground-icon">`, `<slot name="bin-icon">`, `<slot name="combine-icon">`, `<slot name="split-icon">` with inline-SVG defaults |
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

### `GnDocsBadge` — static label/tag

A non-interactive `<span>` for skill levels, skill modes, category tags, and similar docs-site chrome. No business logic, no icon-name resolution.

```ts
interface GnDocsBadgeProps {
  color?: string             // any CSS color (e.g. var(--v0-primary)); drives background+text tint via color-mix. Omit for neutral.
  backgroundOpacity?: number // default: 15 (color-mix percentage, 0-100)
  shape?: 'rounded' | 'pill' // default: 'rounded'
  title?: string              // native tooltip
}
```

Default slot is the label. An `icon` slot (no default) renders an optional leading icon — same "slot, not string" pattern as every other Genesis icon surface. The icon wrapper is `aria-hidden` (the icon is decorative by contract — the label is the accessible content), and slotted icons keep their own dimensions — the badge does not resize them.

### `GnActionButton` — toolbar action affordance

A 32px icon action button for docs chrome (copy, reset, open-in). Wraps v0's `Button.Root` + `Button.Icon`; ships an unscoped `<style>` because a scoped rule's data-v never lands on `Button.Root`'s multi-root `<button>`.

```ts
interface GnActionButtonProps {
  ariaLabel?: string                     // forwarded to Button.Root's ariaLabel (solo icon buttons)
  title?: string                         // native tooltip
  type?: 'button' | 'submit' | 'reset'   // default: 'button'
}
```

The icon goes in the default slot, rendered inside `Button.Icon`.

### `GnDotGrid` — decorative backdrop

An `aria-hidden`, absolutely-positioned dot-grid layer with a radial fade mask.

```ts
interface GnDotGridProps {
  color?: string     // default: 'var(--v0-on-background)' — any CSS color
  coverage?: number  // default: 15 — % of the radial fade kept transparent
  density?: number   // default: 20 — grid cell size in px
  lines?: number     // default: 0 — connecting-line alpha %; 0 = dots only
  origin?: string    // default: 'bottom left' — fade origin
}
```

## Icon strategy

Action buttons expose icon slots with inline `<svg>` defaults using MDI paths.

| Component | Slots | Default icon |
|---|---|---|
| `GnDocsExample` | `reset-icon` (single-file mode reset button) | refresh |
| `GnDocsExampleTabs` | `reset-icon`, `playground-icon`, `bin-icon`, `combine-icon`, `split-icon` | refresh / play / open-in-new / unfold-less / unfold-more |
| `GnPeek` | `icon` (chevron, rotates when expanded) | chevron-down |
| `GnDocsBadge` | `icon` | none — no generic badge icon to default to |

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

Genesis ships a `<pre>` fallback only. apps/docs's `useHighlightCode` demonstrates Shiki integration.

## Non-goals

- Genesis-specific *theme* token namespace — components consume v0 tokens via the cascade (the few `--gn-*` properties — `--gn-docs-example-sticky-top`, `--gn-docs-example-toggle-h` — are per-component layout knobs, not theme tokens)
- Genesis plugin / adapter / theme — none shipped; v0's theme system is the source of truth
- Playground / Bin / "open in" actions — `GnDocsExampleTabs` ships the opt-in buttons (`showPlayground` / `showBin`) and emits `playground` / `bin` with the current files; URL construction and navigation stay a docs-site concern
- Bundled Shiki — slot consumption only
- Icon library — slot defaults with inline SVG
- Paper composables / V0Paper — not used
- General-purpose buttons / forms / dialogs — out of scope (`GnActionButton` is docs-toolbar chrome wrapping v0's Button, not a general-purpose button offering)
- Tests — only when explicitly requested

## Per-example theme override

Shipped:

```vue
<GnDocsExample theme="corporateIndigo">
  <!-- preview slot renders as if v0's theme were corporateIndigo, regardless of the page's theme -->
</GnDocsExample>
```

`GnDocsExample` forwards `theme` to `GnDocsExamplePreview`, which sets `data-theme="<name>"` on the preview panel, scoping the v0 cascade for that subtree. Theme names come from v0's theme registry.

## Phase 2 roadmap

In priority order:

1. `GnDocsCallout` (TIP / WARNING / ERROR / INFO admonitions)
2. `GnDocsCodeGroup` (tabbed code blocks)
3. `GnDocsKbd`, `GnDocsCard` (atomic primitives — `GnDocsBadge` shipped, see `## Components`)
4. `GnDocsApi` (API reference tables with prop / event / slot sections + hover popovers)
5. Per-example theme override prop on `GnDocsExample` (shipped, see `## Per-example theme override`)

## Architectural lessons (Phase 1 → revised)

The original Phase 1 shipped Genesis as a "paper DS with its own theme namespace" (`--gn-*`, `createGenesisPlugin`, `createGenesisThemePlugin`, `genesis` and `genesis-dark` themes). Real-world integration in apps/docs surfaced that:

- Components and the example content rendered inside them must share **one** theme cascade — otherwise the chrome and the inner example look like they're from different apps when the page's theme changes.
- A future feature where `GnDocsExample` renders a preview in a specific theme requires the theme system to be v0's (so the available theme names come from v0's registry, and the preview's `data-theme` override actually re-themes the example's UI).
- v0's `createPluginContext` install gate is keyed by namespace — having Genesis own `'genesis:theme'` worked but added complexity (extra stylesheet, extra plugin install) for no real benefit once we accepted that components should consume v0 tokens anyway.

Conclusion: paper DSs that ship docs primitives should be **v0-token-consuming component libraries**, not parallel theme systems. The Paper conversation remains open (Emerald may still benefit from a token layer of its own for brand-driven components like `EmButton`), but Genesis specifically wants the thin layer.
