/**
 * @module AlertRoot
 *
 * @see https://0.vuetifyjs.com/components/semantic/alert
 *
 * @remarks
 * Root component for inline alert banners. Renders with `role="alert"` so screen
 * readers announce the content automatically when it enters the DOM. Manages optional
 * dismiss state via v-model — set to false to hide, or call dismiss() from slot props.
 */

<script lang="ts">
  // Components
  import { Atom } from '#v0/components/Atom'

  // Composables
  import { createContext } from '#v0/composables/createContext'

  // Utilities
  import { useId } from '#v0/utilities'
  import { mergeProps, toRef, useAttrs } from 'vue'

  // Types
  import type { AtomProps } from '#v0/components/Atom'
  import type { Ref } from 'vue'

  export interface AlertContext {
    id: string
    titleId: string
    descriptionId: string
    isVisible: Ref<boolean>
    dismiss: () => void
  }

  export interface AlertRootProps extends AtomProps {
    /** Namespace for dependency injection */
    namespace?: string
    /** Unique identifier (auto-generated if not provided) */
    id?: string
  }

  export interface AlertRootSlotProps {
    /** Unique identifier */
    id: string
    /** Whether the alert has been dismissed */
    isDismissed: boolean
    /** Dismiss the alert (sets v-model to false) */
    dismiss: () => void
    /** Attributes to apply to the alert element */
    attrs: {
      'id': string
      'role': 'alert'
      'data-state': 'visible' | 'dismissed'
      'aria-labelledby': string
      'aria-describedby': string
    }
  }

  export const [useAlertContext, provideAlertContext] = createContext<AlertContext>()
</script>

<script setup lang="ts">
  defineOptions({ name: 'AlertRoot', inheritAttrs: false })

  defineSlots<{
    default: (props: AlertRootSlotProps) => any
  }>()

  defineEmits<{
    'update:model-value': [value: boolean]
  }>()

  const {
    as = 'div',
    namespace = 'v0:alert',
    id: _id,
  } = defineProps<AlertRootProps>()

  const attrs = useAttrs()
  const id = _id ?? useId()
  const titleId = `${id}-title`
  const descriptionId = `${id}-description`

  const isVisible = defineModel<boolean>({ default: true })

  function dismiss () {
    isVisible.value = false
  }

  provideAlertContext(namespace, {
    id,
    titleId,
    descriptionId,
    isVisible,
    dismiss,
  })

  const slotProps = toRef((): AlertRootSlotProps => ({
    id,
    isDismissed: !isVisible.value,
    dismiss,
    attrs: {
      'id': id,
      'role': 'alert',
      'data-state': isVisible.value ? 'visible' : 'dismissed',
      'aria-labelledby': titleId,
      'aria-describedby': descriptionId,
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
