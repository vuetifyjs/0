/**
 * @module BuField
 *
 * @remarks
 * Bulma `.field` wrapper — pure markup, no v0 state. Supports addons,
 * grouped, and horizontal layouts per bulma.io/documentation/form/general.
 */

<script lang="ts">
  // Framework
  import { isString } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  export type BuFieldSize = 'small' | 'normal' | 'medium' | 'large'

  export interface BuFieldProps {
    /** Attached controls: `has-addons` (+ `has-addons-centered` / `has-addons-right`) */
    addons?: boolean | 'centered' | 'right'
    /** Grouped controls: `is-grouped` (+ `is-grouped-centered` / `is-grouped-right` / `is-grouped-multiline`) */
    grouped?: boolean | 'centered' | 'right' | 'multiline'
    /** Horizontal layout: `is-horizontal` with `.field-label` + `.field-body` */
    horizontal?: boolean
    /** Size class on `.field-label` when horizontal: `is-{size}` */
    size?: BuFieldSize
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuField' })

  defineSlots<{
    default: () => any
    label?: () => any
  }>()

  const {
    addons = false,
    grouped = false,
    horizontal = false,
    size,
  } = defineProps<BuFieldProps>()

  const classes = toRef(() => [
    addons && 'has-addons',
    isString(addons) && `has-addons-${addons}`,
    grouped && 'is-grouped',
    isString(grouped) && `is-grouped-${grouped}`,
    horizontal && 'is-horizontal',
  ])
</script>

<template>
  <div class="field" :class="classes">
    <template v-if="horizontal">
      <div class="field-label" :class="size && `is-${size}`">
        <slot name="label" />
      </div>

      <div class="field-body">
        <slot />
      </div>
    </template>

    <template v-else>
      <slot name="label" />
      <slot />
    </template>
  </div>
</template>
