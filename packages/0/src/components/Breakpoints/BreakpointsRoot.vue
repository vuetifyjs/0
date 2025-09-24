<script lang="ts">
  // Composables
  import { createBreakpoints } from '#v0/composables/useBreakpoints'

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

  const [, provideBreakpointsContext, context] = createBreakpoints('v0:breakpoints', props)

  provideBreakpointsContext(context)
</script>

<template>
  <slot v-bind="context" />
</template>
