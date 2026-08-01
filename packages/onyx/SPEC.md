# @paper/onyx — Design Spec

## Identity

**Class:** design system (rich). See [DESIGN_SYSTEMS.md](../../DESIGN_SYSTEMS.md).

Onyx is a `@paper/*` design system built headless from the start on
`@vuetify/v0`, with a **shadcn-centric visual language** instead of Material:
neutral-first palette, paired semantic tokens, 1px borders over elevation,
small radii from a single knob, `:focus-visible` rings, compact type. Nothing
Material survives — no ripples, no floating labels, no elevation ramp, no
ALL-CAPS buttons. Its visual language has been redrawn since — a first pass
shipped a flat graphite palette, replaced by the warm, dark-by-default
lapidary material system described below.

Component prefix: `On` (`OnButton`). CSS namespace: `onyx-*` classes,
`--onyx-*` custom properties. `private: true`, `version: 0.0.0` until the
first release cut.

**Visual language: Direction A, "Lapidary / Jewel-Box"** (commissioned design
elevation, won a 3-way competition — full spec `.superpowers/design/direction-a.md`).
The shadcn-derived *composition* rules below (token pairing, 1px borders over
elevation, compact type, zero utility classes) are unchanged; the *palette and
material system* are Direction A's, replacing the original zinc/Inter treatment
described in earlier drafts of this file. Real onyx is a warm brown-black
chalcedony, not blue-black — depth is drawn with a girdle of light on each
object's top edge plus a dark pool beneath it, not with shadow alone (shadow
on a near-black ground is arithmetically invisible; see direction-a.md §2).

## Token source

No Figma file. Tokens are **authored directly in `src/theme.ts`** — nine named
surface values (`pitch`, `stone`, `stoneRaised`, `intaglio`, `hairline`,
`hairlineStrong`, `mutedFg`, `bone`, `champagne`, plus `champagneDeep`/
`carnelian`/`carnelianFg`/`verdite`/`topaz`/`sapphire` for destructive/severity),
OKLCH hue 56-62°/chroma 0.006-0.012 for the dark ramp — warm stone, never
blue-black. **`#000000` never appears anywhere in this system — hard rule.**
Every "black" reference (scrims, recess shadows, pool shadows) is built from
`pitchDeep` (`#080605`) or a `color-mix()` of it instead of a literal
`#000`/`rgb(0 0 0 / X)`. The two `shadow-xs`/`shadow-sm` foundation tokens are
the sole exception — kept verbatim for backward compatibility (unused by any
component after this direction; see "Material system" below) and explicitly
exempted from the rule for that reason. A legacy `neutral` 50-950 ramp also
survives, unused internally, purely so `dev/src/onyx/pages/Color.vue` keeps
compiling until the docs pass replaces it.

Semantic pairs (`background`/`foreground`, `card`/`card-foreground`,
`primary`/`primary-foreground`, …) live in `light: Semantic` / `dark: Semantic`
maps, plus material geometry maps `materialDark`/`materialLight` (band, girdle,
girdle-lit, girdle-recess, pool, pool-overlay, lamp, surface-raised,
hairline-strong, champagne — all theme-dependent) and two theme-independent
values (`bandRecess`, `girdleActive` — the spec's own light-mode override never
redefines these, so both themes share one value). `colors.ts`'s `palette()`
merges a theme's semantic map with its material map plus the shared/scrim
values into the one flat `Record<string,string>` `block()` emits — `--v0-*`
aliasing and the `UNSAFE_CSS` guard are unaware of the merge, they just iterate
whatever `palette()` hands them. Foundations (`radius`, `spacing`, `stroke`,
`shadow`, `fontFamily`, `fontSize`, `motion`, `control`) are non-color
`as const` objects in the same file; `fontFamily` gained a `serif` face
(Fraunces), and every `fontSize` step now carries a `letterSpacing` alongside
size/line-height (direction-a.md §4.2's "buying air" scale).

**Onyx is dark by default.** Two registered themes: `onyx` (the `dark: Semantic`
map — Dark, default) and `onyx-light` (the `light: Semantic` map — Light,
variant), both emitted by the adapter and both prebaked. `theme.ts` keeps the
`light`/`dark` value-map names as-is (they describe the palette, not which one
ships as default); the *wiring* in `colors.ts` is what flips —
`themes.onyx` points at `palette(dark, materialDark)` with `dark: true`,
`themes['onyx-light']` points at `palette(light, materialLight)`.
`createOnyxPlugin()`'s `default: 'onyx'` and `bake-theme.ts`'s `:root` block
both resolve to the dark palette; `:root` also carries `color-scheme: dark`.

### Material system — the girdle

Every raised surface is four layers (direction-a.md §5.1): a **band** (a subtle
top-lightening gradient), a **girdle** (a 1px inset line on the top edge — the
signature device, brighter = closer to the lamp, champagne-tinted = selected/
active, colored = severity), a **hairline** border, and a **pool** (a wide
negative-spread shadow that darkens the ground beneath the object, never a
visible drop shadow). Recessed surfaces (inputs, tab troughs, progress tracks)
invert the light direction instead: `band-recess` darkens top-to-bottom,
`girdle-recess` is a dark inset at the top with a faint lit edge at the bottom.
Applied to all 16 component families; `OnCard`/`OnDialog`/`OnToast`/`OnTable`
get the full band+girdle+pool treatment as raised objects, `OnInput`/
`OnTabs__list`/`OnProgress__track` get the recess treatment, and small inline
elements (`OnBadge`, `OnChip`, `OnAvatar`, breadcrumb links) intentionally
**don't** get a girdle at all — per direction-a.md §6's own discipline rule,
"ghost buttons, plain text, dividers... never get a girdle... if it does not
sit above the ground, it does not catch light" — a pill-shaped inline label
isn't an object floating above the page any more than a ghost button is.
`OnBanner`, spanning full-width and attached to a layout edge, is treated the
same way (a fixture, not a floating object).

Severity (`OnAlert`, `OnToast`) lives **only** in the girdle — a colored inset
line on the object's own top edge — never a tinted background or colored
border, per direction-a.md §5.8's "single rule for severity colour."

### Grafts from Direction B (direction-b.md)

Three deliberate imports, layered onto Direction A's own material system:

- **Explicit disabled colors, never `opacity`.** Every `[data-disabled]` state
  across all 16 families sets a concrete `color`/`background`/`border-color`
  (usually `muted-foreground` on a flat, unlit surface, `box-shadow: none`)
  instead of fading with `opacity: 0.5`-style rules — an opacity fade also
  dims the focus ring and can drop text below the accessibility floor.
- **Focus is a real `outline`, never only a `box-shadow`.** Every focusable
  control in the system (buttons, inputs, tabs, chips, pagination items,
  breadcrumb links/activator, dialog close, toast action/close, list-group
  activator) carries `outline: 2px solid color-mix(in oklab, var(--onyx-ring)
  85%, transparent); outline-offset: 2px`. `OnInput`'s champagne glow
  (`box-shadow`) is additive decoration on top of that outline, not a
  replacement for it — direction-a.md §5.5's own worked CSS set `outline:
  none` on focus, which this graft overrides.
- **Excavated input lighting** — `OnInput`'s recess (dark top edge via
  `girdle-recess`, faint lit line at the bottom) already matches direction-a.md
  §5.1's recess-inversion model; the graft is confirmation, not a change.

### Accessibility floor requirements

`prefers-contrast: more` is a required deliverable (direction-a.md §9, not
optional polish): hairline borders measure only 1.28:1 (dark) / 1.42:1 (light)
against their surface — deliberately below the 3:1 non-text floor, since this
direction demotes borders to decoration everywhere a girdle or fill delta also
carries the state. Under the media query, `--onyx-border` promotes to
`--onyx-hairline-strong` in both themes, and the dark theme's girdle (baseline
0.055 alpha, too faint for this preference) raises to 0.14 — emitted by
`css.ts`'s `contrastMore()`, called once at the end of both `adapter.ts`'s
`generate()` and `bake-theme.ts`'s output. `prefers-reduced-motion: reduce`
stays intact for every existing transition; the two new entrance animations
(`OnDialog`, `OnToast`) drop their transform/scale under the same query and
fall back to a 120ms opacity-only fade, per direction-a.md §7.

### Typography

Display face **Fraunces Variable** (serif, weight 300, opsz/WONK variation
axes) for `3xl` and up; body face **Instrument Sans Variable** below that;
utility face **IBM Plex Mono** for hallmark labels and tabular data. All three
carry a graceful system fallback in the token itself
(`"Fraunces Variable", Fraunces, Georgia, "Times New Roman", serif`, etc.) so a
failed self-hosted font load degrades to the previous appearance, not to Times.
This package only wires the token names + fallbacks — **the docs agent installs
the actual `@fontsource` packages.**

## Pipeline

| Path | How |
|---|---|
| **Zero-config** | `import '@paper/onyx/theme.css'` + `import '@paper/onyx/style.css'` — both prebaked/built, both exported in `exports` and `publishConfig.exports` |
| **Full** | `app.use(createOnyxPlugin())` — registers both themes via `OnyxStyleSheetAdapter extends V0StyleSheetThemeAdapter` (`prefix: 'onyx'`) |
| **Kit interop** | Adapter emits `--v0-*` aliases from the map below, so Genesis chrome renders on Onyx pages |

**Single CSS source of truth**: the pure CSS emitters (`foundations()`, `block()`,
the alias map, the `UNSAFE_CSS` guard) live in one dependency-free module,
`src/css.ts` — zero `@vuetify/v0` imports anywhere in its graph. `adapter.ts` wraps
it in the `V0StyleSheetThemeAdapter` subclass; `scripts/bake-theme.ts` renders the
same emitters under `tsx` with zero build-order dependency on `packages/0/dist` —
a rendering of the shared emitters, never a re-implementation.

### `--v0-*` alias map (kit interop)

**Required** — the roles DESIGN_SYSTEMS ruling 1 names as kit-consumed:

| `--v0-*` alias | Onyx token |
|---|---|
| `background` / `on-background` | `background` / `foreground` |
| `surface` / `on-surface` | `card` / `card-foreground` |
| `surface-tint` | `muted` |
| `on-surface-variant` | `muted-foreground` |
| `primary` / `on-primary` | `primary` / `primary-foreground` |
| `pre` | `muted` (code-block background) |
| `warning` / `success` / `info` / `error` | severity tokens (+ `destructive` for `error`) |

**Reserved (emitted, unused today, labeled as such):** `accent` ← `brand`.
`brand-foreground` is reserved for the same reason — no component pairs it yet.

## Composition rules

Inherited from DESIGN_SYSTEMS rulings 2–3:

- Behavioral components compose v0 compound primitives directly (`Button.Root`,
  `Dialog.Root`, `Tabs.Root`, `Input.Root`, `Snackbar.Root`, …). Presentational
  components render `Atom` (or semantic elements via `Atom :as`).
- **Never** native HTML form controls. **Never** `@vuetify/paper`. **Never**
  `<style scoped>` (multi-root primitives drop `data-v` — every unscoped `<style>`
  carries the one-line justification comment).
- Class naming `onyx-block__element`; state via `data-variant` /
  `data-size` / primitive-emitted `data-*` attributes — zero computed class lists.
- Every `var(--onyx-*)` carries a literal fallback matching the default
  **dark** theme (component CSS only — dev-app docs/demo styling is exempt).
- No utility classes in package source. No UnoCSS theme export — `theme.ts`
  exports token objects only.
- Path aliases: `#onyx`, `#onyx/*`, `#v0`, `#v0/*` exist in
  tsconfig/tsdown per DESIGN_SYSTEMS §4, but **imports use `@vuetify/v0`** (its
  `development` export condition resolves to source) — `#v0`-as-source-path pulls
  v0's entire source tree into this package's TS program (`TS6307`), and the
  project-reference escape demands a pre-built `packages/0` (`TS6305`). Discovered
  during implementation (Task 4; see `.superpowers/sdd/task-4-report.md`) — the
  aliases stay config-only, imports go through `@vuetify/v0`. Intra-package
  imports are relative.

## Wave 1 surface

20-component inventory mapped from the original Onyx's exported components:
**15 direct**, **3 folded** (`HdsIconBtn` → `OnButton size="icon"`;
`HdsCardTitle`/`HdsCardActions` → `OnCard.Title`/`OnCard.Footer`), **1 dropped**
(`HdsSpacer`), **1 deferred** (`HdsDatePicker`) — 15 + 3 + 1 + 1 = 20.
`OnPagination` is additive (not in the original; required by `OnTable`'s footer).

| On | Original | v0 basis |
|---|---|---|
| `OnButton` | HdsBtn (+ HdsIconBtn folded) | `Button.Root/Content/Loading` |
| `OnBadge` | HdsInlineBadge | `Atom` |
| `OnChip` | HdsChip | `Atom` + `Button.Root` close affordance |
| `OnCard` (+ Header/Title/Description/Content/Footer) | HdsCard (+ HdsCardTitle/HdsCardActions folded) | `Atom` |
| `OnAlert` (+ Title/Description) | HdsMessage | `Atom` + `role="alert"` |
| `OnBanner` | HdsBanner | `Atom` |
| `OnInput` | HdsTextField | `Input.Root/Control/Description/Error` |
| `OnDialog` (+ Activator/Content/Title/Description/Close/Footer) | HdsDialog | `Dialog.*` |
| `OnTabs` (+ List/Item/Panel) | HdsTabs | `Tabs.*` |
| `OnToast` (+ provider wiring) | HdsSnackbar | `Snackbar.*` + `useNotifications` |
| `OnProgress` | HdsProgress | `Progress.Root/Track/Fill` |
| `OnBreadcrumbs` (+ List/Item/Link/Page/Ellipsis/Divider) | HdsBreadcrumbs | `Breadcrumbs.*` |
| `OnTable` | HdsDataTable | `createDataTable` + `createFilter` + own markup |
| `OnPagination` (+ Item/Prev/Next/First/Last/Ellipsis) | additive (data-table footer) | `Pagination.*` |
| `OnList` (+ Item/Group) | HdsListItem | `Atom`; `Collapsible` for groups |
| `OnAvatar` (+ Image/Fallback) | HdsListItemAvatar | `Avatar.*` |
| — dropped: `HdsSpacer` | flexbox `margin-left: auto` — a component would be API noise |
| — deferred: `HdsDatePicker` | non-goal wave 1 — no v0 `DatePicker` primitive past draft maturity |

Icons: no icon dependency in the package — raw inline SVGs (lucide-style 24×24,
`stroke-width: 2`, `currentColor`).

Maturity: **preview**. Docs app: `dev` → `/onyx`.

## Non-goals (wave 1)

- DatePicker / calendar (blocked on a v0 primitive; documented gap).
- Checkbox, Switch, Select, Slider, Combobox — not in the original inventory; the
  DS is scoped to onyx's surface, not shadcn's full catalog.
- Published npm release (`private: true` until the release cut).
- Figma library, Code Connect.
- Unit/browser tests — house rule: tests are written when explicitly requested;
  verification is the full desktop+mobile interaction review.
- Theming beyond the two shipped themes.
- `OnTable`: no cell slot — cell content is `column.value?.(row) ?? row[column.key]`,
  not a per-cell scoped-slot override.
- `OnTable`: no dense mode — a single row-height/padding scale for wave 1.
- `OnBanner`: no restore/undo primitive — dismiss is terminal; no re-open affordance.

## API decisions

- **No `useToast()` re-export.** `OnToaster` is the mount-once outlet; firing a
  toast is `useNotifications().send({ subject, severity, ... })` imported
  straight from `@vuetify/v0`, exactly like v0's own `Snackbar` barrel JSDoc
  example. Checked both the vuetify0 skill's component-examples reference and
  Emerald (no `EmSnackbar`/`EmToast` exists there at all) for an established
  wrap-and-re-export pattern before deciding — neither shows one. Adding a
  bespoke `useToast()` would be new public surface with no demonstrated need,
  plus its own namespace-coordination bookkeeping to keep in sync with
  `OnToaster`'s internal `Snackbar.Queue` default namespace. Revisit only if a
  second consumer (multi-instance toaster, custom namespace) actually shows up.
- **Toast actions ride `NotificationTicketInput.data`, not a slot.** `send()` is
  imperative — the call site firing a toast has no template relationship to
  `OnToaster` to hand it a scoped slot. `OnToaster` instead recognizes an
  `{ action: { label, onClick } }` shape in `data` (typed as `OnToastAction`,
  exported from `OnToast/OnToaster.vue`) and renders an extra button. This is
  the only mechanism available given `useNotifications`' imperative API — not
  a stylistic choice.

## Reference

- `DESIGN_SYSTEMS.md` (root) — family contract, all rulings.
- `packages/genesis/SPEC.md` — kit-shape exemplar (contrast class).
- Emerald worktree `feat/emerald-wave1` — structural template; its audited
  deviations are corrected here, not copied.
- shadcn/ui — token pairing model, density, state aesthetics (referenced from
  training knowledge + public docs; no code copied — all components are v0
  compositions).
- Visual evidence: `.playwright-mcp/onyx/`.
- Full design spec: `.claude/specs/2026-07-31-onyx-design-system.md`.
- `tsdown.config.mts` omits the `exports: { devExports: 'development' }` option
  (DESIGN_SYSTEMS §4's proposed bullet) — it auto-syncs `package.json`'s exports
  map to only files present when tsdown's own build step runs (before
  `bake:theme`), silently pruning `./theme.css` on every build. Ruling 1
  (**DECIDED**) requires the `--v0-*` kit-interop surface `theme.css` carries;
  §4's `devExports` bullet is still **PROPOSED**. See
  `.superpowers/sdd/task-5-report.md` for the discovery and the Emerald
  comparison that explains it.
- `data-selected` is reserved by `Button.Root`'s own group-selection semantics
  outside `Button.Group`; use `data-active` for caller-driven selected/pressed
  indicators.
