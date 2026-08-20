---
"@vuetify/v0": minor
---

feat(Splitter): defer drag collapse/expand to pointer release with a pending intent — dragging a collapsible panel past its `minSize` no longer collapses instantly. While dragging, the panel now pins at its `minSize` (or `collapsedSize` when opening a collapsed panel) and arms a pending intent; the collapse/expand only commits on release, and dragging back out cancels it. `SplitterHandle` exposes the armed state through a `pending` slot prop (`'collapse' | 'expand' | null`) and a matching `data-pending` attribute so consumers can render a "release to hide/open" affordance. Keyboard and programmatic resize keep their existing instant behavior.
