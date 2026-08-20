---
'@paper/emerald': minor
---

feat(emerald): reach a compound's sub-components from the root import

Importing `EmCalendar` now brings its whole tree with it — `<EmCalendar.Grid />`, `<EmCalendar.Header />`, and the rest — so a compound costs one import instead of eight. The sub-key drops the parent prefix (`EmCalendarGrid` is `EmCalendar.Grid`, `EmListItemTitle` is `EmList.ItemTitle`).

```vue
<script setup lang="ts">
  import { EmCalendar } from '@paper/emerald'
</script>

<template>
  <EmCalendar>
    <EmCalendar.Header>
      <EmCalendar.Prev />
    </EmCalendar.Header>

    <EmCalendar.Grid />
  </EmCalendar>
</template>
```

Nothing is removed: every flat name (`EmCalendarGrid`, `EmDialogContent`, …) is still exported and resolves to the same component, so existing imports keep working and the two styles can be mixed.
