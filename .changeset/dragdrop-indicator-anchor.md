---
'@vuetify/v0': patch
---

fix(useDragDrop): anchor the drop indicator to the slot, not the pointer's approach

An interior drop slot now always renders against the end edge of the rect above it. Previously the same slot anchored to the rect above or the rect below depending on which side the pointer approached from, so the indicator visibly jumped across the gap mid-drag — dragging a card down a column drew the line at the top of the next card instead of walking edge to edge.
