---
'@vuetify/v0': patch
---

fix(Snackbar): announce toasts via persistent portal live regions

`Snackbar.Portal` now auto-renders a new `Snackbar.Announcer` — a visually-hidden polite + assertive live-region pair, empty from app start — and each `Snackbar.Root` mirrors its rendered text into the matching region on mount (`urgent` routes to the assertive/alert region), so screen readers reliably announce the first toast, including on NVDA where JS-injected `role="status"` regions are not announced. Toast content renders immediately with no delay; identical consecutive messages re-announce. Pass `:announcer="false"` on the Portal to omit the pair or place `<Snackbar.Announcer>` yourself; a bare `Snackbar.Root` without a Portal keeps its role attributes as best-effort.
