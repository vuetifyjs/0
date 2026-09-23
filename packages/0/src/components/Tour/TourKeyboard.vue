/**
 * @module TourKeyboard
 *
 * @see https://0.vuetifyjs.com/components/disclosure/tour
 *
 * @remarks
 * Renderless keyboard bindings for an active tour. Arrow keys move when
 * the focused node is not a composite widget. Enter advances unless a
 * control is focused. Escape stops.
 */

<script lang="ts">
  // Composables
  import { useTour } from '#v0/composables/createTour'
  import { useHotkey } from '#v0/composables/useHotkey'

  // Utilities
  import { getActiveElement } from '#v0/utilities'

  const WIDGET = '[role="slider"], [role="tablist"], [role="listbox"], [role="radiogroup"], [role="menu"], select'

  export interface TourKeyboardProps {
    /** Hotkey that moves to the previous step @default 'arrowleft' */
    prev?: string
    /** Hotkey that moves to the next step @default 'arrowright' */
    next?: string
    /** Hotkey that stops the tour @default 'escape' */
    stop?: string
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

  function onEnter (event: KeyboardEvent) {
    if (event.repeat || isControlFocused()) return
    event.preventDefault()
    onAdvance()
  }

  function isWidget (event: KeyboardEvent) {
    const target = event.target
    return target instanceof Element && Boolean(target.closest(WIDGET))
  }

  function onNext (event: KeyboardEvent) {
    if (event.repeat || isWidget(event) || !tour.isReady.value) return
    event.preventDefault()
    onAdvance()
  }

  function onPrev (event: KeyboardEvent) {
    if (event.repeat || isWidget(event) || !tour.isReady.value) return
    event.preventDefault()
    void tour.prev()
  }

  function onStop () {
    tour.stop()
  }

  useHotkey(() => tour.isActive.value ? prev : undefined, onPrev, { preventDefault: false })
  useHotkey(() => tour.isActive.value ? next : undefined, onNext, { preventDefault: false })
  useHotkey(() => tour.isActive.value ? stop : undefined, onStop, { inputs: true })
  useHotkey(() => tour.isActive.value ? 'enter' : undefined, onEnter, { preventDefault: false })
</script>

<template>
  <slot />
</template>
