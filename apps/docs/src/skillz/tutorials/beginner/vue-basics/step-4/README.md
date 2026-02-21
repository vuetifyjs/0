---
hideFiles: true
hideTabs: true
hideBreadcrumbs: true
---
# Derived data

The avatar still shows hardcoded "AC". What if the name changes? We need a value that **automatically updates** when its dependencies change — that's what [`computed()`](https://vuejs.org/guide/essentials/computed.html) does.

## Computed refs

A `computed` ref derives its value from other refs. It recalculates whenever its dependencies change:

```vue
<script setup lang="ts">
  import { shallowRef, computed } from 'vue'

  const name = shallowRef('Alex Chen')

  const initials = computed(() => {
    return name.value
      .split(' ')
      .map(p => p[0])
      .join('')
      .toUpperCase()
  })
</script>
```

Now `initials` always reflects the current `name` — change the name and the avatar updates automatically.

We also derive `best` from a skills array:

```vue
<script setup lang="ts">
  const skills = shallowRef(['Vue', 'TypeScript', 'CSS'])
  const best = computed(() => skills.value[0])
</script>
```

> [!TRY] Add a `total` computed that returns something like "4 skills" (pluralized). Display it next to "Top skill" in the card.
