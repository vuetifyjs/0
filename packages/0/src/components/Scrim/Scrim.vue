/**
 * @module Scrim
 *
 * @remarks
 * Scrim/backdrop component for overlays. Integrates with useStack
 * to render one backdrop per active overlay. The cumulative visual
 * effect creates natural opacity stacking.
 *
 * Requires createStackPlugin to be installed at app level.
 *
 * @see https://0.vuetifyjs.com/components/providers/scrim
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { StackTicket } from '#v0/composables/useStack'

  export interface ScrimProps extends AtomProps {
    /**
     * Transition name for enter/leave animations
     *
     * @default 'fade'
     */
    transition?: string
    /**
     * Whether to teleport the scrim to the body element
     *
     * @default true
     */
    teleport?: boolean
    /**
     * Target selector or element for teleport
     *
     * @default 'body'
     */
    teleportTo?: string | HTMLElement
  }

  export interface ScrimSlotProps {
    /** The ticket for this scrim layer */
    ticket: StackTicket
    /** Z-index for this scrim layer (one below the overlay) */
    zIndex: number
    /** Whether this ticket's overlay blocks scrim dismissal */
    isBlocking: boolean
    /** Dismiss this overlay */
    dismiss: () => void
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { useStack } from '#v0/composables/useStack'

  // Utilities
  import { computed, useAttrs } from 'vue'

  defineOptions({ name: 'Scrim', inheritAttrs: false })

  defineSlots<{
    default: (props: ScrimSlotProps) => any
  }>()

  const {
    as = 'div',
    transition = 'fade',
    teleport = true,
    teleportTo = 'body',
  } = defineProps<ScrimProps>()

  const attrs = useAttrs()
  const stack = useStack()

  const tickets = computed(() => Array.from(stack.selectedItems.value))

  function onDismiss (ticket: StackTicket) {
    if (!ticket.blocking) {
      ticket.dismiss()
    }
  }

  function getSlotProps (ticket: StackTicket): ScrimSlotProps {
    return {
      ticket,
      zIndex: ticket.zIndex.value - 1,
      isBlocking: ticket.blocking,
      dismiss: () => onDismiss(ticket),
    }
  }

  function getStyle (ticket: StackTicket) {
    return { zIndex: ticket.zIndex.value - 1 }
  }
</script>

<template>
  <Teleport
    v-if="teleport"
    :to="teleportTo"
  >
    <TransitionGroup :name="transition">
      <Atom
        v-for="ticket in tickets"
        :key="ticket.id"
        :as
        :style="getStyle(ticket)"
        v-bind="attrs"
        @click="() => onDismiss(ticket)"
      >
        <slot v-bind="getSlotProps(ticket)" />
      </Atom>
    </TransitionGroup>
  </Teleport>

  <TransitionGroup
    v-else
    :name="transition"
  >
    <Atom
      v-for="ticket in tickets"
      :key="ticket.id"
      :as
      :style="getStyle(ticket)"
      v-bind="attrs"
      @click="() => onDismiss(ticket)"
    >
      <slot v-bind="getSlotProps(ticket)" />
    </Atom>
  </TransitionGroup>
</template>
