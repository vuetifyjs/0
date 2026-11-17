---
"@vuetify/v0": patch
---

fix(useLocale): format numbers on the server the way the client does

`locale.n()` returned the bare number during a server render and the `Intl.NumberFormat` result in the browser, so a locale with its own digits or grouping, such as `ar-EG`, rendered `7` on the server and `٧` on the client and failed hydration. It now formats for the selected locale in both places. Without a selected locale it still returns the bare number.
