---
"@vuetify/v0": minor
---

feat(createCombobox): commit free-text values in non-strict mode

A non-strict combobox (the default) now accepts typed text that matches no registered option. Confirming with **Enter**, **Tab**, click-outside, or blur mints a ticket for the typed value, selects it, and emits it through `v-model`; `strict` keeps the constrained behaviour and discards unmatched text on confirm. Adds a `commit()` action to the combobox context. **Escape** still cancels. Virtual focus reads the option element from the registered ticket (`el`), not `document.querySelector`.
