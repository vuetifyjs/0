---
"@vuetify/v0": patch
---

fix(createRegistry): heal offboard reindex, id identity, and batched field-only upserts

Three correctness fixes to the registry foundation:

- **`offboard` now eagerly reindexes** when index-derived tickets shift position, so `values()` / `entries()` and `useProxyRegistry` consumers see corrected `index` / `value` immediately — previously a mid-list `offboard()` left the default (index-valued) survivors stale until some later position-reading call drained the deferred reindex, and iteration-only consumers never healed. It also drops the stale iteration cache before the removals so a sync effect firing mid-`offboard` never observes removed ids.
- **`offboard` preserves a supplied `id`** across a transfer even when the ticket has no explicit value. It previously used `valueIsIndex` as a proxy for "id was auto-generated" and stripped the id of any value-less ticket, so `register({ id: 'a' })` → `offboard(['a'])` returned `{}` and lost identity. Now only ids the registry itself minted are stripped. **Behavior delta for the selection chain:** `createModel` and everything built on it mint ids in their wrappers before calling `register`, so those ids read as supplied to the base registry — `offboard` now preserves them where it previously stripped them for value-less tickets. Downstream transfers (e.g. moving items between selections) keep their identity instead of getting a fresh id on re-onboard.
- **`batch()` no longer re-notifies iteration subscribers for a field-only upsert (or an empty batch)**, matching the non-batched `upsert` contract (§4.4): a batch that changes no membership or order leaves version subscribers untouched.
