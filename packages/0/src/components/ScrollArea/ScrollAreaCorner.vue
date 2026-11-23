/**
 * @module ScrollAreaCorner
 *
 * @see https://0.vuetifyjs.com/components/semantic/scroll-area
 *
 * @remarks
 * Fills the corner where the vertical and horizontal scrollbars meet.
 * Rendered only while both scrollbars are visible, sized to their thickness.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useScrollAreaRoot } from './ScrollAreaRoot.vue'

  // Utilities
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface ScrollAreaCornerProps extends AtomProps {
    /** Namespace for connecting to parent ScrollArea.Root */
    namespace?: string
  }

  export interface ScrollAreaCornerSlotProps {
    attrs: {
      'aria-hidden': 'true'
      'style': Record<string, string | number>
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'ScrollAreaCorner', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: ScrollAreaCornerSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:scroll-area',
  } = defineProps<ScrollAreaCornerProps>()

  const root = useScrollAreaRoot(namespace)

  const isVisible = toRef(() => root.isVisible('vertical') && root.isVisible('horizontal'))

  const slotProps = toRef((): ScrollAreaCornerSlotProps => ({
    attrs: {
      'aria-hidden': 'true',
      'style': {
        position: 'absolute',
        bottom: 0,
        insetInlineEnd: 0,
        width: `${root.thickness.value.vertical}px`,
        height: `${root.thickness.value.horizontal}px`,
      },
    },
  }))
</script>

<template>
  <Atom
    v-if="isVisible"
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
