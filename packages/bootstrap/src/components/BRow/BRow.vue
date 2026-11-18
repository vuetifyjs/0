<script lang="ts">
  // Framework
  import { isNumber } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  export interface BRowProps {
    /**
     * Even tracks. Adds `row-cols-{cols}` for an integer 1 through 6.
     * Any other value leaves the row as `row` only.
     */
    cols?: number
  }

  function isCols (value: number) {
    return value >= 1 && value <= 6 && Math.floor(value) === value
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BRow' })

  defineSlots<{
    default?: () => any
  }>()

  const { cols } = defineProps<BRowProps>()

  const classes = toRef(() => {
    if (isNumber(cols) && isCols(cols)) return ['row', `row-cols-${cols}`]
    return ['row']
  })
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
