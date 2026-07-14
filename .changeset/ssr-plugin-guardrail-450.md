---
'@vuetify/v0': patch
---

test(plugins): lock in SSR safety for every plugin composable (#569)

Adds an SSR contract test to each plugin composable — no throw without a provider, and a fresh fallback per call so nothing leaks between requests — plus a guard that fails if a new plugin ships without one. The `useStack` leak these guard against was fixed in #442.
