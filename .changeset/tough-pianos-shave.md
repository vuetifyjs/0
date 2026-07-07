---
'@vuetify/v0': patch
---

perf(createRegistry): skip version notification on field-only upsert

Patching an existing ticket via `upsert` no longer re-notifies version-subscribed
iterating effects — membership and order are unchanged, and field changes already
propagate through the shallowReactive ticket proxies and the `update:ticket`
event. The read cache still refreshes so event-driven snapshot consumers
(`useProxyRegistry`) observe a fresh array identity. This restores the pre-#540
iteration granularity for field patches.
