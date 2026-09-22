/**
 * @module BuField
 *
 * @remarks
 * Bulma `.field` wrapper — pure markup, no v0 state. Supports addons,
 * grouped, and horizontal layouts per bulma.io/documentation/form/general.
 * The horizontal layout's two columns are the BuFieldLabel and BuFieldBody
 * parts, composed in userland exactly as Bulma nests them.
 */

<script lang="ts">
  // Framework
  import { isString } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  export interface BuFieldProps {
    /** Attached controls: `has-addons` (+ `has-addons-centered` / `has-addons-right`) */
    addons?: boolean | 'centered' | 'right'
    /** Grouped controls: `is-grouped` (+ `is-grouped-centered` / `is-grouped-right` / `is-grouped-multiline`) */
    grouped?: boolean | 'centered' | 'right' | 'multiline'
    /** Horizontal layout: `is-horizontal`, composed from BuFieldLabel + BuFieldBody */
    horizontal?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuField' })

  defineSlots<{
    default: () => any
  }>()

  const {
    addons = false,
    grouped = false,
    horizontal = false,
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
    <slot />
  </div>
</template>
