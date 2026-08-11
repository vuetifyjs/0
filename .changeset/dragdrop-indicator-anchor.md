---
'@vuetify/v0': patch
---

fix(useDragDrop): anchor the drop indicator to the slot and suppress no-op slots

An interior drop slot now always renders against the end edge of the rect above it. Previously the same slot anchored to the rect above or the rect below depending on which side the pointer approached from, so the indicator visibly jumped across the gap mid-drag — dragging a card down a column drew the line at the top of the next card instead of walking edge to edge.

A drag over its own zone also no longer proposes the two slots flanking the dragged element's current position: dropping in either puts it straight back where it sits, so the indicator stays hidden there — grabbing the first card and nudging the pointer above it no longer draws a line over its own head — and a drop on a suppressed slot resolves `position.index` to the element's current slot instead of `0`.
