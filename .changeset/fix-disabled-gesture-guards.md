---
'@vuetify/v0': patch
---

fix(createSelection): disabled tickets are now inert to unselect and toggle

Gesture operations (select, unselect, toggle) no longer mutate disabled tickets in either direction. Wholesale operations (apply/v-model, selectAll, cascade propagation, clear) still drain disabled ids so state can never get stuck.
