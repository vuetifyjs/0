---
"@vuetify/v0": minor
---

feat(utilities): add `getActiveElement()` and use it for shadow-DOM-aware focus checks

New `getActiveElement()` utility resolves the deepest focused element by walking open shadow roots — `document.activeElement` returns the shadow *host* when focus is inside a custom element, which silently breaks focus logic. `useHotkey` (typing guard), `useClickOutside` (iframe-outside check), and `useDragDrop`'s keyboard adapter now use it, so their focus checks stay correct when v0 runs inside a web component / shadow root. Returns the same value as `document.activeElement` in light DOM; open shadow roots only (closed roots can't be traversed).
