/**
 * @module CarouselProgress
 *
 * @see https://0.vuetifyjs.com/components/semantic/carousel
 *
 * @remarks
 * Visual progress indicator for carousel autoplay timer. Derives a 0-1
 * progress value from the remaining time and total autoplay duration.
 * Exposes width styling for CSS-driven animation. Renders role="progressbar"
 * with proper ARIA value attributes.
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
  import { mergeProps, onBeforeUnmount, toRef, useAttrs, useTemplateRef } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'

  export interface CarouselProgressProps extends AtomProps {
    /** Namespace for connecting to parent Carousel.Root */
    namespace?: string
  }

  export interface CarouselProgressSlotProps {
    /** Progress value from 0 to 1 */
    progress: number
    /** Whether autoplay is currently active */
    isAutoplay: boolean
    /** Whether autoplay is paused */
    isPaused: boolean
    /** Attributes to bind to the progress element */
    attrs: {
      'role': 'progressbar'
      'aria-valuenow': number
      'aria-valuemin': 0
      'aria-valuemax': 100
      'aria-valuetext': string
      'aria-label': string
      'data-state': 'active' | 'paused' | 'idle'
      'style': { width: string }
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'CarouselProgress', inheritAttrs: false })

  const attrs = useAttrs()
  const rootEl = useTemplateRef<AtomExpose>('root')

  defineSlots<{
    default: (props: CarouselProgressSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    namespace = 'v0:carousel',
  } = defineProps<CarouselProgressProps>()

  const locale = useLocale()
  const carousel = useCarouselRoot(namespace)

  const el = toRef(() => toElement(rootEl.value?.element) as HTMLElement | null ?? null)
  const ticket = carousel.parts.register({ type: 'progress', el })
  onBeforeUnmount(() => ticket.unregister())

  const progress = toRef(() => {
    const duration = carousel.autoplay.value
    if (duration <= 0) return 0
    return 1 - (carousel.remaining.value / duration)
  })

  const state = toRef((): 'active' | 'paused' | 'idle' => {
    if (!carousel.isAutoplay.value) return 'idle'
    if (carousel.isPaused.value) return 'paused'
    return 'active'
  })

  const slotProps = toRef((): CarouselProgressSlotProps => {
    const percent = Math.round(progress.value * 100)

    return {
      progress: progress.value,
      isAutoplay: carousel.isAutoplay.value,
      isPaused: carousel.isPaused.value,
      attrs: {
        'role': 'progressbar',
        'aria-valuenow': percent,
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'aria-valuetext': locale.t('Carousel.progress', { percent }),
        'aria-label': locale.t('Carousel.progressLabel'),
        'data-state': state.value,
        'style': { width: `${percent}%` },
      },
    }
  })
</script>

<template>
  <Atom
    ref="root"
    v-bind="mergeProps(attrs, slotProps.attrs)"
    :as
    :renderless
    :style="[attrs.style, slotProps.attrs.style]"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
