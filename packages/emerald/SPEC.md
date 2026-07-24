# @paper/emerald — Design Spec

## Identity

**Class:** design system (rich). See [DESIGN_SYSTEMS.md](../../DESIGN_SYSTEMS.md).

Emerald is the first commercial Paper design system: Figma-sourced tokens, a themed
adapter that publishes `--emerald-*` (plus `--v0-*` kit aliases), and Vue components that
**compose v0 primitives** and style them with unscoped class CSS.

## Token source

Canonical Figma: **Emerald 1.0 Copy** — file key `mRyzZtj2AmJCKhnj06MXj9`.

Token values live in `src/theme.ts`. Flat color map for the adapter: `src/colors.ts`.

## Pipeline

| Path | How |
|---|---|
| **Zero-config** | `import '@paper/emerald/theme.css'` — prebaked by `pnpm bake:theme` |
| **Full** | `app.use(createEmeraldPlugin())` — runtime `EmeraldStyleSheetAdapter` |
| **Kit interop** | Adapter emits `--v0-*` aliases for Genesis chrome (DESIGN_SYSTEMS *Kit interop*) |

## Composition rules

- **Behavioral** UI composes v0 compounds (`Button.Root`, `Checkbox.Root`, `Dialog.Root`, …).
- **Never** `@vuetify/paper` / `V0Paper`.
- **Never** `<style scoped>` (multi-root primitives drop `data-v`).
- Class prefix: `emerald-*`. State: `data-*` attributes.
- Every `var(--emerald-*)` carries a literal fallback.

## Wave 1 surface (preview)

| Component | v0 primitive |
|---|---|
| `EmButton` | `Button.Root` + `Content` + `Loading` |
| `EmTextField` | `Input.Root` + `Control` + `Description` + `Error` |
| `EmCheckbox` | `Checkbox.Root` + `Indicator` |
| `EmSwitch` | `Switch.Root` + `Track` + `Thumb` |
| `EmDialog` (+ Activator/Content/Title/Description/Close) | `Dialog.*` |
| `EmSelect` (+ Activator/Content/Item/Value/Placeholder) | `Select.*` |

Maturity: **preview**. Not published (`private: true` until first release cut).

## Non-goals (Wave 1)

- Dark theme registration (tokens reserve dark surfaces; not wired)
- DatePicker / Toast / Upload / DataTable (no finished v0 primitive or deferred)
- Full 35-component inventory from the prior reference branch
- Docs app / kitchen sink (follow-up)

## Reference

The prior Emerald tree under `.claude/worktrees/emerald-*` is a **visual/token reference
only** — do not merge it. Wave 1 rebuilds under this contract.
