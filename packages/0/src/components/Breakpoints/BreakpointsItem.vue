<script lang="ts">
  // Composables
  import { useBreakpoints } from '#v0/composables/useBreakpoints'

  // Types
  import type { BreakpointsContext } from '#v0/composables/useBreakpoints'

  export interface BreakpointsSlots {
    default: (scope: BreakpointsContext) => any
    xs?: (scope: BreakpointsContext) => any
    sm?: (scope: BreakpointsContext) => any
    md?: (scope: BreakpointsContext) => any
    lg?: (scope: BreakpointsContext) => any
    xl?: (scope: BreakpointsContext) => any
    xxl?: (scope: BreakpointsContext) => any
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BreakpointsItem' })

  defineSlots<BreakpointsSlots>()

  const breakpointsContext = useBreakpoints()
</script>

<template>
  <slot
    v-if="$slots.xs && breakpointsContext.xs"
    name="xs"
    v-bind="breakpointsContext"
  />
  <slot
    v-else-if="$slots.sm && breakpointsContext.sm"
    name="sm"
    v-bind="breakpointsContext"
  />
  <slot
    v-else-if="$slots.md && breakpointsContext.md"
    name="md"
    v-bind="breakpointsContext"
  />
  <slot
    v-else-if="$slots.lg && breakpointsContext.lg"
    name="lg"
    v-bind="breakpointsContext"
  />
  <slot
    v-else-if="$slots.xl && breakpointsContext.xl"
    name="xl"
    v-bind="breakpointsContext"
  />
  <slot
    v-else-if="$slots.xxl && breakpointsContext.xxl"
    name="xxl"
    v-bind="breakpointsContext"
  />

  <slot v-bind="breakpointsContext" />
</template>
