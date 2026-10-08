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
  import { useLogger } from '#v0/composables/useLogger'
  import { useResizeObserver } from '#v0/composables/useResizeObserver'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Globals
  import { IN_BROWSER } from '#v0/constants/globals'

  // Utilities
  import { getActiveElement, isNull, isUndefined } from '#v0/utilities'
  import { mergeProps, onBeforeUnmount, shallowRef, toRef, useAttrs, useTemplateRef, watch } from 'vue'

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

  if (renderless || isNull(as)) {
    const logger = useLogger()
    logger.warn('[v0:virtualizer] `renderless` and `as="null"` are not supported on Virtualizer.Item — height measurement requires the wrapper element. Remove them or use createVirtual directly.')
  }

  const itemRef = useTemplateRef<AtomExpose>('item')
  const el = toRef(() => toElement(itemRef.value?.element) ?? null)

  // Rows stack by their border box, so padding and borders count toward
  // the space each one occupies. Safari < 15.4 and Chrome < 84 omit
  // borderBoxSize entirely and fall back to the content rect.
  const height = shallowRef<number>()

  useResizeObserver(el, entries => {
    const entry = entries[0]
    if (!entry) return
    height.value = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height
    root.resize(index, height.value)
  }, { box: 'border-box' })

  // A keyed row whose index shifts (items prepended) keeps its size, so no
  // ResizeObserver callback fires; re-report so the height follows the row
  watch(() => index, value => {
    if (isUndefined(height.value)) return
    root.resize(value, height.value)
  })

  // A row scrolled out of the window unmounts; if it held focus, the browser
  // drops focus to <body>. Hand it to the scroll container instead so
  // keyboard users keep their place in the list.
  onBeforeUnmount(() => {
    if (!IN_BROWSER) return
    const container = root.element.value
    if (!container?.isConnected || !el.value?.contains(getActiveElement())) return
    container.focus({ preventScroll: true })
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
