---
"@paper/bulma": patch
---

fix(BuModal): skip the global Scrim so `.modal-background` is the only dim

BuModal already paints Bulma's `.modal-background`. It now passes `:scrim="false"` on `Dialog.Content` so an app-level `<Scrim>` does not stack a second backdrop.
