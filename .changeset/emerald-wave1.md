---
"@paper/emerald": minor
---

feat(emerald): introduce Wave 1–4 design system surface

Twenty-eight component families composed on v0 primitives (or `Atom` shells where no primitive exists yet):

- **Wave 1** — `EmButton`, `EmTextField`, `EmCheckbox`, `EmSwitch`, `EmDialog`, `EmSelect`
- **Wave 2** — `EmAlert`, `EmCard`, `EmTag`, `EmAvatar`, `EmTabs`, `EmPagination`, `EmSlider`
- **Wave 3** — `EmRadio`, `EmProgress`, `EmSpinner`, `EmBadge`, `EmDivider`, `EmTextarea`, `EmTooltip`, `EmSnackbar`, `EmBreadcrumbs`, `EmExpansionPanel`, `EmStep`
- **Wave 4** — `EmPopover`, `EmList`, `EmKanban` (real drag-and-drop over `createKanban` + `useDragDrop`), `EmCalendar` (APG grid keyboard pattern, optional `DateAdapter` injection)

Compound components (`EmDialog`, `EmSelect`, `EmTabs`, `EmSnackbar`, `EmBreadcrumbs`, …) ship one `Em*` export per region so consumers build the tree with default slots.

Also included: Figma-sourced `--emerald-*` tokens (color scales, spacing, radius, stroke, icon, shadow, type, motion, control geometry), `--v0-*` aliases for kit interop, `createEmeraldPlugin()` for one-line install, and a prebaked `theme.css` for the zero-config CSS-only path.

A full `emerald-dark` theme ships alongside the light default — inverted-ladder color scales, ink `on-*` foregrounds, dark-tuned shadows — registered by the plugin and baked into `theme.css` under `[data-theme="emerald-dark"]`.
