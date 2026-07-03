---
"@paper/genesis": minor
---

feat(GnDocsExample): replace the "Show code" / "Hide code" text label on the code toggle bar with a rotating chevron indicator. The chevron is a new `toggle-icon` scoped slot (receives `expanded`) with an inline-SVG fallback matching the GnPeek idiom (chevron-down, rotates 180° when expanded). The button keeps its accessible name via a dynamic `aria-label` ("Show code" / "Hide code"), and the filename/language/file-count meta on the right is unchanged.
