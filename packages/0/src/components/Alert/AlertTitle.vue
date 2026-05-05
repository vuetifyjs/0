/**
 * @module AlertTitle
 *
 * @see https://0.vuetifyjs.com/components/semantic/alert
 *
 * @remarks
 * Title component for alert banners. Renders with the ID that Alert.Root
 * references in its aria-labelledby attribute, providing an accessible name
 * for screen readers.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useAlertContext } from './AlertRoot.vue'

  // Utilities
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface AlertTitleProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
  }

  export interface AlertTitleSlotProps {
    /** Attributes to bind to the title element */
    attrs: {
      id: string
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'AlertTitle', inheritAttrs: false })

  defineSlots<{
    default: (props: AlertTitleSlotProps) => any
  }>()

  const {
    as = 'p',
    namespace = 'v0:alert',
  } = defineProps<AlertTitleProps>()

  const attrs = useAttrs()
  const context = useAlertContext(namespace)

  const slotProps = toRef((): AlertTitleSlotProps => ({
    attrs: {
      id: context.titleId,
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
