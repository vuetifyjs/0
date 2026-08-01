# @paper/onyx — Design Spec

## Identity

**Class:** design system (rich). See [DESIGN_SYSTEMS.md](../../DESIGN_SYSTEMS.md).

Onyx recreates the *principles* of the 2020 Onyx Design System
(johnleider/onyx — Vuetify 2, built for Medecision's Aerial platform) as a
modern `@paper/*` design system on `@vuetify/v0`, with a **shadcn-centric visual
language** instead of Material: neutral-first palette, paired semantic tokens, 1px
borders over elevation, small radii from a single knob, `:focus-visible` rings,
compact type. Nothing Material survives — no ripples, no floating labels, no
elevation ramp, no ALL-CAPS buttons.

Component prefix: `On` (`OnButton`). CSS namespace: `onyx-*` classes,
`--onyx-*` custom properties. `private: true`, `version: 0.0.0` until the
first release cut.

## Token source

No Figma file. Tokens are **authored directly in `src/theme.ts`** — a single
neutral scale (`neutral-50…950`), one brand hue (`brand-*`, graphite), one
destructive hue (`red-*`), plus three severity singles (`warning`/`success`/`info`)
consumed directly by `OnAlert`/`OnToast` for severity styling and also feeding
the kit-interop alias map below. Semantic pairs
(`background`/`foreground`, `card`/`card-foreground`, `primary`/`primary-foreground`,
…) live in `light: Semantic` / `dark: Semantic` maps. Flat color map for the
adapter: `src/colors.ts`. Foundations (`radius`, `spacing`, `stroke`, `shadow`,
`fontFamily`, `fontSize`, `motion`, `control`) are non-color `as const` objects in
the same file.

**Onyx is dark by default.** Two registered themes: `onyx` (the `dark: Semantic`
map — Dark, default) and `onyx-light` (the `light: Semantic` map — Light,
variant), both emitted by the adapter and both prebaked. `theme.ts` keeps the
`light`/`dark` value-map names as-is (they describe the palette, not which one
ships as default); the *wiring* in `colors.ts` is what flips —
`themes.onyx` points at `palette(dark)` with `dark: true`, `themes['onyx-light']`
points at `palette(light)`. `createOnyxPlugin()`'s `default: 'onyx'` and
`bake-theme.ts`'s `:root` block both resolve to the dark palette; `:root` also
carries `color-scheme: dark`.

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
- Original: `github.com/johnleider/onyx`; captures in
  `.playwright-mcp/onyx/`.
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
