/**
 * @module AspectRatio
 *
 * @see https://0.vuetifyjs.com/components/primitives/aspect-ratio
 *
 * @remarks
 * Reserves a box with a fixed width-to-height ratio using CSS `aspect-ratio`.
 * Useful for preventing Cumulative Layout Shift while media loads, for iframe
 * wrappers, and for any container whose height should track its width.
 *
 * Accepts a number (`16 / 9`) or a string (`'16 / 9'`, `'1.777'`). Inner
 * content fills the reserved frame — pair with `w-full h-full` or
 * `position: absolute inset-0` on children.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Utilities
  import { isNumber } from '#v0/utilities'
  import { toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface AspectRatioProps extends AtomProps {
    /**
     * The aspect ratio as `width / height`. Accepts a number (`16 / 9`) or a
     * CSS `aspect-ratio` string (`'16 / 9'`, `'1.777'`).
     * @default 1
     */
    ratio?: number | string
  }

  export interface AspectRatioSlotProps {
    /** Resolved CSS `aspect-ratio` value. */
    ratio: string
    /** Attributes to bind to the root element. */
    attrs: {
      style: { aspectRatio: string }
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'AspectRatio' })

  defineSlots<{
    default: (props: AspectRatioSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    ratio = 1,
  } = defineProps<AspectRatioProps>()

  const resolved = toRef(() => isNumber(ratio) ? String(ratio) : ratio)

  const slotProps = toRef((): AspectRatioSlotProps => ({
    ratio: resolved.value,
    attrs: {
      style: { aspectRatio: resolved.value },
    },
  }))
</script>

<template>
  <Atom
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
