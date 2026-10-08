---
"@vuetify/v0": patch
---

fix(createVirtual): reverse lists start at the bottom, and edge callbacks stop after unmount (#1026)

With `direction: 'reverse'`, the list now opens scrolled to its last item in the browser instead of at the top; it pins again when the scroll element is remounted. A scroll in flight when the list unmounts no longer calls `onStartReached` or `onEndReached`.
