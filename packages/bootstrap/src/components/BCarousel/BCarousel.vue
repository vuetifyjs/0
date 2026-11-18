<script lang="ts">
  // Framework
  import { createContext, isBoolean, isElement, isNumber, useLocale, useMediaQuery, useResizeObserver, useRtl, useTimer } from '@vuetify/v0'
  import { Carousel } from '@vuetify/v0/components'

  // Utilities
  import { mergeProps, toRef, useAttrs, useTemplateRef, watch } from 'vue'

  import { BButton } from '../BButton'

  export interface BCarouselProps {
    /**
     * Advance on a timer. `true` uses 5000ms. A number is the interval
     * in milliseconds. `false` stays on the current slide.
     *
     * @default false
     */
    autoplay?: boolean | number
    /**
     * Crossfade. Adds `carousel-fade`. The default is stacked slides.
     *
     * @default false
     */
    fade?: boolean
    /**
     * Classes for `.carousel-inner`. The first Bootstrap example uses
     * `rounded-5`.
     */
    innerClass?: string
  }

  export interface BCarouselContext {
    claim: () => number
  }

  const [useBCarousel, provideBCarousel] = createContext<BCarouselContext>('bootstrap:carousel')

  export { useBCarousel }

  const AUTOPLAY_MS = 5_000
</script>

<script setup lang="ts">
  defineOptions({ name: 'BCarousel', inheritAttrs: false })

  defineSlots<{
    default?: () => any
    /** Replaces the default controls under the slides. Bootstrap's first example puts this row above them. */
    controls?: (props: { next: () => void, prev: () => void }) => any
  }>()

  defineEmits<{
    'update:model-value': [value: number]
  }>()

  const model = defineModel<number>()

  const {
    autoplay = false,
    fade = false,
    innerClass,
  } = defineProps<BCarouselProps>()

  const fallthrough = useAttrs()
  const locale = useLocale()
  const rtl = useRtl()
  const reduce = useMediaQuery('(prefers-reduced-motion: reduce)')
  const inner = useTemplateRef<HTMLElement>('inner')

  // Selection moves in v0. The pin shows the next slide by scrolling
  // `.carousel-inner`. Fade stacks slides and uses `.active` instead.
  // Chromium's RTL `scrollLeft` is 0 on the first slide and negative after that.
  let syncing = false

  function destination (viewport: HTMLElement, index: number) {
    const width = viewport.clientWidth
    const reverse = getComputedStyle(viewport).direction === 'rtl'
    return reverse ? -index * width : index * width
  }

  function indexFromScroll (viewport: HTMLElement) {
    const width = viewport.clientWidth
    if (width === 0) return 0
    const reverse = getComputedStyle(viewport).direction === 'rtl'
    const traveled = reverse ? -viewport.scrollLeft : viewport.scrollLeft
    return Math.max(0, Math.round(traveled / width))
  }

  function sync (behavior: ScrollBehavior) {
    if (fade || !isNumber(model.value)) return
    const viewport = inner.value
    if (!viewport || viewport.clientWidth === 0) return
    const left = destination(viewport, model.value)
    if (Math.abs(viewport.scrollLeft - left) < 2) return
    syncing = true
    viewport.scrollTo({ left, behavior })
  }

  watch(model, () => {
    sync(reduce.matches.value ? 'auto' : 'smooth')
  })

  watch(inner, () => {
    sync('auto')
  })

  useResizeObserver(inner, () => {
    sync('auto')
  })

  function onScrollEnd () {
    if (fade) return
    const viewport = inner.value
    if (!viewport) return
    if (syncing) {
      syncing = false
      return
    }
    if (viewport.clientWidth === 0) return
    const index = indexFromScroll(viewport)
    if (model.value === index) return
    model.value = index
  }

  let cursor = 0

  function claim () {
    const index = cursor
    cursor += 1
    return index
  }

  provideBCarousel({ claim })

  const interval = toRef(() => {
    if (isBoolean(autoplay)) return autoplay ? AUTOPLAY_MS : 0
    if (isNumber(autoplay)) return autoplay
    return 0
  })

  // Carousel.Root builds its timer once and waits for play(). Own the
  // interval here so a later change from false to a number still starts.
  const timer = useTimer(() => {
    const count = cursor
    if (count < 2) return
    const current = isNumber(model.value) ? model.value : 0
    const next = current + 1
    model.value = next >= count ? 0 : next
  }, { duration: interval, repeat: true })

  watch(interval, ms => {
    timer.stop()
    if (ms > 0) timer.start()
  }, { immediate: true })

  function editable (target: EventTarget | null) {
    if (!isElement(target)) return false
    const tag = target.tagName
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
    return target instanceof HTMLElement && target.isContentEditable
  }

  function onKeydown (event: KeyboardEvent, next: () => void, prev: () => void) {
    if (editable(event.target)) return
    const forward = rtl.isRtl.value ? 'ArrowLeft' : 'ArrowRight'
    const back = rtl.isRtl.value ? 'ArrowRight' : 'ArrowLeft'
    if (event.key === forward) {
      event.preventDefault()
      next()
      return
    }
    if (event.key === back) {
      event.preventDefault()
      prev()
    }
  }
</script>

<template>
  <Carousel.Root
    v-slot="{ attrs, next, prev }"
    v-model="model"
    :circular="true"
    renderless
  >
    <div
      v-bind="mergeProps(fallthrough, attrs, {
        class: fade ? 'carousel slide carousel-fade' : 'carousel slide',
      })"
      @keydown="onKeydown($event, next, prev)"
    >
      <slot
        name="controls"
        :next
        :prev
      />

      <div
        ref="inner"
        class="carousel-inner"
        :class="innerClass"
        @scrollend="onScrollEnd"
      >
        <slot />
      </div>

      <div v-if="!$slots.controls">
        <BButton
          icon
          size="sm"
          @click="prev"
        >
          <span aria-hidden="true" class="carousel-icon-prev" />
          <span class="visually-hidden">{{ locale.ti('Carousel.prev') ?? 'Previous' }}</span>
        </BButton>

        <BButton
          icon
          size="sm"
          @click="next"
        >
          <span aria-hidden="true" class="carousel-icon-next" />
          <span class="visually-hidden">{{ locale.ti('Carousel.next') ?? 'Next' }}</span>
        </BButton>
      </div>
    </div>
  </Carousel.Root>
</template>
