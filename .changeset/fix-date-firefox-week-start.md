---
'@vuetify/v0': patch
---

fix(useDate): correct the first day of the week on Firefox and make week data consistent across browsers

Calendars rendered a Sunday-start week for every locale on Firefox — `de-DE`, `fr-FR`, and `en-GB` all laid out incorrectly — and could disagree between server and client when Node and browser ICU versions differ. Week start and `minimalDays` now come from CLDR 48 data on every runtime, so the same locale always produces the same week layout in Chromium, Firefox, Safari, and Node. An explicit `-u-fw-` keyword on the locale (e.g. `en-US-u-fw-mon`) is honored everywhere, and `minimalDays` for bare language tags is now the correct value for the locale's likely region (affects week numbers for e.g. `sv` and `pt`).
