---
"@vuetify/v0": minor
---

fix(Dialog, Snackbar): overlays can teleport into the topmost open modal so snackbars shown over a modal Dialog appear above it and stay interactive (#279)

A native modal `<dialog>` (`showModal()`) is promoted to the browser **top layer**, which paints above all `z-index` and makes everything outside its subtree inert — so an overlay teleported to `body` rendered beneath the dialog and was unclickable. Overlays can now teleport into the top-layer subtree instead:

- `Snackbar.Portal` now defaults `teleport` to `'top-layer'`, mounting into the topmost open modal `<dialog>` when one is open and falling back to `body` otherwise. `teleport="body"` (always body) and `:teleport="false"` (render inline) remain escape hatches.
- `Portal` accepts a new `to="top-layer"` token that resolves to the topmost modal element, or `body` when no modal is open.
- `useStack` exposes a new `topElement` context field and an `el` option on `register()`, so modal dialogs publish their element as the teleport target.
