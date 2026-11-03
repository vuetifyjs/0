/**
 * @module TourContent
 *
 * @see https://0.vuetifyjs.com/components/disclosure/tour
 *
 * @remarks
 * Headless overlay for a tour step. Portals to body and positions via CSS
 * anchor with a viewport-edge fallback once the step's activator element
 * is available. Flips to the opposite side when the preferred side does not
 * fit. Renders only while the parent Root is active.
 * The panel is a non-modal dialog: the spotlight target stays operable.
 * Escape stops the tour. Focus moves to the panel unless a field already
 * has it, and returns to the opener when the tour ends.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { Portal } from '#v0/components/Portal'

  // Context
  import { useTourRootContext } from './TourRoot.vue'

  // Composables
  import { useHotkey } from '#v0/composables/useHotkey'
  import { useResizeObserver } from '#v0/composables/useResizeObserver'
  import { useTour } from '#v0/composables/useTour'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Globals
  import { IN_BROWSER } from '#v0/constants/globals'

  import { useTourCard } from './card'

  // Utilities
  import { getActiveElement, isElement, isUndefined } from '#v0/utilities'
  import { mergeProps, nextTick, onBeforeUnmount, shallowRef, toRef, useAttrs, useTemplateRef, watch } from 'vue'

  // Types
  import type { AtomExpose, AtomProps } from '#v0/components/Atom'
  import type { TourPlacement } from '#v0/composables/useTour'
  import type { CSSProperties } from 'vue'

  export type { TourPlacement } from '#v0/composables/useTour'

  export interface TourContentProps extends AtomProps {
    /** Preferred placement relative to the activator @default 'bottom' */
    placement?: TourPlacement
    /** Gap from the activator or viewport edge, in px @default 16 */
    offset?: number
    /** Namespace for dependency injection @default 'v0:tour' */
    namespace?: string
  }

  export interface TourContentSlotProps {
    isReady: boolean
    placement: TourPlacement
    attrs: {
      'role': 'dialog'
      'aria-labelledby': string | undefined
      'aria-describedby': string | undefined
      'data-scope': 'tour'
      'data-part': 'content'
      'tabindex': number
      'style': CSSProperties
    }
  }

  const PLACEMENT_AREA: Record<Exclude<TourPlacement, 'center'>, Record<string, string>> = {
    bottom: { positionArea: 'bottom', justifySelf: 'anchor-center' },
    top: { positionArea: 'top', justifySelf: 'anchor-center' },
    left: { positionArea: 'left', alignSelf: 'anchor-center' },
    right: { positionArea: 'right', alignSelf: 'anchor-center' },
  }

  const FALLBACK_EDGE: Record<Exclude<TourPlacement, 'center'>, Record<string, string>> = {
    bottom: { bottom: 'var(--tour-offset)', left: '50%', transform: 'translateX(-50%)' },
    top: { top: 'var(--tour-offset)', left: '50%', transform: 'translateX(-50%)' },
    left: { top: '50%', left: 'var(--tour-offset)', transform: 'translateY(-50%)' },
    right: { top: '50%', right: 'var(--tour-offset)', transform: 'translateY(-50%)' },
  }

  function isPlacement (value: unknown): value is TourPlacement {
    return value === 'top' || value === 'bottom' || value === 'left' || value === 'right' || value === 'center'
  }

  type TourSide = Exclude<TourPlacement, 'center'>

  function opposite (side: TourSide): TourSide {
    switch (side) {
      case 'top': { return 'bottom'
      }
      case 'bottom': { return 'top'
      }
      case 'left': { return 'right'
      }
      case 'right': { return 'left'
      }
    }
  }

  function roomFor (side: TourSide, activator: DOMRect, width: number, height: number, gap: number): number {
    switch (side) {
      case 'bottom': { return window.innerHeight - activator.bottom - gap - height
      }
      case 'top': { return activator.top - gap - height
      }
      case 'right': { return window.innerWidth - activator.right - gap - width
      }
      case 'left': { return activator.left - gap - width
      }
    }
  }

  /** Viewport-edge fallback. A zero-size card keeps the preferred side. */
  function choose (preferred: TourSide, activator: DOMRect, width: number, height: number, gap: number): TourSide {
    if (width === 0 || height === 0) return preferred

    const preferredRoom = roomFor(preferred, activator, width, height, gap)
    if (preferredRoom >= 0) return preferred

    const other = opposite(preferred)
    const otherRoom = roomFor(other, activator, width, height, gap)
    return otherRoom > preferredRoom ? other : preferred
  }

  /** Anchor path. The inline position-area stays the preference; the box is the side in use. */
  function used (preferred: TourPlacement, content: DOMRect, activator: DOMRect): TourPlacement {
    if (preferred === 'center') return 'center'
    if (content.width === 0 || content.height === 0 || activator.width === 0 || activator.height === 0) return preferred

    if (preferred === 'top' || preferred === 'bottom') {
      const contentMid = content.top + content.height / 2
      const activatorMid = activator.top + activator.height / 2
      return contentMid < activatorMid ? 'top' : 'bottom'
    }

    const contentMid = content.left + content.width / 2
    const activatorMid = activator.left + activator.width / 2
    return contentMid < activatorMid ? 'left' : 'right'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'TourContent', inheritAttrs: false })

  defineSlots<{
    default: (props: TourContentSlotProps) => any
  }>()

  const {
    as = 'div',
    renderless,
    placement = 'bottom',
    offset = 16,
    namespace = 'v0:tour',
  } = defineProps<TourContentProps>()

  const attrs = useAttrs()
  const root = useTourRootContext(namespace)
  const tour = useTour(namespace)
  const card = useTourCard(tour)
  const atomRef = useTemplateRef<AtomExpose>('atom')
  const el = toRef(() => toElement(atomRef.value?.element) ?? null)

  const supportsAnchor = IN_BROWSER && CSS.supports?.('position-area', 'top') === true

  const isReady = toRef(() => {
    if (!IN_BROWSER || !root.isActive.value) return false
    if (tour.steps.get(root.step)?.noActivator === true) return true

    return !isUndefined(toElement(tour.activators.get(root.step)?.element))
  })

  const activePlacement = toRef((): TourPlacement => {
    if (tour.steps.get(root.step)?.noActivator === true) return 'center'

    const fromTicket = tour.steps.get(root.step)?.placement

    return isPlacement(fromTicket) ? fromTicket : placement
  })

  const resolved = shallowRef<TourPlacement>(activePlacement.value)

  watch(activePlacement, value => {
    resolved.value = value
  })

  const style = toRef((): CSSProperties => {
    const current = activePlacement.value
    const gap = `${offset}px`

    if (current === 'center') {
      return {
        position: 'fixed',
        inset: '0',
        marginInline: 'auto',
        marginBlock: 'auto',
        width: 'max-content',
        height: 'max-content',
        maxWidth: `calc(100vw - ${offset * 2}px)`,
        maxHeight: `calc(100vh - ${offset * 2}px)`,
      }
    }

    if (supportsAnchor) {
      const base = {
        position: 'fixed' as const,
        width: 'max-content',
        height: 'max-content',
        maxWidth: `calc(100vw - ${offset * 2}px)`,
        maxHeight: `calc(100vh - ${offset * 2}px)`,
        positionAnchor: `--tour-${root.step}`,
      }

      const fallbacks = current === 'left' || current === 'right' ? 'flip-inline' : 'flip-block'

      return {
        ...base,
        inset: gap,
        ...PLACEMENT_AREA[current] ?? PLACEMENT_AREA.bottom,
        ...{ positionTryFallbacks: fallbacks } as CSSProperties,
      }
    }

    const side: TourSide = resolved.value === 'center' ? 'bottom' : resolved.value

    return {
      'inset': 'auto',
      'position': 'fixed',
      'maxWidth': `calc(100vw - ${offset * 2}px)`,
      'maxHeight': `calc(100vh - ${offset * 2}px)`,
      '--tour-offset': gap,
      ...FALLBACK_EDGE[side] ?? FALLBACK_EDGE.bottom,
    }
  })

  const isVisible = toRef(() => root.isActive.value && isReady.value)

  function isField () {
    const active = getActiveElement()
    const tag = active?.tagName
    const role = active?.getAttribute('role')

    return tag === 'INPUT'
      || tag === 'TEXTAREA'
      || tag === 'SELECT'
      || role === 'textbox'
      || active?.getAttribute('contenteditable') === 'true'
      || active?.hasAttribute('contenteditable') === true
  }

  watch(isReady, ready => {
    if (!ready || !IN_BROWSER || isField()) return

    nextTick(() => {
      const element = toElement(atomRef.value?.element)
      if (element instanceof HTMLElement) element.focus({ preventScroll: true })
    })
  }, { immediate: true })

  useHotkey(() => isVisible.value ? 'escape' : undefined, event => {
    const target = event.target
    if (target instanceof Element && target.closest('dialog[open]')) return

    event.preventDefault()
    root.stop()
  }, { inputs: true, preventDefault: false })

  function clear () {
    if (card.value?.step !== root.step) return
    card.value = null
  }

  function publish () {
    if (!isVisible.value) return

    const element = el.value
    if (!isElement(element)) return

    const box = element.getBoundingClientRect()
    if (box.width === 0 || box.height === 0) return

    const preferred = activePlacement.value
    const activator = toElement(tour.activators.get(root.step)?.element)
    let side = preferred

    if (isElement(activator) && preferred !== 'center') {
      const target = activator.getBoundingClientRect()
      side = supportsAnchor
        ? used(preferred, box, target)
        : choose(preferred, target, box.width, box.height, offset)
    }

    const current = card.value
    if (
      resolved.value === side
      && current?.step === root.step
      && current.placement === side
      && current.width === box.width
      && current.height === box.height
      && current.offset === offset
    ) return

    resolved.value = side
    card.value = {
      step: root.step,
      placement: side,
      width: box.width,
      height: box.height,
      offset,
    }
  }

  // A flip changes position without changing size, so a resize observer
  // alone can miss it. Read the box again on the next frame.
  function schedule () {
    if (!IN_BROWSER) return
    nextTick(() => {
      requestAnimationFrame(() => publish())
    })
  }

  useResizeObserver(el, schedule)

  watch(isVisible, visible => {
    if (!visible) {
      clear()
      return
    }
    schedule()
  })

  watch(activePlacement, () => {
    if (!isVisible.value) return
    schedule()
  })

  onBeforeUnmount(clear)

  function getSlotProps (zIndex: number): TourContentSlotProps {
    return {
      isReady: isReady.value,
      placement: resolved.value,
      attrs: {
        'role': 'dialog',
        'aria-labelledby': root.hasTitle.value ? root.titleId : undefined,
        'aria-describedby': root.hasDescription.value ? root.descriptionId : undefined,
        'data-scope': 'tour',
        'data-part': 'content',
        'tabindex': -1,
        'style': {
          ...style.value,
          zIndex,
        },
      },
    }
  }
</script>

<template>
  <Portal v-if="isVisible" :promote="1" :scrim="false">
    <template #default="{ zIndex }">
      <Atom
        ref="atom"
        v-bind="mergeProps(attrs, getSlotProps(zIndex).attrs)"
        :as
        :renderless
      >
        <slot v-bind="getSlotProps(zIndex)" />
      </Atom>
    </template>
  </Portal>
</template>
