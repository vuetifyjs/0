<script lang="ts">
  // Framework
  import { Presence } from '@vuetify/v0'

  // Utilities
  import { toRef, useAttrs } from 'vue'

  export interface BuMessageProps {
    /** Bulma color modifier, rendered as `is-{color}`. */
    color?: 'primary' | 'link' | 'info' | 'success' | 'warning' | 'danger'
    /** Bulma size modifier, rendered as `is-{size}`. */
    size?: 'small' | 'normal' | 'medium' | 'large'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuMessage', inheritAttrs: false })

  defineSlots<{
    /** Message body content. */
    default?: () => any
    /** Header content; when present renders `.message-header` with a delete button. */
    header?: () => any
  }>()

  defineEmits<{
    'update:model-value': [value: boolean]
  }>()

  const {
    color,
    size,
  } = defineProps<BuMessageProps>()

  const model = defineModel<boolean>({ default: true })

  const attrs = useAttrs()

  const classes = toRef(() => [
    color && `is-${color}`,
    size && `is-${size}`,
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
    <article
      class="message"
      :class="classes"
      :data-state="state['data-state']"
      v-bind="attrs"
    >
      <div
        v-if="$slots.header"
        class="message-header"
      >
        <slot name="header" />

        <button
          aria-label="delete"
          class="delete"
          type="button"
          @click="onDelete"
        />
      </div>

      <div class="message-body">
        <slot />
      </div>
    </article>
  </Presence>
</template>
