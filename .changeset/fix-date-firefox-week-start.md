---
'@vuetify/v0': patch
---

fix(useDate): derive locale week start from CLDR data when Intl.Locale.getWeekInfo is unavailable

Firefox ships neither `Intl.Locale.getWeekInfo` nor the legacy `weekInfo` accessor, so every locale there fell back to a Sunday-start week — `de-DE`, `fr-FR`, and `en-GB` calendars all rendered incorrectly. Week start (and `minimalDays`) now falls back to a CLDR region table, with bare language tags resolved to their likely region, so Firefox renders the same week layout as Chromium and Safari.
