---
"@vuetify/v0": patch
"@vuetify/paper": patch
---

fix(security): apply prototype-pollution and CSS-injection guards flagged in the security review

- `useFeatures` adapters (LaunchDarkly / Flagsmith / PostHog) now skip `UNSAFE_KEYS` (`__proto__` / `constructor` / `prototype`) flag names when building the flags object, matching the guard already used by `mergeDeep`, `usePermissions`, and `createTokens`
- `useLocale` `restore()` validates the persisted value with a `typeof` guard before applying it instead of blind-casting `saved as ID`, completing the persist/restore sweep (`useTheme` and `useRtl` were already validated)
- `@vuetify/paper` `useTheme` sanitizes color keys and values before writing them into the injected `<style>` element, mirroring the v0 `ThemeAdapter` `SAFE_IDENT` / `UNSAFE_CSS` guards
- `V0Error` filters `UNSAFE_KEYS` when copying caller-supplied error details onto the instance
