<script lang="ts">
  // Utilities
  import { toRef } from 'vue'

  export type BFormAdornSize = 'sm' | 'lg'

  export interface BFormAdornProps {
    /** Puts the adornment on the trailing side. DOM order stays adornment, then input. */
    end?: boolean
    /** `form-control-sm` or `form-control-lg` on the label. */
    size?: BFormAdornSize
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BFormAdorn' })

  defineSlots<{
    default?: () => any
  }>()

  const {
    end = false,
    size,
  } = defineProps<BFormAdornProps>()

  const modifiers = toRef(() => {
    const list: string[] = []
    if (end) list.push('form-adorn-end')
    if (size === 'sm' || size === 'lg') list.push(`form-control-${size}`)
    return list
  })
</script>

<template>
  <label class="form-control form-adorn" :class="modifiers">
    <slot />
  </label>
</template>
