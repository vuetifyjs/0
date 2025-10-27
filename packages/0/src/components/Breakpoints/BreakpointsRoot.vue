<script lang="ts">
  // Composables
  import { createBreakpoints } from '#v0/composables/useBreakpoints'

  // Types
  import type { BreakpointsContext, BreakpointsPluginOptions } from '#v0/composables/useBreakpoints'

  export interface BreakpointsRootProps extends BreakpointsPluginOptions {}

  export interface BreakpointsRootSlots {
    default: (scope: BreakpointsContext) => any
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BreakpointsRoot' })

  defineSlots<BreakpointsRootSlots>()

  const { namespace, ...props } = defineProps<BreakpointsRootProps>()

  const [, provideBreakpointsContext, context] = createBreakpoints(namespace, props)

  provideBreakpointsContext(context)
</script>

<template>
  <slot v-bind="context" />
</template>
