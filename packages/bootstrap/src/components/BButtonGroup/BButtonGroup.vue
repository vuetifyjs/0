<script lang="ts">
  // Framework
  import { isString } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  export interface BButtonGroupProps {
    /** Adds `.btn-group-divider`. */
    divider?: boolean
    /** Sets `aria-label` on the group. */
    label?: string
    /**
     * Uses `.btn-group-vertical` instead of `.btn-group`.
     *
     * @default false
     */
    vertical?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BButtonGroup' })

  defineSlots<{
    default?: () => any
  }>()

  const {
    divider = false,
    label,
    vertical = false,
  } = defineProps<BButtonGroupProps>()

  const classes = toRef(() => {
    const list = [vertical ? 'btn-group-vertical' : 'btn-group']

    if (divider) list.push('btn-group-divider')

    return list
  })

  const named = toRef(() => isString(label) && label.length > 0 ? label : undefined)
</script>

<template>
  <div
    :aria-label="named"
    :class="classes"
    role="group"
  >
    <slot />
  </div>
</template>
