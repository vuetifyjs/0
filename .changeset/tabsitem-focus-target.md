---
"@vuetify/v0": patch
---

fix(TabsItem): let renderless items supply a focus target

Pass `el` to `Tabs.Item` when `as` is `null` so arrow keys move focus to the real control.
