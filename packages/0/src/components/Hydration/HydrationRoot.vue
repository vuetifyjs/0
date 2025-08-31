<script lang="ts">
  // Composables
  import { createHydration, provideHydrationContext } from '#v0/composables/useHydration'

  // Types
  import type { HydrationContext } from '#v0/composables/useHydration'

  export interface HydrationRootSlots {
    default: (scope: HydrationContext) => any
  }
</script>

<script lang="ts" setup>
  defineOptions({ name: 'HydrationRoot' })

  defineSlots<HydrationRootSlots>()

  const hydrationContext = createHydration()

  provideHydrationContext(hydrationContext)
</script>

<template>
  <slot v-bind="hydrationContext" />
</template>
