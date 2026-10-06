---
"@vuetify/v0": minor
---

feat(Kanban): add Kanban compound component over createKanban (#518)

Adds `Kanban.Root`, `Kanban.Column`, `Kanban.List`, `Kanban.Item`,
`Kanban.Instructions`, and `Kanban.LiveRegion` for boards of movable items in
columns. Each Column binds its item array with `v-model`; moves write the new
order back and Root emits `move` with `{ value, from, to, fromIndex, toIndex }`.
Items move by pointer drag or by keyboard — Space / Enter picks up, arrow keys
move one slot or one column (RTL-aware), Home / End jump within the column,
Escape returns the item to where it was picked up — with focus following the
item and every move announced through the live region. Columns gate incoming
moves with `accept(value, from, index)` and freeze with `disabled`.
