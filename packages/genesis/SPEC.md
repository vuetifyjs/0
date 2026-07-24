# @paper/genesis — Design Spec

## Identity

**Class:** kit (docs primitives). See [DESIGN_SYSTEMS.md](../../DESIGN_SYSTEMS.md).

A focused **docs-primitives library**: Vue 3 components that documentation sites need
(live examples, callouts, code groups, API tables, atomic primitives). Headless on the
parts that vary across consumers — code highlighting and icons are slot-injected.

Genesis is a **thin component layer over v0's theme system**. Components consume
`var(--v0-*)` tokens directly so they inherit whatever theme v0 has applied to the page.
There is no Genesis-specific token namespace, no Genesis-specific theme plugin, no
Genesis-specific stylesheet. Drop the package into any v0-themed app and components blend
with the page's chrome.

**Hosting on a design-system page** (Emerald, Onyx, …) requires that host to publish the
`--v0-*` cascade Genesis reads — see DESIGN_SYSTEMS.md *Kit interop* and
[Token bridge](#token-bridge). Genesis itself never aliases DS tokens.

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
│       ├── GnDocsExample/          # + Description, Preview, Code, Tabs, Panel, Actions
│       ├── GnDotGrid/
│       └── GnPeek/
```

No `GnDocsIcon`, no `adapter.ts`, no `plugin.ts`, no `theme.ts`. Genesis is just components.

## Theme inheritance

Every component's styles reference v0 tokens with sensible standalone fallbacks. Examples:

```css
.genesis-docs-example {
  background: var(--v0-surface, #fff);
  color: var(--v0-on-surface, #1a1c1e);
  border: 1px solid color-mix(in srgb, var(--v0-on-surface, currentcolor) 14%, transparent);
}
```

When v0's theme plugin is installed (any paper-DS-or-v0-themed app), `--v0-surface` etc.
resolve via the cascade and Genesis inherits the active theme. When Genesis is used in a
v0-less app, the fallbacks provide a reasonable light-theme appearance.

| v0 token consumed | Used for |
|---|---|
| `--v0-surface` | Outer component background |
| `--v0-surface-tint` | Preview wrap, tab strip |
| `--v0-on-surface` | Primary text + computed divider via color-mix |
| `--v0-on-surface-variant` | Muted text |
| `--v0-primary` | Active tab, filename badge, peek pill |
| `--v0-on-primary` | Text on primary |
| `--v0-pre` | Code pane background |

### Token bridge

Genesis **does not** read `--emerald-*` (or any other DS prefix). A design-system docs
app that mounts Genesis chrome must still provide `--v0-*` on the cascade. The preferred
mechanism (family contract): the DS adapter also emits `--v0-*` aliases for the color
roles Genesis consumes (`surface`, `on-surface`, `primary`, …), so Genesis blends without
a Genesis-side theming contract. Alternatives (register a parallel v0 theme; host-side
alias stylesheet) are allowed; the kit stays prefix-blind either way.

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
  collapse?: boolean           // accepted for API compatibility; description always collapses
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
| `GnDocsExamplePreview` | Wraps preview slot in `Splitter.Root` unless `disableResize`; exposes `reset()`; surfaces drag width on the consumer slot; applies `data-theme` when `theme` is set |
| `GnDocsExampleCode` | Single code pane; peek truncation; `<slot :code :language :file-name>` for highlighter (default: `<pre>` fallback) |
| `GnDocsExampleTabs` | Tab list + overflow dropdown for hidden tabs; reset, combine, and opt-in playground/bin action buttons; icon slots with inline-SVG defaults |
| `GnDocsExamplePanel` | Wraps one file's code pane content; provides the structural row inside a tab |
| `GnDocsExampleActions` | Toolbar host; renders an `aria-label`-ed group around action buttons |

### Per-example theme override (shipped)

```vue
<GnDocsExample theme="corporateIndigo">
  <!-- preview slot renders as if v0's theme were corporateIndigo, regardless of the page's theme -->
</GnDocsExample>
```

`GnDocsExample` forwards `theme` to `GnDocsExamplePreview`, which sets `data-theme="<name>"`
on the preview panel, scoping the v0 cascade for that subtree. Theme names come from v0's
theme registry.

### `GnPeek` — standalone peek toggle

A bottom-anchored expand/collapse pill (squircle, `--v0-primary`). **Not** a
`GnDocsExample` sub-component — it's a top-level Genesis primitive, consumed by
`GnDocsExampleDescription`, `GnDocsExample` (single-file peek mode), and docs-site code
blocks.

```ts
interface GnPeekProps {
  expandedLabel?: string   // default: 'Collapse'
  collapsedLabel?: string  // default: 'Expand'
}
```

`v-model:expanded` drives state. The default slot exposes `{ expanded }` for the label; a
separate `icon` slot defaults to an inline chevron that rotates 180° when expanded. Both
slots are overridable.

### `GnActionButton` — toolbar action affordance

A 32px icon action button for docs chrome (copy, reset, open-in). Wraps v0's `Button.Root`
+ `Button.Icon`.

```ts
interface GnActionButtonProps {
  ariaLabel?: string                     // forwarded to Button.Root's ariaLabel
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

Genesis ships a `<pre>` fallback only. apps/docs's `useHighlightCode` demonstrates Shiki
integration.

## Non-goals

- Genesis-specific *theme* token namespace — components consume v0 tokens via the cascade
  (the few `--gn-*` properties — e.g. layout knobs — are per-component, not theme tokens)
- Genesis plugin / adapter / theme — none shipped; v0's theme system is the source of truth
- Token aliasing for design systems — the DS adapter (or host) publishes `--v0-*`; Genesis
  stays prefix-blind
- Playground / Bin URL construction — `GnDocsExampleTabs` ships opt-in buttons
  (`showPlayground` / `showBin`) and emits `playground` / `bin` with the current files;
  navigation stays a docs-site concern
- Bundled Shiki — slot consumption only
- Icon library — slot defaults with inline SVG
- Paper composables / V0Paper — not used
- General-purpose buttons / forms / dialogs — out of scope (`GnActionButton` is docs-toolbar
  chrome wrapping v0's Button)
- Build pipeline / data layer (`virtual:api`, nav index, search, maturity) — docs-app concern
- Tests — only when explicitly requested

## Roadmap

### Phase 2 — docs furniture (rewrites, not extractions)

`apps/docs` components that look extractable are usually **site-coupled**. Porting them
into Genesis means defining a prop/inject seam and rewriting — not moving files. Acceptance
rule for every Tier A primitive:

> Imports no `virtual:*` module, no `stores/app`, no Bin/Playground/Ask-AI clients.

In priority order:

1. `GnDocsCallout` — TIP / NOTE / WARNING / CAUTION / IMPORTANT admonition shell (severity
   tokens via cascade; interactive types stay docs-site)
2. `GnDocsCodeGroup` — tabbed code blocks
3. `GnDocsKbd`, `GnDocsBadge`, `GnDocsCard` — atomic primitives
4. `GnDocsMarkup` — code block chrome with slot-injected highlighter (no URL actions)
5. `GnDocsApi*` — presentation-only API tables/cards/sections; **data is injected** by the
   host (props or provide). Do not import `virtual:api`
6. `GnDocsToc`, `GnDocsHeaderAnchor`, `GnDocsNavigator` — heading scan / prev-next with
   nav data **injected**; no Discovery/Sponsor/Ask coupling
7. `GnDocsBackToTop`, `GnDocsProgressBar`, `GnDocsSkeleton` — page chrome affordances
8. `GnDocsThemeSwitcher` — **first-class** for design-system docs whose product *is*
   theming; drives host `theme`/`adapter`/`plugin` rather than a thin local toggle

Open in apps/docs (not Genesis blockers): `GnDocsCallout` (#593), `GnDocsBadge` (#463).

### Phase 3 — design-system docs primitives

v0's docs are composable-first; a rich DS docs site needs component-matrix furniture that
neither apps/docs nor the current Phase 2 list ships:

| Primitive | Role |
|---|---|
| Variant / state matrix | Grid of variants × sizes × interactive states |
| Prop controls / knobs | Live prop editor for an example |
| Per-component token table | CSS custom properties a component reads |
| Token swatches / scale specimens | Color ramps, spacing/radius/type scales |
| Do / don't blocks | Spec callouts for correct vs incorrect usage |
| Anatomy | Labeled structural map of a compound |
| Install tabs | Package-manager install snippets |
| A11y-notes convention | Keyboard / ARIA notes block |
| Maturity / status chips | preview / stable / deprecated for pre-1.0 DS surfaces |
| Token / palette explorer | Browse the DS token graph (content for a rich DS, fluff for v0) |

### Out of Genesis (docs-app / pipeline)

- API generation (`vue-component-meta` / ts-morph), nav, search index, markdown-it
  containers, Shiki + API-identifier transformer — **parameterized** for
  `packages/{ds}/src/…`, not hard-coded to `packages/0`
- Ask-AI, Discovery / Skillz tours & quizzes, benchmark tiles, roadmap / release calendar
- Sponsor / contact surfaces

App topology (section inside `apps/docs` vs `apps/{ds}-docs` vs shared docs-toolchain
package) is a host decision; Genesis stays topology-agnostic.

## Architectural lessons (Phase 1 → revised)

The original Phase 1 shipped Genesis as a "paper DS with its own theme namespace"
(`--gn-*`, `createGenesisPlugin`, `createGenesisThemePlugin`, `genesis` and
`genesis-dark` themes). Real-world integration in apps/docs surfaced that:

- Components and the example content rendered inside them must share **one** theme
  cascade — otherwise the chrome and the inner example look like they're from different
  apps when the page's theme changes.
- Per-example theme override requires the theme system to be v0's (registry names +
  `data-theme` re-themes the example UI).
- v0's `createPluginContext` install gate is keyed by namespace — owning
  `'genesis:theme'` added complexity for no benefit once components consume v0 tokens.

Conclusion: docs kits should be **v0-token-consuming component libraries**, not parallel
theme systems. Design systems keep their own prefix (`--emerald-*`) for brand components
and, when they host Genesis, also publish the `--v0-*` bridge (family contract).
