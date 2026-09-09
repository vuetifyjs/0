/**
 * @module BuModalClose
 *
 * @remarks
 * Bulma `.modal-close` — the large corner button of the plain variant,
 * rendered through v0's `Dialog.Close` for the localized `aria-label` and
 * close wiring. Bulma places it as a sibling of `.modal-content`.
 */

<script lang="ts">
  // Framework
  import { Dialog } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  export interface BuModalCloseProps {
    /** Size modifier rendered as `is-{size}`. */
    size?: 'small' | 'normal' | 'medium' | 'large'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuModalClose' })

  const { size = 'large' } = defineProps<BuModalCloseProps>()

  const classes = toRef(() => ['modal-close', `is-${size}`])
</script>

<template>
  <Dialog.Close :class="classes" />
</template>
