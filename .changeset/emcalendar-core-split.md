---
'@paper/emerald': minor
---

fix(EmCalendar): correct selection, focus, and announcement behavior; add Title `live` and component `as` support

The calendar no longer silently selects today on mount without updating your model, and clearing the model now clears the selected paint. The today indicator rolls over at midnight instead of going stale. Keyboard support gains Shift+PageUp/PageDown (±1 year) and RTL-aware arrow navigation; month changes are announced to screen readers via the title's new `live` prop (default on — set `:live="false"` on a second title over the same calendar), and the initial tab stop lands on the selected day when one is visible. `EmCalendarTitle`'s `as` now accepts components as well as tag names. Internally the calendar is rebuilt on a selection-free geometry core slated for graduation to `@vuetify/v0`.
