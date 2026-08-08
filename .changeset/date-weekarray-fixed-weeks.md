---
'@vuetify/v0': patch
---

fix(useDate): add a fixedWeeks mode to getWeekArray

`getWeekArray(date, fixedWeeks?)` can now pad the month matrix to a constant 6 rows (42 cells), so calendar grids keep a stable height across months instead of jumping between 4, 5, and 6 rows. Padding continues day-by-day into the next month; months that naturally span 6 rows are unchanged. Default behavior without the flag is identical to before.
