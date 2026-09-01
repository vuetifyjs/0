---
"@vuetify/play": patch
---

fix(play): make `npm install @vuetify/play` resolve its dependencies

`0.1.0` shipped `@vuetify/v0` and `fflate` as workspace/catalog protocol strings, which npm cannot fetch. This republish writes semver ranges for both.
