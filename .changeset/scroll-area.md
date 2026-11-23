---
"@vuetify/v0": minor
---

feat(ScrollArea): add a scroll area with custom, styleable scrollbars

`ScrollArea` keeps native scrolling and swaps the browser's scrollbars for `ScrollArea.Scrollbar` and `ScrollArea.Thumb` parts that you style yourself. The `visibility` prop shows them on hover, while scrolling, on overflow, or always, and `delay` sets how long they stay after the pointer leaves or scrolling stops. Scrollbars expose `data-state` for enter and exit transitions, `ScrollArea.Corner` fills the gap where two scrollbars meet, and right-to-left layouts are supported.
