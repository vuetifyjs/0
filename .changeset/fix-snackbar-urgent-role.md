---
"@vuetify/v0": patch
---

fix(Snackbar): add an `urgent` prop that switches the live region to `role="alert"` (#624)

Informational snackbars keep `role="status"` (a polite live region); setting `urgent` switches to `role="alert"` (assertive) so critical notifications interrupt assistive technology instead of waiting for it to go idle (WCAG 4.1.3, Status Messages).
