/**
 * @module Scrim
 *
 * @remarks
 * Scrim/backdrop component for overlays. Integrates with createStack
 * to provide a shared backdrop for all active overlays. Automatically
 * positions itself behind the topmost overlay and handles dismiss behavior.
 *
 * @see https://0.vuetifyjs.com/components/providers/scrim
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { StackContext } from '#v0/composables/createStack'

  export interface ScrimProps extends AtomProps {
    /**
     * Custom stack context to use instead of the global stack
     *
     * @remarks Useful when multiple independent overlay systems exist in an app.
     */
    stack?: StackContext
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
    /** Whether any overlays are active */
    isActive: boolean
    /** Whether the topmost overlay is blocking */
    isBlocking: boolean
    /** Z-index for the scrim (one below top overlay) */
    zIndex: number
    /** Dismiss the topmost non-blocking overlay */
    dismiss: () => void
  }
</script>

<script setup lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { stack as globalStack } from '#v0/composables/createStack'

  // Utilities
  import { toRef, useAttrs } from 'vue'

  defineOptions({ name: 'Scrim', inheritAttrs: false })

  defineSlots<{
    default: (props: ScrimSlotProps) => any
  }>()

  const {
    as = 'div',
    stack = globalStack,
    transition = 'fade',
    teleport = true,
    teleportTo = 'body',
  } = defineProps<ScrimProps>()

  const attrs = useAttrs()

  function onClick () {
    if (!stack.isBlocking.value) {
      stack.dismiss()
    }
  }

  const slotProps = toRef((): ScrimSlotProps => ({
    isActive: stack.isActive.value,
    isBlocking: stack.isBlocking.value,
    zIndex: stack.scrimZIndex.value,
    dismiss: () => stack.dismiss(),
  }))

  const style = toRef(() => ({
    zIndex: stack.scrimZIndex.value,
  }))
</script>

<template>
  <Teleport
    v-if="teleport"
    :to="teleportTo"
  >
    <Transition :name="transition">
      <Atom
        v-if="stack.isActive.value"
        :as
        :style
        v-bind="attrs"
        @click="onClick"
      >
        <slot v-bind="slotProps" />
      </Atom>
    </Transition>
  </Teleport>

  <Transition
    v-else
    :name="transition"
  >
    <Atom
      v-if="stack.isActive.value"
      :as
      :style
      v-bind="attrs"
      @click="onClick"
    >
      <slot v-bind="slotProps" />
    </Atom>
  </Transition>
</template>
