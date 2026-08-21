/**
 * @module VirtualizerItem
 *
 * @see https://0.vuetifyjs.com/components/data/virtualizer
 *
 * @remarks
 * Wrapper for a single rendered item within a virtualized list. Measures
 * its own rendered height via ResizeObserver and reports it back to
 * Virtualizer.Root so subsequent layout accounts for variable item
 * heights, rather than requiring the consumer to call `resize()` by hand.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useVirtualizerRoot } from './VirtualizerRoot.vue'

  // Composables
  import { useResizeObserver } from '#v0/composables/useResizeObserver'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Utilities
  import { mergeProps, toRef, useAttrs, useTemplateRef } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'

  export interface VirtualizerItemProps extends AtomProps {
    /** The item's index within the full (unvirtualized) list */
    index: number
    /** Namespace for context injection from parent Virtualizer.Root */
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'VirtualizerItem', inheritAttrs: false })

  const attrs = useAttrs()

  defineSlots<{
    default: () => any
  }>()

  const {
    as = 'div',
    renderless,
    index,
    namespace = 'v0:virtualizer:root',
  } = defineProps<VirtualizerItemProps>()

  const root = useVirtualizerRoot(namespace)

  const itemRef = useTemplateRef<AtomExpose>('item')
  const el = toRef(() => toElement(itemRef.value?.element) ?? null)

  useResizeObserver(el, entries => {
    const entry = entries[0]
    if (!entry) return
    root.resize(index, entry.contentRect.height)
  })

  const itemAttrs = toRef(() => ({
    'data-index': index,
  }))
</script>

<template>
  <Atom
    ref="item"
    v-bind="mergeProps(attrs, itemAttrs)"
    :as
    :renderless
  >
    <slot />
  </Atom>
</template>
