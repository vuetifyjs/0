/**
 * @module ScrimRoot
 *
 * @remarks
 * Root component for scrim/backdrop overlays. Integrates with createStack
 * to provide a shared backdrop for all active overlays. Automatically
 * positions itself behind the topmost overlay and handles dismiss behavior.
 *
 * @see https://0.vuetifyjs.com/components/providers/scrim
 */

<script lang="ts">
  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { StackContext } from '#v0/composables/createStack'

  export interface ScrimRootProps extends AtomProps {
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

  export interface ScrimRootSlotProps {
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
  import { toRef } from 'vue'

  defineOptions({ name: 'ScrimRoot' })

  defineSlots<{
    default: (props: ScrimRootSlotProps) => any
  }>()

  const {
    as = 'div',
    stack = globalStack,
    transition = 'fade',
    teleport = true,
    teleportTo = 'body',
  } = defineProps<ScrimRootProps>()

  function onClick () {
    if (!stack.isBlocking.value) {
      stack.dismiss()
    }
  }

  const slotProps = toRef((): ScrimRootSlotProps => ({
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
      @click="onClick"
    >
      <slot v-bind="slotProps" />
    </Atom>
  </Transition>
</template>
