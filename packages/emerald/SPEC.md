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
Flat color map for v0’s theme engine: `src/colors.ts`. Adapter is **package machinery**, not a consumer install step.

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
| `EmAlert` (+ Title/Description) | `Atom` + `role="alert"` (no v0 Alert) |
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
| `EmSnackbar` (+ Portal/Queue/Content/Close) | `Snackbar.*` (+ `useNotifications` for queues) |
| `EmBreadcrumbs` (+ List/Item/Link/Page/Divider/Ellipsis) | `Breadcrumbs.*` |
| `EmExpansionPanel` (+ Group/Header/Activator/Cue/Content) | `ExpansionPanel.*` |
| `EmStep` (+ Item) | `Step.*` |

Foundations also export `motion` and `control` (switch/checkbox/avatar geometry) as CSS vars.

Maturity: **preview**. Not published (`private: true` until first release cut).

Dev showcase routes (Figma product examples; inventory in [FIGMA_INVENTORY.md](./FIGMA_INVENTORY.md)):
- `/emerald` Dashboard · `/emerald/contact` · `/emerald/sign-in` · `/emerald/faqs` · `/emerald/features`
- `/emerald/sink` component inventory

## Non-goals (current)

- Dark theme registration (tokens reserve dark surfaces; not wired)
- DatePicker / Upload / DataTable / Charts / Calendar (no finished v0 primitive or deferred)
- Pixel-perfect Figma component-set parity for every variant (library pages limited via MCP seat; tokens + Wave 1–3 shells ship first)

## Reference

The prior Emerald tree under `.claude/worktrees/emerald-*` is a **visual/token reference
only** — do not merge it. Waves rebuild under this contract.
