---
"@vuetify/v0": minor
---

feat(Pagination): fit uneven buttons to the container and grow when it widens

Page buttons can have different widths. The row shrinks when the rendered buttons overflow and grows back when the container widens or the current page is shorter. `createOverflow` accepts `probe: true` when the count that fits is not mounted yet. Render `capacity`, measure that row, and call `settle()`.
