---
"@vuetify/v0": minor
---

feat(locale): add English message file and `onMissing` hook so unconfigured consumers get meaningful ARIA labels instead of raw key strings (WCAG 4.1.2)

- `packages/0/src/locale/messages/en` is now a public export
- `createLocale()` accepts `onMissing` for key-level fallback
- `createLocaleFallback()` now resolves keys through the built-in English strings
