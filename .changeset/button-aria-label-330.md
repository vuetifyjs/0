---
"@vuetify/v0": patch
---

fix(Button): don't auto-set aria-label in renderless mode — in renderless mode the consumer owns the DOM and is responsible for the accessible name; the automatic icon-only fallback no longer overrides visible text in mixed-content renderless usages

Also migrates the solo icon-only fallback to `locale.ti('Button.label') ?? 'Button'`, matching the inline accessible-name default every other component now ships, so an unconfigured app gets `"Button"` instead of the raw `Button.label` key.
