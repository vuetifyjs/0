---
"@vuetify/v0": minor
---

feat(useDate): add a `calendar` option to `V0DateAdapter` for non-Gregorian calendars

`new V0DateAdapter('fa-IR', { calendar: 'persian' })` reads, computes and formats dates in that calendar. ISO strings and `Date` values stay Gregorian.

Until V8 implements calendar duration math, a calendar other than `iso8601` is computed with `@js-temporal/polyfill`. The `iso8601` path keeps the runtime's Temporal.

Without the option, formatting is now always Gregorian. Locales whose Intl default is another calendar, such as `fa-IR`, previously formatted month names and years in that calendar while date fields stayed Gregorian.
