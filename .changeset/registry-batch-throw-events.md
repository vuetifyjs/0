---
"@vuetify/v0": patch
---

fix(createRegistry): dispatch batched events even when the batch callback throws (#570)

Event-driven consumers (e.g. `useProxyRegistry` snapshots) no longer go stale when a batch or `onboard` throws after some mutations already applied — the queued events for those applied mutations now flush regardless of whether the callback completes.
