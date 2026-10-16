---
"@vuetify/v0": patch
---

fix(Otp): accept a full autofilled one-time code (#1011)

A code the browser inserts in one edit (SMS autofill, a password manager) fills every box. Dropping text onto a filled box replaces from that box instead of shifting the digits already there.
