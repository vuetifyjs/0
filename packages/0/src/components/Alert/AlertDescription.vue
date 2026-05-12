/**
 * @module AlertDescription
 *
 * @see https://0.vuetifyjs.com/components/semantic/alert
 *
 * @remarks
 * Description component for alert banners. Renders with the ID that Alert.Root
 * references in its aria-describedby attribute, associating the body text with
 * the alert container for screen readers.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useAlertContext } from './AlertRoot.vue'

  // Utilities
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface AlertDescriptionProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
  }

  export interface AlertDescriptionSlotProps {
    /** Attributes to bind to the description element */
    attrs: {
      id: string
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'AlertDescription', inheritAttrs: false })

  defineSlots<{
    default: (props: AlertDescriptionSlotProps) => any
  }>()

  const {
    as = 'p',
    namespace = 'v0:alert',
  } = defineProps<AlertDescriptionProps>()

  const attrs = useAttrs()
  const context = useAlertContext(namespace)

  const slotProps = toRef((): AlertDescriptionSlotProps => ({
    attrs: {
      id: context.descriptionId,
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
