<script lang="ts">
  // Utilities
  import { toRef } from 'vue'

  export interface BPlaceholderProps {
    /** `placeholder-xs`, `placeholder-sm`, or `placeholder-lg` on the span. */
    size?: 'xs' | 'sm' | 'lg'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BPlaceholder' })

  defineSlots<{
    default?: () => any
  }>()

  const { size } = defineProps<BPlaceholderProps>()

  const classes = toRef(() => {
    const list = ['placeholder']

    if (size === 'xs') list.push('placeholder-xs')
    if (size === 'sm') list.push('placeholder-sm')
    if (size === 'lg') list.push('placeholder-lg')

    return list
  })
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>
