<script lang="ts">
  // Framework
  import { createContext, Presence } from '@vuetify/v0'

  // Utilities
  import { toRef, useAttrs } from 'vue'

  export interface BuNotificationProps {
    /** Bulma color modifier, rendered as `is-{color}`. */
    color?: 'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger'
    /** Light color variant, rendered as `is-light`. */
    light?: boolean
  }

  export interface BuNotificationContext {
    /** Dismiss the notification — drives BuNotificationDelete. */
    close: () => void
  }

  // Only the parent provides, so the provider stays module-local; parts import
  // the hook.
  const [useBuNotification, provideBuNotification] = createContext<BuNotificationContext | null>('bulma:notification', null)

  export { useBuNotification }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuNotification', inheritAttrs: false })

  defineSlots<{
    /** Notification content — compose BuNotificationDelete first to match the documented shape. */
    default?: () => any
  }>()

  defineEmits<{
    'update:model-value': [value: boolean]
  }>()

  const {
    color,
    light = false,
  } = defineProps<BuNotificationProps>()

  const model = defineModel<boolean>({ default: true })

  const attrs = useAttrs()

  const classes = toRef(() => [
    color && `is-${color}`,
    light && 'is-light',
  ])

  provideBuNotification({
    close: () => {
      model.value = false
    },
  })
</script>

<template>
  <Presence
    v-slot="{ attrs: state }"
    v-model="model"
  >
    <div
      class="notification"
      :class="classes"
      :data-state="state['data-state']"
      v-bind="attrs"
    >
      <slot />
    </div>
  </Presence>
</template>
