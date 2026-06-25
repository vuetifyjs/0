---
"@vuetify/v0": minor
---

feat(locale): add `ti()` so components carry inline English aria labels without bundling a locale (WCAG 4.1.2)

- `locale.ti(key, ...params)` ("translate if exists") returns the translation or `undefined` instead of echoing the key, enabling the `ti(key) ?? '<default>'` pattern at call sites
- Every v0 component now provides a built-in English aria label via `ti(...) ?? '<default>'`, so apps with no locale plugin get meaningful accessible names — with zero strings bundled into the runtime fallback
- `@vuetify/v0/locale/messages/en` is exposed as an optional export: the canonical English catalog, handy for seeding a translation or registering full English coverage (never imported by the runtime)
