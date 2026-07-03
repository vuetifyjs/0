---
"@vuetify/v0": patch
---

fix(useTheme): apply `cspNonce` on the SSR head path — `V0StyleSheetThemeAdapter` accepted a `cspNonce` option but never applied it: the SSR `head.push` `<style>` was emitted without the nonce, so strict-CSP (`style-src 'nonce-…'`) apps had their server-rendered theme styles blocked (FOUC until client hydration). The nonce is now threaded into the SSR style entry, and `V0UnheadThemeAdapter` accepts and forwards `cspNonce` too (initial push, reactive patch, and `update()`). The nonce is added only when set, so non-CSP usage is unchanged. The client `adoptedStyleSheets` path correctly needs no nonce.
