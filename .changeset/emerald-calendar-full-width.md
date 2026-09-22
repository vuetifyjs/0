---
"@paper/emerald": patch
---

fix(EmCalendar): fill the parent width instead of shrinking to the header

A calendar in a full-width column used to size itself to the month label, so the grid sat as a skinny card on mobile. The root is now `width: 100%`.
