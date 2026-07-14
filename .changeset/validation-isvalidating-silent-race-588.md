---
"@vuetify/v0": patch
---

fix(createValidation): stop `isValidating` sticking `true` when a silent validation interleaves an async one (#588) — triggering a silent `validate()` while a non-silent async validation was still in flight left `isValidating` stuck at `true` (a permanent loading/validating state) until the next clean validation. The flag is now owned by the latest non-silent run and clears reliably.
