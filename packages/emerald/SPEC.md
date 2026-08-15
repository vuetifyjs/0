# @paper/emerald — Design Spec

## Identity

**Class:** design system (rich). See [DESIGN_SYSTEMS.md](../../DESIGN_SYSTEMS.md).

Emerald is the **first commercial Paper design system** and the **showcase for v0**:
Figma-sourced tokens, a themed adapter that publishes `--emerald-*` (plus `--v0-*`
kit aliases), and Vue components that **compose v0 primitives** and style them with
unscoped class CSS.

### Purpose — Emerald exists to sell v0

v0 is the headless OS. Emerald is a thin commercial skin. If Emerald is hard to
adopt, people blame the stack; if it is two CSS files + a plugin + Em* that still
expose real a11y/forms/dialogs, people credit **v0**.

Every Em* API is judged by: **does this make v0 look simpler and more capable, or
does it hide and complicate it?**

| Promise | Emerald must show |
|---|---|
| **Easy** | Happy path only: CSS imports + `createEmeraldPlugin()` + Em* — no adapter assembly, no slot zoo, no Paper middle layer |
| **Feature-rich via v0** | Behavior, state, and a11y stay on v0 compounds; Emerald paints |
| **Composable** | Compounds for variable trees; shells for fixed controls — both default-slot / props only |
| **Interoperable** | Kit `--v0-*` aliases so Genesis chrome inherits brand without dual themes |
| **Readable source** | `design-system.ts` token dictionary; plugin is the only install story |

**Anti-patterns:** Vuetify-shaped named slots; reimplementing behavior inside Em*;
install steps that require understanding theme adapters; `@vuetify/paper` / `V0Paper`
as a required layer.

## Token source

Canonical Figma: **[Emerald 1.0](https://www.figma.com/design/WaY9z9gHeU6LbkqNgcD9io/Emerald-1.0)** — file key `WaY9z9gHeU6LbkqNgcD9io`.
(The “Copy” file `mRyzZtj2AmJCKhnj06MXj9` is reference-only; do not ship against it.)

Token dictionary: `src/design-system.ts` (color scales, spacing, type, motion, control geometry — not “theme” alone).
Flat color maps for v0’s theme engine: `src/colors.ts` (`emeraldColors` + `emeraldDarkColors`). Adapter is **package machinery**, not a consumer install step.

### Dark theme

`createEmeraldPlugin` registers two themes: `emerald` (default) and `emerald-dark`
(`dark: true`). The dark map is derived, not Figma-paged: each family inverts the
light family’s lightness ladder with re-tuned chroma (100 = deepest tint, 600/1000 =
brightest), `on-*` flips to ink-on-color (white fails AA on the brighter dark
DEFAULTs), surfaces anchor on `background.dark` / `surface.dark`, and shadows swap
to `shadowDark` (light rim ring + ~3x umbra alpha — the light elevations are
invisible on dark surfaces). Key parity with the light map is compile-enforced via
`satisfies` in `colors.ts` and re-asserted at bake time. Baked `theme.css` scopes
dark under `[data-theme="emerald-dark"]` only (light stays the `:root` default), so
the CSS-only path opts in per subtree with the attribute.

## Pipeline

| Path | How |
|---|---|
| **Happy path** | `import '@paper/emerald/theme.css'` + `import '@paper/emerald/style.css'` + `app.use(createEmeraldPlugin())` |
| **CSS-only** | Prebaked `theme.css` (no plugin) when you only need static tokens + no runtime switch |
| **Host already has `createThemePlugin`** | `{ theme: false }` and register `EmeraldStyleSheetAdapter` + `emeraldColors` on that host plugin |
| **Kit interop** | Adapter (via plugin) emits `--v0-*` aliases for Genesis chrome |

## Consumer contract

Rules for every Em* component and for package-level API. Non-negotiable for
showcase quality.

- **Behavioral** UI composes v0 compounds (`Button.Root`, `Checkbox.Root`, `Dialog.Root`, …).
- **Never** `@vuetify/paper` / `V0Paper`.
- **Never** `<style scoped>` (multi-root primitives drop `data-v`).
- **Never named slots** on Em* — structure is compounds or props + a single default slot (no Vuetify-style `#label` / `#prepend` surface).
- Class prefix: `emerald-*`. State: `data-*` attributes.
- Every `var(--emerald-*)` carries a literal fallback.
- **Shells** (Checkbox, Switch, Button, TextField, Slider): fixed anatomy in one SFC; props for simple text (e.g. `label`, `description`).
- **Compounds** (Dialog, Select, Tabs, Pagination, Avatar, Card, Alert): one Em* per region; consumer builds the tree with default slots only.
- **Install:** consumers use `createEmeraldPlugin` + CSS; they do not construct the stylesheet adapter unless they already own a theme plugin.

## Wave 1 surface (preview)

| Component | v0 primitive |
|---|---|
| `EmButton` | `Button.Root` + `Content` + `Loading` |
| `EmTextField` | `Input.Root` + `Control` + `Description` + `Error` |
| `EmCheckbox` | `Checkbox.Root` + `Indicator` |
| `EmSwitch` | `Switch.Root` + `Track` + `Thumb` |
| `EmDialog` (+ Activator/Content/Title/Description/Close/Footer) | `Dialog.*` |
| `EmSelect` (+ Activator/Content/Item/Value/Placeholder) | `Select.*` |

## Wave 2 surface (preview)

| Component | v0 / shell |
|---|---|
| `EmAlert` (+ Title/Description) | `Atom` + live region — `role="status"`, `alert` for the error variant, `role` prop overrides (no v0 Alert) |
| `EmCard` (+ Header/Title/Subtitle/Body/Footer) | `Atom` presentational |
| `EmTag` | `Atom` presentational / button |
| `EmAvatar` (+ Image/Fallback) | `Avatar.*` |
| `EmTabs` (+ List/Item/Panel) | `Tabs.*` |
| `EmPagination` (+ Item/Prev/Next) | `Pagination.*` |
| `EmSlider` | `Slider.Root` + `Track` + `Range` + `Thumb` |

## Wave 3 surface (preview)

| Component | v0 / shell |
|---|---|
| `EmRadio` + `EmRadioGroup` | `Radio.Root` + `Indicator` / `Radio.Group` |
| `EmProgress` | `Progress.Root` + `Track` + `Fill` (+ Label/Value) |
| `EmSpinner` | `Atom` presentational |
| `EmBadge` | `Atom` presentational |
| `EmDivider` | `Atom` presentational |
| `EmTextarea` | `Input.Root` + `Control as="textarea"` |
| `EmTooltip` (+ Activator/Content) | `Tooltip.*` |
| `EmSnackbar` (+ Portal/Queue/Content/Close) | `Snackbar.*` (queueing via `Snackbar.Queue`) |
| `EmBreadcrumbs` (+ List/Item/Link/Page/Divider/Ellipsis) | `Breadcrumbs.*` |
| `EmExpansionPanel` (+ Group/Header/Activator/Cue/Content) | `ExpansionPanel.*` |
| `EmStep` (+ Item) | `Step.*` |

## Wave 4 surface (preview) — graduated from showcase patterns

| Component | v0 / shell |
|---|---|
| `EmPopover` (+ Activator/Content) | `Popover.*` (Content injects the root id via `usePopoverContext` so position props are honored) |
| `EmList` (+ Item/Media/Content/Title/Subtitle/Meta) | `Single.Root` + `Single.Item` — ul/li/button anatomy, `aria-current` selection (no `role=option` outside a real listbox) |
| `EmKanban` (+ Column/Card) | `createKanban` + `useDragDrop` internalized — per-card real refs, drop indicator, keyboard drag + `role=status` announcer |
| `EmCalendar` (+ Header/Title/Prev/Next/Today/Grid/Mini) | own context; APG grid keyboard pattern; v0 `DateAdapter` slots in via optional injection, plain `Date` otherwise |

Foundations also export `motion` and `control` (switch/checkbox/avatar geometry) as CSS vars,
and an **icon set** — `src/icons/glyphs.ts` maps role names to 24x24 stroke-grid path data
(a leaf module with no imports), registered by `createEmeraldIconsPlugin` in
`src/icons/index.ts` through v0's `createPluginContext` + `createTokens`.
`createEmeraldPlugin` composes it, so consumers override roles and add aliases via either
`createEmeraldPlugin({ icons })` or the icons plugin directly; `useEmIcons` falls back to
the built-in set when neither is installed. `EmIcon` renders against the
`--emerald-icon-*` scale, and every Em* glyph draws through it, so one override restyles
the system's chrome. See [DESIGN_SYSTEMS.md](../../DESIGN_SYSTEMS.md) "Icons".

Maturity: **preview**. Not published (`private: true` until first release cut).

Dev showcase routes (Figma product examples; inventory in [FIGMA_INVENTORY.md](./FIGMA_INVENTORY.md)):
- Product: `/emerald` · `/contact` · `/sign-in` · `/faqs` · `/features` · `/settings` · `/pricing` · `/modals` · `/about` (all under `/emerald/…`)
- `/emerald/sink` component inventory

## Non-goals (current)

- DatePicker / Upload / DataTable / Charts / Calendar (no finished v0 primitive or deferred)
- Pixel-perfect Figma component-set parity for every variant (library pages limited via MCP seat; tokens + Wave 1–3 shells ship first)

## Reference

The prior Emerald tree under `.claude/worktrees/emerald-*` is a **visual/token reference
only** — do not merge it. Waves rebuild under this contract.
