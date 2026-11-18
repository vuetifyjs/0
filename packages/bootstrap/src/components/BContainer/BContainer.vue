<script lang="ts">
  // Framework
  import { isString } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  const CONTAINERS = {
    'sm': 'sm:container',
    'md': 'md:container',
    'lg': 'lg:container',
    'xl': 'xl:container',
    '2xl': '2xl:container',
  } as const

  export type BContainerBreakpoint = keyof typeof CONTAINERS

  export interface BContainerProps {
    /**
     * `container-fluid`. Wins over `breakpoint`.
     *
     * @default false
     */
    fluid?: boolean
    /**
     * Responsive container. `md` adds `md:container`, not `container-md`.
     * Omitted when `fluid` is set.
     */
    breakpoint?: BContainerBreakpoint
  }

  function isBreakpoint (value: string): value is BContainerBreakpoint {
    return Object.hasOwn(CONTAINERS, value)
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BContainer' })

  defineSlots<{
    default?: () => any
  }>()

  const {
    fluid = false,
    breakpoint,
  } = defineProps<BContainerProps>()

  const classes = toRef(() => {
    if (fluid) return ['container-fluid']
    if (isString(breakpoint) && isBreakpoint(breakpoint)) return [CONTAINERS[breakpoint]]
    return ['container']
  })
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
