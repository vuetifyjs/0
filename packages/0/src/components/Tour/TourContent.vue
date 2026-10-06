/**
 * @module TourContent
 *
 * @see https://0.vuetifyjs.com/components/disclosure/tour
 *
 * @remarks
 * Headless overlay for a tour step. Portals to body and positions via CSS
 * anchor with a viewport-edge fallback once the step's activator element
 * is available. Renders only while the parent Root is active.
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
  import { useTour } from '#v0/composables/useTour'

  // Transformers
  import { toElement } from '#v0/composables/toElement'

  // Globals
  import { IN_BROWSER } from '#v0/constants/globals'

  // Utilities
  import { getActiveElement, isUndefined } from '#v0/utilities'
  import { mergeProps, nextTick, toRef, useAttrs, useTemplateRef, watch } from 'vue'

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
  const atomRef = useTemplateRef<AtomExpose>('atom')

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

  const style = toRef((): CSSProperties => {
    const current = activePlacement.value
    const gap = `${offset}px`

    if (current === 'center') {
      return {
        position: 'fixed',
        inset: '0',
        margin: 'auto',
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

      return {
        ...base,
        inset: gap,
        ...PLACEMENT_AREA[current] ?? PLACEMENT_AREA.bottom,
      }
    }

    return {
      'inset': 'auto',
      'position': 'fixed',
      'maxWidth': `calc(100vw - ${offset * 2}px)`,
      'maxHeight': `calc(100vh - ${offset * 2}px)`,
      '--tour-offset': gap,
      ...FALLBACK_EDGE[current] ?? FALLBACK_EDGE.bottom,
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

  function getSlotProps (zIndex: number): TourContentSlotProps {
    return {
      isReady: isReady.value,
      placement: activePlacement.value,
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
