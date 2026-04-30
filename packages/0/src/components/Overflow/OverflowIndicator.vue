<script lang="ts">
  /**
   * @module OverflowIndicator
   *
   * @see https://0.vuetifyjs.com/components/semantic/overflow
   *
   * Indicator that renders only when items overflow. Self-measures its own
   * width and writes it back to OverflowRoot so capacity computation can
   * reserve space for the indicator's footprint.
   *
   * @remarks
   * In non-renderless mode, the wrapper carries `data-overflow-indicator`
   * and `aria-live="polite"`. **Renderless mode** drops the wrapper, so the
   * slot consumer must spread `slotProps.attrs` onto their own element to
   * preserve the data hook and live-region semantics.
   */

  // Components
  import { Atom } from '#v0/components/Atom'
  import { useOverflowRoot } from './OverflowRoot.vue'

  // Composables
  import { useResizeObserver } from '#v0/composables/useResizeObserver'

  // Utilities
  import { computed, onBeforeUnmount, toRef, useTemplateRef, watch } from 'vue'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { OverflowTicket } from './types'

  // Constants
  import { IN_BROWSER } from '#v0/constants/globals'

  export interface OverflowIndicatorProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
  }

  export interface OverflowIndicatorSlotProps {
    count: number
    hidden: OverflowTicket[]
    attrs: {
      'data-overflow-indicator': 'true'
      'aria-live': 'polite'
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'OverflowIndicator' })

  defineSlots<{
    default: (props: OverflowIndicatorSlotProps) => unknown
  }>()

  const {
    namespace = 'v0:overflow',
    as = 'div',
    renderless = false,
  } = defineProps<OverflowIndicatorProps>()

  const root = useOverflowRoot(namespace)
  const atomRef = useTemplateRef<AtomExpose>('atom')
  const el = toRef(() => toElement(atomRef.value?.element) ?? null)

  function measure () {
    if (!IN_BROWSER || !el.value) {
      root.indicatorWidth.value = 0
      return
    }
    const style = getComputedStyle(el.value)
    const marginX = Number.parseFloat(style.marginLeft) + Number.parseFloat(style.marginRight)
    root.indicatorWidth.value = (el.value as HTMLElement).offsetWidth + marginX
  }

  watch(el, () => measure(), { immediate: true })

  // Re-measure when the indicator's own size changes — content grows from
  // "+1 more" to "+99 more", or the consumer toggles padding/font-size.
  useResizeObserver(el, () => measure())

  onBeforeUnmount(() => {
    root.indicatorWidth.value = 0
  })

  const hidden = computed<OverflowTicket[]>(() => {
    return root.registry.values().filter((_, index) => !root.isVisible(index))
  })

  const slotProps = toRef((): OverflowIndicatorSlotProps => ({
    count: hidden.value.length,
    hidden: hidden.value,
    attrs: {
      'data-overflow-indicator': 'true',
      'aria-live': 'polite',
    },
  }))
</script>

<template>
  <Atom
    v-if="root.isOverflowing.value"
    ref="atom"
    :as
    :renderless
    v-bind="slotProps.attrs"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
