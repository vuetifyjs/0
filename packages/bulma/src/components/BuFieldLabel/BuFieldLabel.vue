/**
 * @module BuFieldLabel
 *
 * @remarks
 * Bulma `.field-label` — the label column of a horizontal field. Its `size`
 * aligns the column with the control it labels; the `.label` itself is a
 * BuLabel nested inside.
 */

<script lang="ts">
  // Utilities
  import { toRef } from 'vue'

  export type BuFieldLabelSize = 'small' | 'normal' | 'medium' | 'large'

  export interface BuFieldLabelProps {
    /** Size class aligning the column with its control: `is-{size}` */
    size?: BuFieldLabelSize
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuFieldLabel' })

  defineSlots<{
    /** Label column content — typically a BuLabel. */
    default?: () => any
  }>()

  const { size } = defineProps<BuFieldLabelProps>()

  const classes = toRef(() => size && `is-${size}`)
</script>

<template>
  <div class="field-label" :class="classes">
    <slot />
  </div>
</template>
