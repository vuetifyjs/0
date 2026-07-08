---
"@vuetify/v0": patch
---

Fix SSR singleton leak in `useStack` and add SSR contract tests for all plugins

`useStack` had a module-level `fallbackStack` variable that persisted across SSR requests, causing tickets registered in one request to bleed into the next. `getStackFallback()` now returns a fresh `createStack()` instance on every call when `IN_BROWSER` is false, while keeping the lazy singleton on the browser side.

Adds `index.ssr.test.ts` for all 14 plugin composables (useBreakpoints, useDate, useFeatures, useHydration, useLocale, useLogger, useNotifications, usePermissions, useReducedMotion, useRtl, useRules, useStack, useStorage, useTheme, useTooltip) and a `plugins.meta.test.ts` that fails if any future plugin composable ships without SSR coverage.
