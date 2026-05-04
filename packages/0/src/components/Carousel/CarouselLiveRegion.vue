/**
 * @module CarouselLiveRegion
 *
 * @see https://0.vuetifyjs.com/components/semantic/carousel
 *
 * @remarks
 * Visually hidden live region that announces slide changes to screen readers.
 * Uses aria-live="polite" to announce without interrupting the user.
 *
 * The live region must exist in the DOM before content changes for screen readers
 * to detect updates. A small delay (100ms) is used after slide changes to ensure
 * reliable announcement across different assistive technologies.
 *
 * This component should be visually hidden but remain in the DOM. Apply
 * visually-hidden CSS (sr-only) to hide it from sighted users while keeping
 * it accessible to screen readers.
 *
 * @see https://tetralogical.com/blog/2024/05/01/why-are-my-live-regions-not-working/
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useCarouselRoot } from './CarouselRoot.vue'

  // Composables
  import { useLocale } from '#v0/composables/useLocale'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Utilities
  import { isUndefined } from '#v0/utilities'
  import { mergeProps, onBeforeUnmount, shallowRef, toRef, useAttrs, useTemplateRef, watch } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'

  export interface CarouselLiveRegionProps extends AtomProps {
    /** Namespace for connecting to parent Carousel.Root */
    namespace?: string
  }

  export interface CarouselLiveRegionSlotProps {
    /** Current slide number (1-indexed) */
    current: number
    /** Total number of slides */
    size: number
    /** Announcement text */
    text: string
    /** Attributes to bind to the live region element */
    attrs: {
      'aria-atomic': true
      'aria-live': 'polite'
      'role': 'status'
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CarouselLiveRegion', inheritAttrs: false })

  const attrs = useAttrs()
  const rootEl = useTemplateRef<AtomExpose>('root')

  defineSlots<{
    default: (props: CarouselLiveRegionSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:carousel',
  } = defineProps<CarouselLiveRegionProps>()

  const locale = useLocale()
  const carousel = useCarouselRoot(namespace)

  const el = toRef(() => toElement(rootEl.value?.element) as HTMLElement | null ?? null)
  const ticket = carousel.parts.register({ type: 'live-region', el })
  onBeforeUnmount(() => ticket.unregister())

  // Text starts empty - live regions must be empty initially for announcements to work
  const text = shallowRef('')

  // Watch for slide changes and update text after a small delay
  // This ensures screen readers detect the content change
  // @see https://tetralogical.com/blog/2024/05/01/why-are-my-live-regions-not-working/
  /* v8 ignore start -- watch fires after mount, setTimeout callback requires timer */
  let pending: ReturnType<typeof setTimeout> | undefined

  watch(() => carousel.selectedIndex.value, (index, prevIndex) => {
    if (isUndefined(prevIndex)) return

    clearTimeout(pending)
    pending = setTimeout(() => {
      text.value = locale.t(
        'Carousel.liveRegion',
        { current: index + 1, size: carousel.size },
      )
    }, 100)
  })

  onBeforeUnmount(() => clearTimeout(pending))
  /* v8 ignore stop */

  const slotProps = toRef((): CarouselLiveRegionSlotProps => ({
    current: carousel.selectedIndex.value + 1,
    size: carousel.size,
    text: text.value,
    attrs: {
      'aria-atomic': true,
      'aria-live': 'polite',
      'role': 'status',
    },
  }))
</script>

<template>
  <Atom
    ref="root"
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
  >
    <slot v-bind="slotProps">
      {{ text }}
    </slot>
  </Atom>
</template>
