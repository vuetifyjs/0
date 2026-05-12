/**
 * @module AlertAction
 *
 * @see https://0.vuetifyjs.com/components/semantic/alert
 *
 * @remarks
 * Dismiss button for alert banners. Calls dismiss() from the alert context when
 * clicked, which sets v-model to false. Receives an accessible label from the
 * locale system so it announces correctly to screen readers even when rendered
 * as an icon-only button.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'
  import { useAlertContext } from './AlertRoot.vue'

  // Composables
  import { useLocale } from '#v0/composables/useLocale'

  // Utilities
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'

  export interface AlertActionProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
  }

  export interface AlertActionSlotProps {
    /** Whether the alert has been dismissed */
    isDismissed: boolean
    /** Attributes to bind to the action element */
    attrs: {
      'type': 'button' | undefined
      'aria-label': string
    }
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'AlertAction', inheritAttrs: false })

  defineSlots<{
    default: (props: AlertActionSlotProps) => any
  }>()

  const {
    as = 'button',
    namespace = 'v0:alert',
  } = defineProps<AlertActionProps>()

  const attrs = useAttrs()
  const context = useAlertContext(namespace)
  const locale = useLocale()

  function onClick () {
    context.dismiss()
  }

  const slotProps = toRef((): AlertActionSlotProps => ({
    isDismissed: !context.isVisible.value,
    attrs: {
      'type': as === 'button' ? 'button' : undefined,
      'aria-label': locale.t('Alert.dismiss'),
    },
  }))
</script>

<template>
  <Atom
    :as
    v-bind="mergeProps(attrs, slotProps.attrs)"
    @click="onClick"
  >
    <slot v-bind="slotProps" />
  </Atom>
</template>
