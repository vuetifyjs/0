---
'@vuetify/v0': patch
---

fix(useDate): sync with the active locale when installed via createDatePlugin (#845)

The documented `useLocale` integration never worked through the plugin path: dates formatted with the plugin's `locale` option (or the adapter default), and switching locales did nothing unless `createDate()` was called directly inside a component's `setup()`. Installed after `createLocalePlugin`, the date plugin now resolves the selected locale and derived `firstDayOfWeek` reactively, and each `app.use()` gets its own date context instead of sharing one across apps — one SSR request's locale no longer bleeds into another's render. That isolation does not extend to a shared `adapter` instance: `adapter.locale` / `adapter.firstDayOfWeek` are mutable state the sync writes into, so construct the adapter fresh per request under SSR (see the use-date FAQ).
