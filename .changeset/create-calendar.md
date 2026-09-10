---
"@vuetify/v0": minor
---

feat(createCalendar): month calendar geometry and navigation (#980)

Headless composable for month calendars. Provides navigable month matrix with focus management, min/max bounds, and locale-aware week start. Selection-agnostic — compose with `createSingle` or `createSelection` for date pickers.

- `anchor` / `focused` state with mutual correction (paging snaps focus in-month, walking focus pages the anchor)
- Navigation methods: `next`, `prev`, `step`, `first`, `last`, `goto`, `today`
- Focus traversal: `move(unit, amount)` for day/week/month/year walks
- `CalendarCell` with `iso`, `day`, `disabled`, `today`, `outside` flags
- Works with plain `Date` by default; integrates with `createDatePlugin` when installed
- Midnight tick via `useTimer` keeps `today` flag current on pages left open
