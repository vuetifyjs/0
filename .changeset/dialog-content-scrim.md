---
"@vuetify/v0": minor
---

feat(Dialog): opt a dialog out of the global Scrim with `scrim`

`Dialog.Content` and `AlertDialog.Content` accept `scrim` (default `true`). Pass `false` when you own the backdrop so an app-level `<Scrim>` does not double-dim the overlay.
