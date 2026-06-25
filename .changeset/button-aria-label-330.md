---
"@vuetify/v0": patch
---

fix(Button): don't auto-set aria-label in renderless mode — in renderless mode the consumer owns the DOM and is responsible for the accessible name; the automatic icon-only fallback no longer overrides visible text in mixed-content renderless usages
