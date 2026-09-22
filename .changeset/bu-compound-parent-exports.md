---
"@paper/bulma": minor
---

feat(bulma): reach a compound's parts from the parent import

Importing `BuModal` now brings its whole tree with it — `<BuModal.Head />`, `<BuModal.Title />`, and the rest — so a compound costs one import instead of eight. The sub-key drops the parent prefix (`BuModalHead` is `BuModal.Head`, `BuNumberFieldInput` is `BuNumberField.Input`).

```vue
<script setup lang="ts">
  import { BuModal } from '@paper/bulma'
</script>

<template>
  <BuModal>
    <BuModal.Card>
      <BuModal.Head>
        <BuModal.Title />
      </BuModal.Head>
    </BuModal.Card>
  </BuModal>
</template>
```

Nothing is removed: every flat name (`BuModalHead`, `BuDropdownMenu`, …) is still exported and resolves to the same component, so existing imports keep working and the two styles can be mixed.
