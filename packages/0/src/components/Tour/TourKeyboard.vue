/**
 * @module TourKeyboard
 *
 * @remarks
 * Renderless keyboard navigation for tours.
 * Wires useHotkey for prev/next/stop actions.
 * Opt-in — not included means no keyboard handling.
 */

<script lang="ts">
  export interface TourKeyboardProps {
    prev?: string
    next?: string
    stop?: string
    namespace?: string
  }
</script>

<script setup lang="ts">
  // Composables
  import { useHotkey } from '#v0/composables/useHotkey'
  import { useTour } from '#v0/composables/useTour'

  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'TourKeyboard' })

  const {
    prev = 'arrowleft',
    next = 'arrowright',
    stop = 'escape',
    namespace = 'v0:tour',
  } = defineProps<TourKeyboardProps>()

  const tour = useTour(namespace)

  // Only active when tour is active
  const keys = toRef(() => tour.isActive.value ? prev : undefined)
  const nextKeys = toRef(() => tour.isActive.value ? next : undefined)
  const stopKeys = toRef(() => tour.isActive.value ? stop : undefined)

  useHotkey(keys, () => tour.prev(), { inputs: false })
  useHotkey(nextKeys, () => tour.next(), { inputs: false })
  useHotkey(stopKeys, () => tour.stop(), { inputs: true })
</script>

<template>
  <slot />
</template>
