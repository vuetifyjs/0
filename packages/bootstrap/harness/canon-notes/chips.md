# BChips

- Choice face (`input` false): one `span.chip` per item, no wrapper. `createSelection({ multiple: true })` owns selection. `.active` tracks that selection. `v-model` is the selected values. Each chip is `role="button"` and in the tab order. Enter and Space toggle it.
- Optional `img.chip-img`, `span.chip-icon` (pin person glyph), and `button.chip-dismiss`.
- Input face (`input` true): `div.chip-input` > `span.chip` per model entry + `input.form-ghost`. `v-model` is the chip list. Enter, `separator` (default comma), and blur commit. Chips are `tabindex="0"`. The dismiss button is `tabindex="-1"`. An empty Backspace or Delete selects the last chip. The same key on a selected chip removes it and emits `dismiss`. Arrow keys move between chips and the field. `.active` is that keyboard selection, not the model.
- `dismissible` defaults on for the input face and off for the choice face.
- `theme` adds `theme-{theme}` on the input root, or on each choice chip.
- Do not invent `createChips`. Do not use `createGroup`. Do not emit `data-bs-chips`.
