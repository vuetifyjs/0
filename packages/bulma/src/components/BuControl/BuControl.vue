/**
 * @module BuControl
 *
 * @remarks
 * Bulma `.control` wrapper — pure markup, no v0 state. Carries the icon,
 * loading, and size modifier classes per bulma.io/documentation/form/general.
 */

<script lang="ts">
  // Utilities
  import { toRef } from 'vue'

  export type BuControlSize = 'small' | 'normal' | 'medium' | 'large'

  export interface BuControlProps {
    /** Element tag — Bulma docs use both `div.control` and `p.control` */
    as?: 'div' | 'p'
    /** Fill remaining space in grouped/addon fields: `is-expanded` */
    expanded?: boolean
    /** Icon placement: `has-icons-left` / `has-icons-right` */
    icons?: 'left' | 'right' | 'both'
    /** Loading spinner: `is-loading` */
    loading?: boolean
    /** Spinner size pairing: `is-{size}` on the control itself */
    size?: BuControlSize
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuControl' })

  defineSlots<{
    default: () => any
  }>()

  const {
    as = 'div',
    expanded = false,
    icons,
    loading = false,
    size,
  } = defineProps<BuControlProps>()

  const classes = toRef(() => [
    (icons === 'left' || icons === 'both') && 'has-icons-left',
    (icons === 'right' || icons === 'both') && 'has-icons-right',
    loading && 'is-loading',
    size && `is-${size}`,
    expanded && 'is-expanded',
  ])
</script>

<template>
  <component :is="as" class="control" :class="classes">
    <slot />
  </component>
</template>
