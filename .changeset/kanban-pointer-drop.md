---
"@vuetify/v0": minor
---

feat(Kanban): mark the card a pointer drop is anchored to (#1136)

A pointer drag sets `data-target` on the column and list under the pointer, and `data-drop` on the card the drop line is anchored to. Keyboard moves keep the same attributes. The board context exposes `pointer` and `aim` for that hover.
