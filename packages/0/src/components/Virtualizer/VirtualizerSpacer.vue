/**
 * @module VirtualizerSpacer
 *
 * @see https://0.vuetifyjs.com/components/data/virtualizer
 *
 * @remarks
 * Reserves the scroll range for rows that are not mounted. Place one before
 * the items and one after them with `edge="end"`. The height is the
 * virtualizer's `offset` or `size`; the caller picks the element (`as`)
 * and does not compute the pixel value.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useVirtualizerRoot } from './VirtualizerRoot.vue'

  // Composables
  import { useLogger } from '#v0/composables/useLogger'

  // Utilities
  import { isNull } from '#v0/utilities'
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface VirtualizerSpacerProps extends AtomProps {
    /** Which off-screen range this spacer reserves. `start` is the rows above the window; `end` is the rows below it */
    edge?: 'start' | 'end'
    /** Namespace for context injection from parent Virtualizer.Root */
    namespace?: string
  }

  export interface VirtualizerSpacerSlotProps {
    /** `start` reserves rows above the window; `end` reserves rows below it */
    edge: 'start' | 'end'
    /** Pixel height of the reserved range */
    height: number
    attrs: {
      'data-spacer': 'start' | 'end'
      'style': { height: string }
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'VirtualizerSpacer', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: (props: VirtualizerSpacerSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    edge = 'start',
    namespace = 'v0:virtualizer:root',
  } = defineProps<VirtualizerSpacerProps>()

  const root = useVirtualizerRoot(namespace)

  if (renderless || isNull(as)) {
    const logger = useLogger()
    logger.warn('[v0:virtualizer] `renderless` and `as="null"` are not supported on Virtualizer.Spacer — the reserved height requires the wrapper element. Remove them or use createVirtual directly.')
  }

  const slotProps = toRef((): VirtualizerSpacerSlotProps => {
    const height = edge === 'end' ? root.size.value : root.offset.value

    return {
      edge,
      height,
      attrs: {
        'data-spacer': edge,
        'style': { height: `${height}px` },
      },
    }
  })
</script>

<template>
  <Atom
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
    :style="[attrs.style, slotProps.attrs.style]"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
