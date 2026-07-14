---
"@vuetify/v0": patch
---

fix(useProxyModel): apply the current v-model to late-registering tickets (#587) — when the v-model changed before a value's ticket registered (e.g. tabs, carousels, or button groups whose items load asynchronously), the stale value was still selected once the ticket arrived, leaving the registry out of sync with the v-model. Late registration now honours the current model value.
