# Emerald Admin — Gap Inventory

The AdminCN recreation ran under a gap contract: any feature Emerald + v0
cannot express today renders as `<AdminPlaceholder>` and gets a row here.
Every candidate was checked against the real v0 inventory (`vuetify0` skill)
before being called a gap.

**Build outcome: all 18 pages shipped with ZERO placeholders.** Every widget
mapped to a real Emerald component, a real v0 composable, or the static
CSS/SVG charting-likeness convention established in `AdminSales.vue`. The
`AdminPlaceholder.vue` panel component ended up unused and was removed
(repo:check forbids dead files) — recover it from git history if a future
page hits a real gap: dashed border, Emerald tokens, `label` + `gap` props
rendering "Placeholder — <label> · <gap>".

## Real gaps

| Gap | Needed by (pages) | Layer | Notes |
|---|---|---|---|
| Charting (bar / line / area / donut, interactive) | all 9 dashboards | Both | No `createChart` in v0, no `EmChart`. Static likeness shipped as CSS flex bars, SVG polylines, and `conic-gradient` rings with real data labels. Anything interactive (tooltips, zoom, legend toggle) needs a real primitive. |
| Calendar / date-grid | Calendar | Both | `useDate` exists but is a required plugin not wired in dev, and DatePicker/DateRangePicker are planned-not-exported. `AdminCalendar.vue` hand-rolls the month grid with plain `Date` math; swap to `useDate().adapter` once a date plugin is installed app-wide. |
| Command palette (⌘K) | topbar, all pages | Both | The pieces exist (`Combobox`, `useHotkey`) but no assembled compound. Topbar search is an `EmTextField` with a ⌘K hint only — no binding wired, rather than faked. |
| Notification popover panel | topbar, all pages | Emerald | `usePopover` + `createQueue` cover it at the v0 layer; Emerald has no `EmPopover`/panel component. The bell button is inert. |
| Circular progress variant | Sales, Logistics, Campaign, Payments, Orders | Emerald | `EmProgress` is linear-only; rings are hand-rolled `conic-gradient`. Candidate: `variant="circular"`. |
| List / message-row / bubble primitives | Mail, Chat, Contact | Emerald | Data layer fully covered by `createSingle`/`createFilter`/`createSelection`; the pane compositions are hand-built per page. Candidates: `EmList`, message-bubble/composer components. |
| Styled kanban compound | Kanban | Emerald | **Not a v0 gap** (earlier draft of this file was wrong): `createKanban` + `useDragDrop` deliver real cross-column and in-column drag-and-drop, proven in `AdminKanban.vue`. The gap is only a styled `EmKanban` compound over them. |
| Drag drop-position indicator line | Kanban | v0 (integration nuance) | `useDragDrop`'s `zone.indicator` supports an exact insertion line but needs the dragged card's own rect excluded from the zone's measured rects. Shipped fade + column-highlight feedback instead; reorder/transfer both work. |
| `EmButton` cannot submit a form | Forms, any page with a real `<form>` | Emerald — real bug | `ButtonRoot.vue` hardcodes `type="button"` and its attrs win the `mergeProps` merge, so `<EmButton type="submit">` renders `type="button"` and never triggers native submission (`EmButtonProps` has no `type` prop at all). Workaround used: bind v0 `Form`'s slot `submit`/`reset` to `@click`. Upstream fix: expose `type` through `EmButton`. |
| Form controls beyond text don't register with `createForm` | Forms | Emerald | Only `EmTextField`/`EmTextarea` (over `Input.Root`) carry `rules`/`validateOn` and join a `Form`'s aggregate validity. `EmSelect`/`EmCheckbox`/`EmRadio`/`EmSwitch` hold state but sit outside `isValid`. `createValidation` already supports arbitrary value types — the threading is an Emerald-layer change. |
| `EmCheckbox` `label` prop is aria-only | any page with visible checkbox labels | Emerald (docs/API) | Visible text requires the default slot; the `label` prop names the control for AT only. Footgun — either document loudly or render it visibly. |

## Confirmed no-gap (checked, real primitive exists and is used)

- **Kanban drag-and-drop** — `createKanban` + `useDragDrop` (real in `AdminKanban.vue`).
- **Data table sort / filter / pagination / selection** — `createDataTable` pipeline (real in `AdminDatatable.vue`: click-sort, live search, page size, tri-state select-all).
- **Form validation** — `Form` + `Input.Root` rules, four `validate-on` modes (real in `AdminForms.vue`).
- **Search/filtering everywhere** — `createFilter` (Mail, Chat, Contact, FAQ, Datatable).
- **Exclusive nav state** — `createSingle` (folders, tabs, conversations, categories, calendar day).
- **Tri-state group selection** — `createGroup` `isAllSelected`/`isMixed`/`toggleAll` (Calendar event filters).
- **Accordion** — `EmExpansionPanel` (FAQ).
- **Interactive rating** — `createRating` exists in v0 (Logistics uses static display stars by choice — AdminCN's are non-interactive).
- **Avatar photos** — `EmAvatar`/`Avatar` support images; initials used as a data choice, not a gap.

## Layer legend

- **v0** — missing primitive in `@vuetify/v0`.
- **Emerald** — v0 primitive exists; Emerald lacks the styled component (or has the bug).
- **Both** — gaps at both layers.
