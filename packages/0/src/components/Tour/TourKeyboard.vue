/**
 * @module TourKeyboard
 *
 * @see https://0.vuetifyjs.com/components/disclosure/tour
 *
 * @remarks
 * Renderless keyboard bindings for an active tour. Arrow keys move,
 * Enter advances (unless a control is focused), Escape stops. Optional
 * capture-phase lock swallows unrelated keys.
 */

<script lang="ts">
  // Composables
  import { useTour } from '#v0/composables/createTour'
  import { useDocumentEventListener } from '#v0/composables/useEventListener'
  import { useHotkey } from '#v0/composables/useHotkey'
  import { useToggleScope } from '#v0/composables/useToggleScope'

  // Utilities
  import { getActiveElement } from '#v0/utilities'

  const ALLOWED = new Set(['Escape', 'Tab', 'ArrowLeft', 'ArrowRight', 'Enter'])

  export interface TourKeyboardProps {
    /** Hotkey that moves to the previous step @default 'arrowleft' */
    prev?: string
    /** Hotkey that moves to the next step @default 'arrowright' */
    next?: string
    /** Hotkey that stops the tour @default 'escape' */
    stop?: string
    /**
     * When true and the tour is active, capture-phase keydown swallows keys
     * other than Escape, Tab, arrows, Enter, and Space-on-a-focused-control.
     * @default false
     */
    lock?: boolean
    /** Namespace for dependency injection @default 'v0:tour' */
    namespace?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'TourKeyboard' })

  defineSlots<{
    default: () => any
  }>()

  const {
    prev = 'arrowleft',
    next = 'arrowright',
    stop = 'escape',
    lock = false,
    namespace = 'v0:tour',
  } = defineProps<TourKeyboardProps>()

  const tour = useTour(namespace)

  function isControlFocused () {
    const active = getActiveElement() as HTMLElement | null
    return !!active?.closest('button, a[href], [role="button"]')
  }

  function onAdvance () {
    if (!tour.isReady.value) return
    if (tour.isLast.value) {
      tour.complete()
      return
    }
    void tour.next()
  }

  function onEnter (e: KeyboardEvent) {
    if (isControlFocused()) return
    e.preventDefault()
    onAdvance()
  }

  function onNext () {
    onAdvance()
  }

  function onPrev () {
    void tour.prev()
  }

  function onStop () {
    tour.stop()
  }

  useHotkey(() => tour.isActive.value ? prev : undefined, onPrev)
  useHotkey(() => tour.isActive.value ? next : undefined, onNext)
  useHotkey(() => tour.isActive.value ? stop : undefined, onStop, { inputs: true })
  useHotkey(() => tour.isActive.value ? 'enter' : undefined, onEnter, { preventDefault: false })

  function onLock (e: KeyboardEvent) {
    if (e.key === ' ' && isControlFocused()) return
    if (ALLOWED.has(e.key)) return
    e.preventDefault()
    e.stopImmediatePropagation()
  }

  useToggleScope(
    () => lock && tour.isActive.value,
    () => {
      useDocumentEventListener('keydown', onLock, { capture: true })
    },
  )
</script>

<template>
  <slot />
</template>
