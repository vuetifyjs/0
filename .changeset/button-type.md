---
"@vuetify/v0": patch
---

fix(Button): accept a type prop so a button can submit or reset a form

`Button.Root` still defaults to `type="button"`, so it does not submit a parent form. Pass `type="submit"` or `type="reset"` when that native behavior is what you want. `readonly`, `passive`, and `loading` still block the submission.
