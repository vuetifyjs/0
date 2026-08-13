---
'@vuetify/v0': patch
'@paper/emerald': patch
---

fix(createProgress): clear stale segment values when the model becomes indeterminate

`Progress.Root`'s `apply()` only wrote incoming values to segments at matching
indices, so `apply([])` — what happens when the bound model value becomes
`undefined`, e.g. flipping `EmProgress`'s `indeterminate` prop after a value was
already committed — left previously-registered segments untouched. The bar
correctly ran Emerald's indeterminate sweep animation via CSS, but `data-state`
stayed `"determinate"` and `aria-valuenow`/`aria-valuetext` kept reporting the
stale committed value to assistive tech.

`apply()` now walks every registered segment rather than only the incoming
values, resetting any segment without a corresponding entry back to `min`. A
progress bar transitioning to indeterminate now correctly reports
`data-state="indeterminate"`, clears `aria-valuenow`/`aria-valuetext`, and sets
`aria-busy`.
