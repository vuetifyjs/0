---
"@vuetify/v0": patch
---

fix: bring component ARIA/data attributes into PHILOSOPHY §3.6 compliance — `ExpansionPanel` content now emits `data-selected` as `true | undefined` (it was a raw boolean, so `[data-selected]` matched even when unselected), and `Slider` thumb / `Rating` root now emit `aria-disabled` as a concrete boolean (it was `true | undefined`, which dropped the attribute when not disabled).
