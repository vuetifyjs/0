<script lang="ts">
  // Composables
  import { createBreakpoints, provideBreakpointsContext } from '#v0/composables/useBreakpoints'

  // Types
  import type { BreakpointsContext, BreakpointsOptions } from '#v0/composables/useBreakpoints'

  export interface BreakpointsRootProps extends BreakpointsOptions {}

  export interface BreakpointsRootSlots {
    default: (scope: BreakpointsContext) => any
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BreakpointsRoot' })

  defineSlots<BreakpointsRootSlots>()

  const props = defineProps<BreakpointsRootProps>()

  const breakpointsContext = createBreakpoints(props)

  provideBreakpointsContext(breakpointsContext)
</script>

<template>
  <slot v-bind="breakpointsContext" />
</template>
