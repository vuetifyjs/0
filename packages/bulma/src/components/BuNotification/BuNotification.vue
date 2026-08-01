<script lang="ts">
  // Framework
  import { Presence } from '@vuetify/v0'

  // Utilities
  import { toRef, useAttrs } from 'vue'

  export interface BuNotificationProps {
    /** Bulma color modifier, rendered as `is-{color}`. */
    color?: 'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger'
    /** Light color variant, rendered as `is-light`. */
    light?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuNotification', inheritAttrs: false })

  defineSlots<{
    /** Notification content, rendered after the delete button. */
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

  function onDelete () {
    model.value = false
  }
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
      <!-- Deliberate a11y addition: upstream fixture ships this button unlabeled -->
      <button
        aria-label="delete"
        class="delete"
        type="button"
        @click="onDelete"
      />

      <slot />
    </div>
  </Presence>
</template>
