---
"@vuetify/v0": patch
---

fix(createRegistry): keep sync effects and bounds consistent across register, unregister, clear, batch, move, seek and dispose

- In `reactive: true` mode a sync effect that fires on `register`, `unregister` or `clear` now reads `keys()`, `values()` and `entries()` that already reflect the mutation, never a removed id or a missing new one.
- A listener that opens its own `batch()` during end-of-batch dispatch no longer suppresses the outer batch's iteration notification, so templates iterating the registry pick up the registration.
- `move()` and `seek()` truncate a fractional index and clamp it to the valid range; `Infinity` targets the last position, `-Infinity` and `NaN` the first. A fractional `move()` no longer throws and leaves the order inconsistent.
- `dispose()` dispatches `clear:registry` before dropping listeners, so a `useProxyRegistry` snapshot empties when its registry is disposed. Listeners are dropped even when one of them throws, and a `dispose()` call made from inside a listener is ignored.
