---
"@vuetify/paper": minor
---

feat(paper): add `PaperIcon` component and `createIconPlugin` composable

- `PaperIcon` — renderless icon component that resolves alias names through a `createTokens`-backed registry; design systems decide rendering (class on `<span>`, inline SVG, etc.)
- `createIconPlugin({ close: 'i-mdi-close', ... })` — registers an icon set; call `provideIcons()` in the root component's `setup()`
- `useIconTokens()` — composable to access the icon token context directly
- Accessible by default: `aria-hidden="true"` on icon-only usage; set `label` prop to expose `role="img"` + `aria-label` instead
