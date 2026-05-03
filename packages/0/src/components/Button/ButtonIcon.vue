/**
 * @module ButtonIcon
 *
 * @see https://0.vuetifyjs.com/components/actions/button
 *
 * @remarks
 * Icon wrapper with accessibility enforcement. Sets aria-hidden on itself
 * and detects icon-only buttons to warn when aria-label is missing.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Context
  import { useButtonRoot } from './ButtonRoot.vue'

  // Utilities
  import { onMounted, toRef } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface ButtonIconProps extends AtomProps {
    /** Namespace for context injection from parent Button.Root */
    namespace?: string
  }

  export interface ButtonIconSlotProps {
    /** Whether this is an icon-only button */
    isSolo: boolean
    /** Attributes to bind to the icon element */
    attrs: {
      'aria-hidden': true
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'ButtonIcon' })

  defineSlots<{
    default: (props: ButtonIconSlotProps) => any
  }>()

  const {
    as = 'span',
    renderless,
    namespace = 'v0:button:root',
  } = defineProps<ButtonIconProps>()

  const root = useButtonRoot(namespace)

  onMounted(() => {
    if (root.single.size > 0) return
    root.isSolo.value = true
  })

  const slotProps = toRef((): ButtonIconSlotProps => ({
    isSolo: root.isSolo.value,
    attrs: {
      'aria-hidden': true,
    },
  }))
</script>

<template>
  <Atom
    v-bind="slotProps.attrs"
    :as
    :renderless
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
