<script lang="ts">
  // Composables
  import { useHydration } from '#v0/composables/useHydration'

  // Types
  import type { HydrationContext } from '#v0/composables/useHydration'

  export interface HydrationSlots {
    default: (scope: HydrationContext) => any
  }
</script>

<script lang="ts" setup>
  defineOptions({ name: 'Hydration' })

  defineSlots<HydrationSlots>()

  const hydrationContext = useHydration()
</script>

<template>
  <slot v-bind="hydrationContext" />
</template>
