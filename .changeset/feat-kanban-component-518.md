---
"@vuetify/v0": minor
---

feat(Kanban): add Kanban compound component over createKanban (#1012)

Adds `Kanban.Root`, `Kanban.Column`, `Kanban.List`, `Kanban.Item`,
`Kanban.Instructions`, and `Kanban.LiveRegion` for boards of movable items in
columns. Each Column binds its item array with `v-model`; a drop writes the new
order back and Root emits `move` once with `{ value, from, to, fromIndex, toIndex }`.
Items move by pointer drag or by keyboard: Space / Enter picks up, arrow keys
and Home / End move a previewed drop target (RTL-aware, skipping columns that
are disabled or whose `accept` refuses the item), Space / Enter drops, and
Escape cancels without touching the board. The pending target is exposed as
`data-target` on the column and list and `data-drop="before" | "after"` on the
neighbouring item; every step is announced through the live region. Columns
gate incoming moves with `accept(value, from, index)` and freeze with
`disabled`.
