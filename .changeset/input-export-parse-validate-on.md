---
"@vuetify/v0": minor
"@paper/bulma": patch
---

feat(Input): export parseValidateOn from the Input barrel

`parseValidateOn` and its `ParsedValidateOn` return type are now public, so wrappers that re-implement the `validateOn` surface can reuse the parser instead of copying it. NumberField and `@paper/bulma` now use the shared parser.
