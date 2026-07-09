---
"@vuetify/v0": patch
---

fix(createTokens): a token removed via its own `ticket.unregister()` no longer leaves a stale value in the resolution cache (#567)

`resolve()` results were only invalidated through the context-level mutator methods, so removing a token via its ticket's own `unregister()` — which is bound to the underlying registry — left the cache stale and subsequent `resolve()` calls returned the removed value. Cache invalidation now runs off registry mutation events, covering every removal and update path uniformly.
