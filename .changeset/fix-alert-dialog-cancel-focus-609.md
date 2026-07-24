---
"@vuetify/v0": patch
---

fix(AlertDialog): focus the Cancel element on open per the APG alertdialog pattern (#630)

The WAI-ARIA Authoring Practices alertdialog pattern calls for initial focus to land on the least-destructive action, and the docs already stated this — but `AlertDialogContent` never actually called `.focus()` on the Cancel element, so focus landed wherever the browser defaulted. `AlertDialogCancel` now registers its DOM element on the shared context, and `AlertDialogContent` focuses it immediately after opening.
