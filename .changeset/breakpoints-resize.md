---
"@vuetify/v0": patch
---

fix(useBreakpoints): resize updates run without the plugin

`createBreakpoints()` follows viewport changes on its own. With `ssr` set, that listener waits for the first `update()`, so the server width stays in place until hydration. The plugin still calls `update()` once after mount in that case.
