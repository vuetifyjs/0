---
'@vuetify/v0': patch
---

fix(useDate): arm the useLocale sync through the plugin install path

`createDatePlugin` constructed its date context eagerly, at
`createDatePlugin()` call time - before `app.use()` runs and before any
component exists. At that point `instanceExists()` is false, so the
`useLocale` lookup and the reactive locale-sync `watchEffect` never
armed; only a one-shot, non-reactive sync ran once. The documented
"integration with useLocale for automatic locale sync" never actually
worked through the plugin path, only when `createDate()` was called
directly inside a component's `setup()`.

`createDate` now checks `hasInjectionContext()` instead of
`instanceExists()` - `inject()` (which `useLocale` relies on) works
both inside a component's `setup()` and inside a plugin's
`app.runWithContext()` callback, so this correctly arms the reactive
sync in both cases. `createDatePlugin` now constructs its context
lazily, inside `provide()`, so it actually runs within that
`runWithContext()` call instead of outside any Vue context - this also
means installing the same plugin definition on multiple `app`
instances (e.g. one per SSR request) gives each app its own
locale/`firstDayOfWeek` context instead of sharing one across every
install.

Also documents (use-date FAQ) that the *adapter* instance itself should
still be constructed fresh per request under SSR rather than shared at
module scope - `adapter.locale`/`adapter.firstDayOfWeek` are mutable
state the sync writes into, and per-install context isolation doesn't
extend to an adapter object passed to every install.
