/**
 * @module TourHighlight
 *
 * @see https://0.vuetifyjs.com/components/disclosure/tour
 *
 * @remarks
 * SVG scrim with a cutout around the active activator. Optional click-swallow
 * layers for the backdrop and cutout; neither dismisses the tour.
 */

<script lang="ts">
  // Components
  import { Portal } from '#v0/components/Portal'

  // Composables
  import { useTour } from '#v0/composables/createTour'
  import { useRaf } from '#v0/composables/useRaf'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Globals
  import { IN_BROWSER } from '#v0/constants/globals'

  // Utilities
  import { isNull, isUndefined, useId } from '#v0/utilities'
  import { onScopeDispose, shallowRef, toRef, watch } from 'vue'

  export interface TourHighlightProps {
    /** Backdrop opacity (0–1) @default 0.5 */
    opacity?: number
    /** Extra padding around the cutout when the activator has none @default 0 */
    padding?: number
    /** Swallow clicks on the backdrop. Does not stop the tour. @default false */
    blocking?: boolean
    /** Swallow clicks on the cutout. Does not stop the tour. @default false */
    blockActivator?: boolean
    /** Namespace for dependency injection @default 'v0:tour' */
    namespace?: string
  }

  export interface TourHighlightSlotProps {
    isActive: boolean
  }

  interface HighlightRect {
    x: number
    y: number
    width: number
    height: number
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'TourHighlight' })

  defineSlots<{
    default: (props: TourHighlightSlotProps) => any
  }>()

  const {
    opacity = 0.5,
    padding = 0,
    blocking = false,
    blockActivator = false,
    namespace = 'v0:tour',
  } = defineProps<TourHighlightProps>()

  const tour = useTour(namespace)
  const maskId = `tour-highlight-${useId()}`

  const rect = shallowRef<HighlightRect | null>(null)
  const borderRadius = shallowRef(0)

  function updateRect () {
    const id = tour.selectedId.value
    if (isUndefined(id) || !tour.isActive.value) {
      if (!isNull(rect.value)) rect.value = null
      return
    }

    const step = tour.steps.get(id)
    if (tour.isLast.value || step?.noActivator === true) {
      if (!isNull(rect.value)) rect.value = null
      return
    }

    const activator = tour.activators.get(id)
    if (!activator) {
      if (!isNull(rect.value)) rect.value = null
      return
    }

    const el = toElement(activator.element)
    if (!el) {
      if (!isNull(rect.value)) rect.value = null
      return
    }

    const bounds = el.getBoundingClientRect()
    const pad = activator.padding ?? padding
    const next = {
      x: bounds.x - pad,
      y: bounds.y - pad,
      width: bounds.width + pad * 2,
      height: bounds.height + pad * 2,
    }

    if (
      !rect.value
      || rect.value.x !== next.x
      || rect.value.y !== next.y
      || rect.value.width !== next.width
      || rect.value.height !== next.height
    ) {
      rect.value = next
    }

    const raw = Number.parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0
    const radius = Math.min(Math.max(raw, 8), next.width / 2, next.height / 2)
    if (borderRadius.value !== radius) borderRadius.value = radius
  }

  const loop = useRaf(() => {
    updateRect()
    if (tour.isActive.value) loop()
  })

  const held: HTMLElement[] = []

  function releaseInert () {
    for (const el of held) {
      el.inert = false
      delete el.dataset.tourInert
    }
    held.length = 0
  }

  function applyInert () {
    releaseInert()
    if (!IN_BROWSER || !blocking || !tour.isActive.value) return

    const id = tour.selectedId.value
    const activator = isUndefined(id) ? undefined : toElement(tour.activators.get(id)?.element)

    function visit (el: Element) {
      if (!(el instanceof HTMLElement)) return

      const part = el.dataset.part
      if (part === 'content' || part === 'highlight') return

      if (el.querySelector('[data-part="content"], [data-part="highlight"]')) {
        for (const child of el.children) visit(child)
        return
      }

      // The activator element stays operable, including its control. Descend
      // only through ancestors so siblings can still be inert.
      if (!blockActivator && activator && (el === activator || el.contains(activator))) {
        if (el === activator) return
        for (const child of el.children) visit(child)
        return
      }

      el.inert = true
      el.dataset.tourInert = ''
      held.push(el)
    }

    for (const child of document.body.children) visit(child)
  }

  watch(
    () => {
      const id = tour.selectedId.value
      const registered = !isUndefined(id) && tour.activators.has(id)
      return [tour.isActive.value, id, registered, blocking, blockActivator] as const
    },
    () => applyInert(),
    // Sync so stop()/complete() clear inert before they restore focus.
    // A post flush leaves the opener inert for that focus() call.
    { flush: 'sync', immediate: true },
  )

  onScopeDispose(releaseInert)

  watch(() => tour.isActive.value, active => {
    if (active) {
      loop()
      return
    }
    loop.cancel()
    rect.value = null
  }, { immediate: true })

  const showCutout = toRef(() => !isNull(rect.value))
  const bare = toRef(() => {
    const id = tour.selectedId.value
    if (!tour.isActive.value || isUndefined(id)) return false
    if (tour.isLast.value) return true
    return tour.steps.get(id)?.noActivator === true
  })

  const clipPath = toRef(() => {
    if (isNull(rect.value)) return undefined

    const { x, y, width, height } = rect.value
    const r = borderRadius.value

    if (r > 0) {
      return `path(evenodd, "M 0 0 H 100000 V 100000 H 0 Z M ${x + r} ${y} H ${x + width - r} Q ${x + width} ${y} ${x + width} ${y + r} V ${y + height - r} Q ${x + width} ${y + height} ${x + width - r} ${y + height} H ${x + r} Q ${x} ${y + height} ${x} ${y + height - r} V ${y + r} Q ${x} ${y} ${x + r} ${y} Z")`
    }

    return `path(evenodd, "M 0 0 H 100000 V 100000 H 0 Z M ${x} ${y} V ${y + height} H ${x + width} V ${y} Z")`
  })

  const slotProps = toRef((): TourHighlightSlotProps => ({
    isActive: tour.isActive.value,
  }))

  const overlayStyle = toRef(() => ({
    position: 'fixed' as const,
    inset: '0',
    pointerEvents: 'none' as const,
  }))

  const svgStyle = {
    position: 'absolute' as const,
    inset: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none' as const,
  }

  const blockStyle = toRef(() => ({
    position: 'absolute' as const,
    inset: '0',
    pointerEvents: 'auto' as const,
    clipPath: clipPath.value,
  }))

  const bareShield = {
    position: 'absolute' as const,
    inset: '0',
    pointerEvents: 'auto' as const,
  }

  const cutoutStyle = toRef(() => {
    if (isNull(rect.value)) return undefined

    return {
      position: 'absolute' as const,
      pointerEvents: 'auto' as const,
      left: `${rect.value.x}px`,
      top: `${rect.value.y}px`,
      width: `${rect.value.width}px`,
      height: `${rect.value.height}px`,
      borderRadius: `${borderRadius.value}px`,
    }
  })
</script>

<template>
  <slot v-bind="slotProps" />

  <Portal v-if="tour.isActive.value" :promote="0" :scrim="false">
    <template #default="{ zIndex }">
      <div
        aria-hidden="true"
        data-part="highlight"
        data-scope="tour"
        :style="{ ...overlayStyle, zIndex }"
      >
        <div
          v-if="blocking && bare"
          aria-hidden="true"
          data-part="shield"
          :style="bareShield"
        />

        <div
          v-if="blocking && showCutout && rect"
          aria-hidden="true"
          :style="blockStyle"
        />

        <div
          v-if="blockActivator && showCutout && rect"
          aria-hidden="true"
          :style="cutoutStyle"
        />

        <svg v-if="bare" aria-hidden="true" :style="svgStyle">
          <rect
            fill="currentColor"
            height="100%"
            :opacity
            width="100%"
          />
        </svg>

        <svg v-else-if="showCutout && rect" aria-hidden="true" :style="svgStyle">
          <defs>
            <mask :id="maskId">
              <rect fill="white" height="100%" width="100%" />

              <rect
                fill="black"
                :height="rect.height"
                :rx="borderRadius"
                :ry="borderRadius"
                :width="rect.width"
                :x="rect.x"
                :y="rect.y"
              />
            </mask>
          </defs>

          <rect
            fill="currentColor"
            height="100%"
            :mask="`url(#${maskId})`"
            :opacity
            width="100%"
          />

          <rect
            fill="none"
            :height="rect.height"
            :rx="borderRadius"
            :ry="borderRadius"
            stroke="currentColor"
            stroke-width="2"
            :width="rect.width"
            :x="rect.x"
            :y="rect.y"
          />
        </svg>
      </div>
    </template>
  </Portal>
</template>
