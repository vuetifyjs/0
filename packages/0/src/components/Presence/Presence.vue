<script lang="ts">
  /**
   * @module Presence
   *
   * @see https://0.vuetifyjs.com/components/presence
   *
   * @remarks
   * Renderless component for animation-agnostic mount lifecycle.
   *
   * Wraps usePresence composable, exposing lifecycle state via
   * slot props. Content is conditionally rendered based on
   * isMounted — stays in DOM during the leaving state to allow
   * exit animations.
   *
   * Key features:
   * - v-model driven visibility
   * - Lazy mounting via `lazy` prop
   * - Exit animation support via `done` slot prop
   * - Lifecycle events: `enter`, `leave`, `after-leave`
   * - Animation-agnostic: works with CSS, WAAPI, GSAP, or nothing
   */

  // Composables
  import { usePresence } from '#v0/composables/usePresence'

  // Utilities
  import { toRef, watch } from 'vue'

  // Types
  import type { PresenceState } from '#v0/composables/usePresence'

  export interface PresenceProps {
    /** Delay first mount until present is first true. @default false */
    lazy?: boolean
    /** Auto-resolve LEAVING state next tick if done() not called. @default true */
    immediate?: boolean
  }

  export interface PresenceAttrs {
    /** Current lifecycle state for CSS selectors. */
    'data-state': PresenceState
    /** Hidden when lazy content is not present. */
    'hidden'?: boolean
  }

  export interface PresenceSlotProps {
    /** Attributes to bind to the content element. */
    attrs: PresenceAttrs
    /** Whether the content is logically present. */
    isPresent: boolean
    /** Whether an exit is in progress. */
    isLeaving: boolean
    /** Call when exit animation finishes. */
    done: () => void
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Presence' })

  defineSlots<{
    default: (props: PresenceSlotProps) => any
  }>()

  /**
   * @event enter Content mounted in DOM (enter animation can start)
   * @event leave Exit started, content still in DOM (exit animation can start)
   * @event after-leave Exit complete, content about to be removed from DOM
   */
  const emit = defineEmits<{
    'enter': []
    'leave': []
    'after-leave': []
  }>()

  const model = defineModel<boolean>({ default: false })

  const {
    lazy = false,
    immediate = true,
  } = defineProps<PresenceProps>()

  const presence = usePresence({
    present: model,
    lazy,
    immediate,
  })

  const slotProps = toRef((): PresenceSlotProps => {
    const state = presence.state.value
    const attrs: PresenceAttrs = { 'data-state': state }

    // In lazy mode, hide content when not present and not leaving
    if (lazy && state === 'mounted') {
      attrs.hidden = true
    }

    return {
      attrs,
      isPresent: presence.isPresent.value,
      isLeaving: presence.isLeaving.value,
      done: presence.done,
    }
  })

  watch(presence.state, (state, prev) => {
    if (state === 'mounted' && prev === 'unmounted') emit('enter')
    else if (state === 'leaving') emit('leave')
    else if (prev === 'leaving' && (state === 'unmounted' || state === 'mounted')) emit('after-leave')
  })
</script>

<template>
  <slot
    v-if="presence.isMounted.value"
    v-bind="slotProps"
  />
</template>
