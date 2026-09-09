# Emerald Dashboard — Gap Inventory

This reference-dashboard recreation ran under a gap contract: any feature Emerald + v0
cannot express today renders as a clearly-marked placeholder panel and gets a row here.
Every candidate was checked against the real v0 inventory (`vuetify0` skill)
before being called a gap.

**Build outcome: all 18 pages shipped with ZERO placeholders.** Every widget
mapped to a real Emerald component, a real v0 composable, or the static
CSS/SVG charting-likeness convention established in `EmeraldSales.vue`. The
placeholder panel component ended up unused and was removed
(repo:check forbids dead files) — recover it from git history if a future
page hits a real gap: dashed border, Emerald tokens, `label` + `gap` props
rendering "Placeholder — <label> · <gap>".

## Real gaps

| Gap | Needed by (pages) | Layer | Notes |
|---|---|---|---|
| Charting (bar / line / area / donut, interactive) | all 9 dashboards | Both | No `createChart` in v0, no `EmChart`. Static likeness shipped as CSS flex bars, SVG polylines, and `conic-gradient` rings with real data labels. Anything interactive (tooltips, zoom, legend toggle) needs a real primitive. |
| Calendar / date-grid | Calendar | v0 (narrowed) | CLOSED at the Emerald layer: `EmCalendar` ships an APG-grid month view with a module-private date engine; v0's `DateAdapter` slots in via optional injection when a date plugin exists. Remaining v0 gap: `createCalendar`/date-grid primitive + a non-throwing plain-Date default adapter (see the graduation spec's roadmap inputs). |
| Command palette (⌘K) | topbar, all pages | Both | The pieces exist (`Combobox`, `useHotkey`) but no assembled compound. Topbar search is an `EmTextField` with a ⌘K hint only — no binding wired, rather than faked. |
| Notification popover panel | topbar, all pages | Emerald (narrowed) | `EmPopover` now ships (the theme customizer proves it); the bell button remains inert pending a notification-panel composition — small follow-up, no primitive missing. |
| Circular progress variant | Sales, Logistics, Campaign, Payments, Orders | Emerald | `EmProgress` is linear-only; rings are hand-rolled `conic-gradient`. Candidate: `variant="circular"`. |
| List / message-row / bubble primitives | Mail, Chat, Contact | Emerald (narrowed) | `EmList` (+ Item/Media/Content/Title/Subtitle/Meta) shipped and consumed by Mail/Chat/Contacts. Remaining: chat message bubbles (future `EmThread` family) and the standalone Listbox upgrade path for real `role=listbox` semantics. |
| Styled kanban compound | Kanban | CLOSED | `EmKanban`/`EmKanbanColumn`/`EmKanbanCard` shipped — createKanban + useDragDrop fully internalized (real per-card refs, drop indicator, keyboard drag with announcer). |
| Drop-position indicator has no component | Kanban (any drag surface) | CLOSED (scoped) | The indicator now lives inside `EmKanban`. A standalone `EmDropIndicator` waits for a second drag surface, per the graduation spec's rejection rationale. |
| `EmButton` cannot submit a form | Forms, any page with a real `<form>` | Emerald — real bug | `ButtonRoot.vue` hardcodes `type="button"` and its attrs win the `mergeProps` merge, so `<EmButton type="submit">` renders `type="button"` and never triggers native submission (`EmButtonProps` has no `type` prop at all). Workaround used: bind v0 `Form`'s slot `submit`/`reset` to `@click`. Upstream fix: expose `type` through `EmButton`. |
| Form controls beyond text don't register with `createForm` | Forms | Emerald | Only `EmTextField`/`EmTextarea` (over `Input.Root`) carry `rules`/`validateOn` and join a `Form`'s aggregate validity. `EmSelect`/`EmCheckbox`/`EmRadio`/`EmSwitch` hold state but sit outside `isValid`. `createValidation` already supports arbitrary value types — the threading is an Emerald-layer change. |
| `EmCheckbox` `label` prop is aria-only | any page with visible checkbox labels | Emerald (docs/API) | Visible text requires the default slot; the `label` prop names the control for AT only. Footgun — either document loudly or render it visibly. |

## Added by the polish pass (three-way review + interactive verification of all 18 pages)

| Gap | Needed by (pages) | Layer | Notes |
|---|---|---|---|
| `createForm.reset()` never resets field values | Forms — any Form-slot Reset button | v0 | It iterates ValidationContexts and calls `validation.reset()` (validation state only); `createInput.reset()` (restores `initialValue`) is unreachable from the form, so Reset looks broken everywhere. Worked around with page-level handlers that clear models, `await nextTick()`, then `reset()`. |
| `validateOn="input lazy"` is silently inert | Forms | v0 (semantics/docs) | `lazy` gates on `isTouched`, which flips only on blur — so "validate every keystroke, lazily" shows nothing until after a blur. Easy to reach for; yields a form with no visible validation. |
| `EmCard variant="simple"` has no usable padding | nearly every page | Emerald | Root ships `padding: 2px` and Header/Body/Footer add none, so content sits on the border; every page re-adds ~20px by hand. Give `simple` a real inset or pad the slots. |
| `.emerald-card__header` hardcodes `flex-direction: column` | every horizontal card toolbar | Emerald | Page rules with equal specificity silently lose; 11 header rules across 8 dashboards needed explicit `flex-direction: row`. Consider not fixing direction in the component. |
| `--emerald-warning-*` ramp does not exist | Logistics, Productivity, Campaign, Analytics | Emerald (tokens) | Pages used `var(--emerald-warning-500, #f5a623)` and silently fell back to a non-Emerald orange — the only undefined token found in a full sweep of used `--emerald-*` vars. Either add a warning ramp or document `alert`/`danger` as the sanctioned severities. |
| `EmPagination` `size` semantics | Sales, Finance, Productivity, Payments, eCommerce, Datatable | Emerald (docs/API) | `size` = total item count, not page count; `:size="5"` with default 10-per-page yields one page and disables Next silently. Bit two independent builders. |
| No `EmPaginationEllipsis` | any slot-driven pagination | Emerald | v0 ships `Pagination.Ellipsis` and the Root slot emits `{ type: 'ellipsis' }` tickets; Emerald has no styled counterpart — pages render a bare `<span>`. |
| `EmSelectValue` renders the raw value and has no placeholder | every page with a select | Emerald (docs/API) | Default slot is `{{ selectedValue }}`, so selects display raw slugs (`paid`, `phone`) unless consumers map value→label by hand; a `placeholder` prop consumers keep reaching for doesn't exist (falls through as an inert attr). Resolve the selected item's label by default and add `placeholder`. |
| `EmTag` caps at 4 tones | Contacts (6-color label legend) | Emerald | neutral/success/danger/info can't express a 6-color legend; worked around by nesting a color dot in a neutral tag. Candidate: `tone`/`color` prop. |
| No low-emphasis tab variant | Chat, Mail filter rows | Emerald | `EmTabs` is a filled segmented control; underline/pill filter tabs get hand-rolled `<button role="tab">` instead. |
| No responsive master/detail pattern | Mail, Chat (and any list-detail page) | Emerald (pattern) | Both pages hand-roll the same `detail` ref + `data-detail` CSS to push a pane on mobile; a shared pattern (or `EmSplitView`) would remove the duplication. |
| Page-rule specificity vs component classes | showcase convention | none (convention) | Rules like `.adm-x .emerald-card` (0,2,0) silently beat page modifier classes (0,1,0) — killed two intended styles on Pricing. Convention: scope page overrides at matching specificity. |
| `EmSwitch` label wrapper can double-fire | shell dark toggle, any switch | Emerald | The `role="switch"` button sits inside a `<label>`; a label click can fire twice and cancel itself. Surfaced as a flaky toggle during the dark sweep. Restructure so the label targets rather than wraps, or absorb the duplicate activation. |
| Popover.* lacks `namespace` | EmPopover | v0 | Select/Tooltip take a namespace; Popover is static-key only. |

## Confirmed no-gap (checked, real primitive exists and is used)

- **Kanban drag-and-drop** — `createKanban` + `useDragDrop` (real in `EmeraldKanban.vue`).
- **Data table sort / filter / pagination / selection** — `createDataTable` pipeline (real in `EmeraldDatatable.vue`: click-sort, live search, page size, tri-state select-all).
- **Form validation** — `Form` + `Input.Root` rules, four `validate-on` modes (real in `EmeraldForms.vue`).
- **Search/filtering everywhere** — `createFilter` (Mail, Chat, Contact, FAQ, Datatable).
- **Exclusive nav state** — `createSingle` (folders, tabs, conversations, categories, calendar day).
- **Tri-state group selection** — `createGroup` `isAllSelected`/`isMixed`/`toggleAll` (Calendar event filters).
- **Accordion** — `EmExpansionPanel` (FAQ).
- **Interactive rating** — `createRating` exists in v0 (Logistics uses static display stars by choice — the reference design's are non-interactive).
- **Avatar photos** — `EmAvatar`/`Avatar` support images; initials used as a data choice, not a gap.

## Layer legend

- **v0** — missing primitive in `@vuetify/v0`.
- **Emerald** — v0 primitive exists; Emerald lacks the styled component (or has the bug).
- **Both** — gaps at both layers.
