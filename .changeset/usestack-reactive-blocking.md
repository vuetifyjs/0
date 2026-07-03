---
"@vuetify/v0": patch
---

fix(useStack): make ticket blocking/scrim reactive

`register()` now accepts `MaybeRefOrGetter` for `blocking`/`scrim` and exposes them as `Readonly<Ref<boolean>>` on the ticket, so a reactive `blocking` (e.g. a Dialog backing VDialog's reactive `persistent`) propagates instead of freezing at registration. `Dialog`/`AlertDialog`/`Portal` now pass them as getters.

Type change: `StackTicket.blocking`/`scrim` are now `Readonly<Ref<boolean>>` (were `boolean`) — read `.value`. Reads are internal to v0; `register()` still accepts plain booleans.
