---
"@vuetify/v0": patch
---

fix(TimePicker): step a field from a button beside it

The hour, minute, second, and period slots expose `step`. Call `step(1)` or `step(-1)` from a button to move that field by one interval, the same distance as the arrow keys. On the period field any non-zero count flips AM and PM. A click on the field still only focuses it.
