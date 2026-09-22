---
'@paper/emerald': patch
---

fix(EmSnackbar): announce error variants assertively instead of politely

`variant="error"` now uses `role="alert"`. Other variants stay `role="status"`.
Pass `urgent` to override either way.
