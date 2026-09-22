# @paper/genesis — Design Spec

## Identity

**Class:** kit (docs primitives). See [DESIGN_SYSTEMS.md](../../DESIGN_SYSTEMS.md).

A focused **docs-primitives library**: Vue 3 components that documentation sites need
(live examples, callouts, code groups, API tables, atomic primitives). Headless on the
parts that vary across consumers — code highlighting is slot-injected. Icons are
slot-overridable; unused slot defaults resolve through an optional host
`GnIconsContext` (`provideGnIcons`), else a component-local inline SVG.

Genesis is a **thin component layer over v0's theme system**. Components consume
`var(--v0-*)` tokens directly so they inherit whatever theme v0 has applied to the page.
There is no Genesis-specific token namespace, no Genesis-specific theme plugin, no
Genesis-specific *theme* stylesheet. Drop the package into any v0-themed app and components
blend with the page's chrome. (The build still extracts component CSS to
`@paper/genesis/style.css`; published consumers import that once.)

**Hosting on a design-system page** (Emerald, Onyx, …) requires that host to publish the
`--v0-*` cascade Genesis reads — see DESIGN_SYSTEMS.md *Kit interop* and
[Token bridge](#token-bridge). Genesis itself never aliases DS tokens.

## Package shape

```
packages/genesis/
├── package.json          # name: @paper/genesis ; deps: @vuetify/v0 only
├── SPEC.md               # this document
├── src/
│   ├── index.ts          # re-exports components + provideGnIcons
│   ├── icons.ts          # optional host renderer (createContext, not a plugin)
│   └── components/
│       ├── index.ts
│       ├── GnActionButton/
│       ├── GnDocsBadge/
│       ├── GnDocsCallout/
│       ├── GnDocsExample/          # + Description, Preview, Code, Tabs, Panel, Actions
│       ├── GnDotGrid/
│       └── GnPeek/
```

No public icon component (`GnDocsIcon` / `GnIcon` is `@internal` chrome, not barreled),
no `adapter.ts`, no `plugin.ts`, no `theme.ts`. `src/icons.ts` is the kit's one
sanctioned context: optional inject, `null` when absent — not a plugin.

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

The one exception is `GnDotGrid`'s `color` default, `var(--v0-on-background)`, which carries
no literal fallback — an unresolved value makes the generated `color-mix()` invalid and the
grid renders nothing. Hosts must alias that token (see [Token bridge](#token-bridge)) or
pass an explicit `color`.

| v0 token consumed | Used for |
|---|---|
| `--v0-surface` | Outer component background |
| `--v0-surface-tint` | Preview wrap, tab strip |
| `--v0-on-surface` | Primary text + computed divider via color-mix; `GnDocsBadge` default fill (8% mix) |
| `--v0-on-surface-variant` | Muted text; `GnDocsBadge` default text |
| `--v0-primary` | Active tab, filename badge, peek pill |
| `--v0-on-primary` | Text on primary |
| `--v0-pre` | Code pane background |
| `--v0-on-background` | `GnDotGrid` dots and lines (no literal fallback) |
| `--v0-success` | `GnDocsCallout` tip |
| `--v0-info` | `GnDocsCallout` note |
| `--v0-warning` | `GnDocsCallout` warning |
| `--v0-error` | `GnDocsCallout` caution |
| `--v0-accent` | `GnDocsCallout` important — not in v0 `SEMANTIC_COLORS`; host-supplied or hex fallback |

### Token bridge

Genesis **does not** read `--emerald-*` (or any other DS prefix). A design-system docs
app that mounts Genesis chrome must still provide `--v0-*` on the cascade. The preferred
mechanism (family contract): the DS adapter also emits `--v0-*` aliases for the color
roles Genesis consumes (`surface`, `on-surface`, `primary`, `on-background`, plus the severity tokens `success` / `info` / `warning` / `error` / `accent`), so Genesis
blends without a Genesis-side theming contract. Alternatives (register a parallel v0 theme;
host-side alias stylesheet) are allowed; the kit stays prefix-blind either way.

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

Docs hosts the app-bar theme menu (`DocsExampleThemeMenu` → `AppThemeMenu`) on
`preview-actions`. The example root calls `createThemeToggle()` (follows the
page until override) and provides it via `createContext`. Persistence stays on
the v0 plugin: `createThemePlugin({ persist: true })`.

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

A 32px icon action button for docs chrome (copy, reset, open-in). Wraps v0's
`Button.Root` + `Button.Icon`.

```ts
interface GnActionButtonProps {
  ariaLabel?: string                     // forwarded to Button.Root's ariaLabel
  title?: string                         // native tooltip
  type?: 'button' | 'submit' | 'reset'   // default: 'button'
}
```

The icon goes in the default slot, rendered inside `Button.Icon`. `GnActionButton`
has no genesis icon role and no default glyph — the consumer supplies the artwork.

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

### `GnDocsBadge` — static label/tag

A non-interactive `<span>` for skill levels, skill modes, category tags, and similar
docs-site chrome. No business logic, no icon-name resolution.

```ts
interface GnDocsBadgeProps {
  color?: string             // any CSS color; omit for muted chrome
  backgroundOpacity?: number // default: 15 — color-mix %; ignored when color is omitted
  shape?: 'rounded' | 'pill' // default: 'rounded'
  title?: string              // native tooltip
}
```

Optional `color` sets text to that value and tints the background with `color-mix` at
`backgroundOpacity` (default 15). Omit `color` for muted chrome: `--v0-on-surface-variant`
text and an 8% `--v0-on-surface` mix (`backgroundOpacity` does not apply).

Default slot is the label. An `icon` slot (no default) renders an optional leading icon —
same "slot, not string" pattern as every other Genesis icon surface. The icon wrapper is
`aria-hidden` (decorative by contract; the label is the accessible name). Slotted icons
keep their own dimensions — the badge does not resize them.

### `GnDocsCallout` — admonition shell

A presentational admonition box (note / tip / warning / caution / important). Pure shell — no interactivity, no app dependencies. Consumers layer behavior on top (the v0 docs site keeps the `askai` / `discord` / `tour` interactive types and the random-tip pool in its own `DocsCallout` wrapper, which delegates the five standard types to this component).

```ts
interface GnDocsCalloutProps {
  type?: 'tip' | 'note' | 'warning' | 'caution' | 'important' // default: 'note'
}
```

`type` drives three things: the severity color, the default icon, and the default title. Color comes from a per-type v0 token consumed via the cascade with a standalone fallback — `tip → --v0-success`, `note → --v0-info`, `warning → --v0-warning`, `caution → --v0-error`, `important → --v0-accent`. `success` / `info` / `warning` / `error` are v0 semantic colors. `--v0-accent` is not; hosts must publish it (or accept the hex fallback).

| Slot | Exposes | Default |
|---|---|---|
| `icon` | `{ type }` | `GnIcon` for `callout-{type}` (host renderer, else local MDI path) |
| `title` | `{ type }` | English title for the type (`Tip`, `Note`, …) |
| default | — | callout body |

## Icon strategy

Precedence, highest first:

1. Named icon slot (one-off override).
2. Optional host `GnIconsContext.render(role)` from `provideGnIcons`.
3. Component-local inline SVG (`d` kept next to the component that owns it — no
   package-wide fallback map).

Roles name genesis **chrome needs** (`callout-tip`, `example-reset`, `peek`), not
glyphs. The host maps those onto its own icon set (`AppIcon`, `EmIcon`, …).
`render` may return `null` to fall through to the local SVG (unknown role,
version skew). `GnIcon` is internal; the public surface is `provideGnIcons` and
`GnIconRole`.

```ts
import { provideGnIcons, type GnIconRole } from '@paper/genesis'
import { h } from 'vue'

const toApp = {
  'callout-tip': 'lightbulb',
  // …every GnIconRole
} satisfies Record<GnIconRole, string>

provideGnIcons({
  render: (role, { size = 16 } = {}) => h(AppIcon, { icon: toApp[role], size }),
}, app)
```

| Component | Slots | Role(s) |
|---|---|---|
| `GnDocsExample` | `reset-icon`, `toggle-icon` | `example-reset`, `example-toggle` |
| `GnDocsExampleTabs` | `reset-icon`, `playground-icon`, `bin-icon`, `combine-icon`, `split-icon` | `example-reset`, `example-playground`, `example-bin`, `example-combine`, `example-split` |
| `GnPeek` | `icon` (wrapper rotates when expanded) | `peek` |
| `GnDocsCallout` | `icon` | `callout-tip` / `note` / `warning` / `caution` / `important` |
| `GnDocsBadge` | `icon` | — (no role, no default glyph) |
| `GnActionButton` | default slot is the icon | — (no role, no default glyph) |

Named slots remain the one-off escape hatch. Install `provideGnIcons` together
with deleting routine host slot-fills, or not at all — a provider nothing reads
is a third unused icon path. `GnDocsBadge`'s `icon` slot has no default — host
must fill it or the badge is text-only.

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
- Icon library / genesis-owned glyph registry / `createGenesisIconsPlugin` —
  host provides a renderer; components keep local SVG fallbacks. Named slots still win
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

1. `GnDocsCodeGroup` — tabbed code blocks
2. `GnDocsCard` — atomic primitives (`GnDocsBadge` shipped)
3. `GnDocsMarkup` — code block chrome with slot-injected highlighter (no URL actions)
4. `GnDocsApi*` — presentation-only API tables/cards/sections; **data is injected** by the
   host (props or provide). Do not import `virtual:api`
5. `GnDocsToc`, `GnDocsHeaderAnchor`, `GnDocsNavigator` — heading scan / prev-next with
   nav data **injected**; no Discovery/Sponsor/Ask coupling
6. `GnDocsBackToTop`, `GnDocsProgressBar`, `GnDocsSkeleton` — page chrome affordances
7. `GnDocsThemeSwitcher` — **first-class** for design-system docs whose product *is*
   theming; drives host `theme`/`adapter`/`plugin` rather than a thin local toggle


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
