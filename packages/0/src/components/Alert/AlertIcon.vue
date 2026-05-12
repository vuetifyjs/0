/**
 * @module AlertIcon
 *
 * @see https://0.vuetifyjs.com/components/semantic/alert
 *
 * @remarks
 * Icon slot for alert banners. Renders with aria-hidden="true" by default because
 * alert icons are decorative — the semantic meaning is carried by the text content.
 * Pass aria-label to make the icon meaningful to screen readers when it communicates
 * information beyond what the text already conveys.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useAlertContext } from './AlertRoot.vue'

  // Utilities
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface AlertIconProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
  }

  export interface AlertIconSlotProps {
    /** Attributes to bind to the icon element */
    attrs: {
      'aria-hidden': 'true'
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'AlertIcon', inheritAttrs: false })

  defineSlots<{
    default: (props: AlertIconSlotProps) => any
  }>()

  const {
    as = 'span',
    namespace = 'v0:alert',
  } = defineProps<AlertIconProps>()

  const attrs = useAttrs()

  // Consume context to ensure correct nesting — no state reads needed
  useAlertContext(namespace)

  const slotProps = toRef((): AlertIconSlotProps => ({
    attrs: {
      'aria-hidden': 'true',
    },
  }))
</script>

<template>
  <Atom
    :as
    v-bind="mergeProps(attrs, slotProps.attrs)"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
