---
"@vuetify/v0": patch
---

fix(components): injected contexts report a live `size`

The context injected by `Tabs.Root`, `Radio.Group`, `Progress.Root`, `Slider.Root`, `Locale`, and `Theme` now reports the current number of registered items instead of the count when the root mounted. `Rating.Root` follows its `size` prop.
