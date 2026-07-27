---
"@vuetify/v0": patch
---

fix(useProxyModel): keep a v-model value whose item has not rendered yet

Setting a v-model to a value whose item registers later — selecting a tab that is only rendered once it becomes active, or an option in a list that has not mounted — was immediately reverted to the previous selection. `useProxyModel` already defers such values so late-registering items resolve them, but the same tick wrote the old selection back over the model, discarding the value before its item could register. When the model is a writable `computed`, that write ran the setter, so the revert also fired the consumer's own side effects.

Values with no registered item are now held until their item registers; a value whose item exists but was refused (disabled, or blocked by `mandatory`) still reverts as before.
