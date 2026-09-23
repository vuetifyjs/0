---
'@vuetify/play': patch
---

fix(play): compile SFCs that import types from a package

Vue's browser compiler rejects `import type` from a package inside `defineProps`, `defineEmits`, and `defineModel`. Those imports are rewritten to a relative shim so the playground can compile them.
